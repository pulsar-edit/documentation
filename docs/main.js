function debounce (fn, delay) {
  let timeout = null;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay, ...args);
  };
}

class AutoTOC {
  constructor ({ minHeadings = 3 } = {}) {
    this.main = document.querySelector('main');
    this.target = document.querySelector('.sidebar__toc');
    if (!this.target) return;
    this.root = { children: [] };

    // Only consider headings with IDs.
    let headings = Array.from(this.main.querySelectorAll(':is(h1, h2, h3, h4, h5, h6)[id]'));
    // If there are a trivial number of headings on the page, don't bother.
    if (headings.length < minHeadings) {
      return;
    }

    this.map = new Map();
    this.rootLevel = this.levelForTag(headings[0]);
    this.buildTOC(this.root, headings, this.rootLevel);
    let node = this.renderTOC();

    this.target.appendChild(node);
  }

  buildTOC (root, headings, baseLevel) {
    for (let [index, heading] of headings.entries()) {
      let bundle = this.bundleForTag(heading, index);
      this.map.set(index, bundle);
      let { level } = bundle;
      if (level === baseLevel) {
        root.children.push(bundle);
      } else if (level < baseLevel) {
        continue;
      } else {
        let parent = this.findParentHeadingBundle(level, index);
        if (parent) {
          parent.children.push(bundle);
        } else {
        }
      }
    }
  }

  renderTOC () {
    let html = this.renderList(this.root);
    let fragment = document.createRange().createContextualFragment(html);
    return fragment.children[0];
  }

  renderList (list) {
    let items = list.children.map(child => this.renderListItem(child));
    return `
      <ul>
        ${items.join('\n')}
      </ul>
    `;
  }

  renderListItem (item) {
    let list = '';
    if (item.children.length) {
      list = this.renderList(item);
    }
    return `
      <li>
        <a data-level="${item.level - this.rootLevel}" href="#${item.id}">${item.name}</a>
        ${list}
      </li>
    `;
  }

  findParentHeadingBundle(level, index) {
    let targetLevel = level - 1;
    for (let current = index - 1; current >= 0; current--) {
      let bundle = this.map.get(current);
      if (bundle.level !== targetLevel) continue;
      return bundle;
    }
  }

  bundleForTag (node, index) {
    return { node, name: node.innerText, id: node.id, index, level: this.levelForTag(node), children: [] };
  }

  levelForTag (node) {
    return Number(node.tagName.substring(1));
  }
}

// Highlight the sidebar navigation item that corresponds to the section that
// the user is reading.
class HeadingObserver {
  constructor({ topMargin = 0 }) {
    let sidebar = document.querySelector('.sidebar__toc');
    if (!sidebar) return;

    this.sidebar = sidebar;
    this.activeId = null;
    this.topMargin = topMargin;

    let threshold = [];
    for (let i = 0; i <= 20; i++) {
      threshold.push(i * 0.05);
    }

    let listener = (_entries, _observer) => recheck();
    let recheck = (updateHash = false) => {
      if (this.clickedOnAnchor) return;
      let closest = this.getClosestHeadingToTopOfViewport();
      this.setActive(closest?.id ?? null, { updateHash });
    }

    let debouncedRecheck = debounce(recheck, 200);

    // The scroll listener comes in after the user has stopped scrolling and
    // acts as a catch-all in cases where the `IntersectionObserver` fails.
    window.addEventListener('scroll', () => debouncedRecheck(true));

    this.observer = new IntersectionObserver(
      listener,
      {
        // Draw an imaginary rectangle the size of the viewport, then decrease
        // the height so that the rectangle covers only the top 10% of the
        // viewport.
        //
        // When a heading passes into this imaginary rectangle, that's the
        // active heading.
        //
        // If no heading is within this imaginary rectangle, the active heading
        // is the closest heading _above_ the top edge of the viewport.
        //
        // If no such heading qualifies, the active heading is the closest
        // heading to the top edge of the viewport.
        rootMargin: `${topMargin}px 0px -90% 0px`,
        threshold
      }
    );

    this.ids = [];
    this.headings = [];

    this.sidebar.addEventListener('click', (event) => {
      let link = event.target.closest('a');
      if (!link) return;
      this.didClickLink(link);
    })

    this.scanSidebar();
  }

  scanSidebar() {
    this.pathName = window.location.pathname;
    this.observer.disconnect();

    let links = this.sidebar.querySelectorAll('a');

    for (let link of links) {
      let href = link.getAttribute('href');
      if (!href?.startsWith('#')) {
        if (`${href}/` === this.pathName) {
          link.closest('li')?.classList.add('active');
        }
      }

      let id = href.substring(1);
      let heading = document.getElementById(id);
      if (!heading) continue;

      this.ids.push(id);
      this.headings.push(heading);

      this.observer.observe(heading);
    }
  }

  setActive(id, { updateHash = false } = {}) {
    if (id === null) return;
    this.activeId = id;
    let href = `#${id}`;

    let previousActive = this.sidebar.querySelector('a.active');
    if (previousActive?.getAttribute('href').startsWith('#')) {
      previousActive?.classList.remove('active');
    }

    let linkForId = this.sidebar.querySelector(`a[href="${href}"]`);
    if (!linkForId) return;

    linkForId?.classList.add('active');
    if (updateHash) {
      this.setHistoryEntry(href);
    }
  }

  setHistoryEntry(newHash) {
    let hash = location.hash;
    let newUrl = location.toString().replace(hash, '');
    history.replaceState(null, '', `${newUrl}${newHash}`);
  }

  getClosestHeadingToTopOfViewport() {
    let windowHeight = window.innerHeight;
    let threshold = this.topMargin + (windowHeight * 0.1);
    let previousHeading;
    for (let heading of this.headings) {
      let rect = heading.getBoundingClientRect();
      if (rect.bottom >= threshold) {
        if (previousHeading) {
          return previousHeading;
        } else if (rect.bottom <= windowHeight) {
          // If this is the first heading on the page, we'll still consider it
          // active if it's at least within the viewport.
          return heading;
        } else {
          // Otherwise we have no active heading.
          return null;
        }
      }
      previousHeading = heading;
    }
  }

  didIntersect(entry, observer) {
    let { target, isIntersecting } = entry;
    if (!target.id) return;
    if (!isIntersecting) {
      if (target.id === this.activeId) {
        this.setActive(null);
      }
      return
    };
    if (observer === this.observer) {
      this.setActive(target.id);
      return true;
    }
    if (observer === this.wideObserver && this.activeId === null) {
      this.setActive(target.id);
    }
    return false;
  }

  // Clicking on a link with a heading anchor should always make that link the
  // active link, even if it otherwise wouldn't qualify. (Like if it's a short
  // section at the bottom of the page and cannot reach the top of the
  // viewport.)
  didClickLink(link) {
    let href = link.getAttribute('href');
    if (!href.startsWith('#')) return;

    let id = href.substring(1);
    if (!this.ids.includes(id)) return;

    this.clickedOnAnchor = true;
    requestAnimationFrame(() => this.setActive(id));
    setTimeout(() => this.clickedOnAnchor = false, 300);
  }
}


const Tabs = {
  setup () {
    let nodes = document.getElementsByClassName("tabs-tabs-wrapper");

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];

      let buttons = node.getElementsByClassName("tabs-tab-button");
      let isAnyBtnActive = false;

      for (let y = 0; y < buttons.length; y++) {
        let button = buttons[y];

        if (button.classList.contains("active")) {
          isAnyBtnActive = true;
        }

        button.addEventListener("click", this.onClick.bind(this));
      }

      if (!isAnyBtnActive) {
        // This section has no active buttons. But since we want the first button
        // to be active on page load, we will manually trigger one to be active
        let defaultBtn = buttons[0];
        defaultBtn.click();
      }
    }
  },

  onClick () {
    let button = event.target;
    let wrapper = button.closest('.tabs-tabs-wrapper');
    let section = wrapper.querySelector(`[data-index="${button.dataset.tab}"]`);

    let allButtons = wrapper.getElementsByClassName("tabs-tab-button");
    let allSections = wrapper.getElementsByClassName("tabs-tab-content");

    // Deactivate all buttons
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].classList.remove("active");
    }
    // Deactivate all Sections
    for (let i = 0; i < allSections.length; i++) {
      allSections[i].classList.remove("active");
    }

    // Activate the button
    button.classList.add("active");
    // Activate the Section
    section.classList.add("active");
  }
}

const Hovercards = {
  setup () {
    document.body.addEventListener('click', this.onClick.bind(this));

    this.hovercard = document.getElementById('hovercard');
    let nodes = document.querySelectorAll('[data-hovercard]');
    for (let node of nodes) {
      node.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      node.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
  },

  onClick (event) {
    let hovercard = event.target.closest('[data-hovercard]');
    if (!hovercard) return;
    let href = hovercard.getAttribute('href');
    if (href === '#') {
      event.preventDefault();
    }
  },

  async onMouseEnter (event) {
    let node = event.currentTarget;
    let value = node.dataset.hovercard;
    if (!value) return;

    let targetRect = node.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();

    let top = Math.abs(bodyRect.top) + targetRect.top + targetRect.height;
    let left = Math.abs(bodyRect.left) + targetRect.left + targetRect.width;

    const res = await fetch(`/hovercards/${value}.json`);
    const card = await res.json();

    if (card.empty) return;
    if (node.matches('a[href]') && node.getAttribute('href') === '#') {
      node.href = card.link;
    }

    let html = `
      <div class="hovercard-card">
        <div class="hovercard-title">
          <a href="${card.link}" target="_blank">
            ${card.title}
          </a>
        </div>
        <div class="hovercard-summary">
          ${card.description}
        </div>
      </div>
    `;

    this.hovercard.innerHTML = html;
    this.hovercard.style.left = `${left}px`;
    this.hovercard.style.top = `${top}px`;
    this.hovercard.classList.add('visible');

    // Immediately look at its position on screen in case we need to nudge it.
    let rect = this.hovercard.getBoundingClientRect();
    if (rect.bottom >= window.innerHeight || rect.right >= window.innerWidth) {
      let newTop = top;
      let newLeft = left;
      if (rect.bottom >= window.innerHeight) {
        // Display above the link instead of below it.
        newTop = top - targetRect.height - rect.height;
      }
      if (rect.right >= window.innerWidth) {
        // Nudge the hovercard to the left as much as it needs to go so that its
        // right edge is inside the window.
        let difference = rect.right - window.innerWidth;
        newLeft -= difference;
      }
      this.hovercard.style.top = `${newTop}px`;
      this.hovercard.style.left = `${newLeft}px`;
    }
  },

  onMouseLeave () {
    this.hovercard.classList.remove('visible');
  },
};

function setupHovercards() {
  // Ignore links on hovercard triggers that don't link to anything.
  document.body.addEventListener('click', (event) => {
    let hovercard = event.target.closest('[data-hovercard]');
    if (!hovercard) return;
    if (hovercard?.href && hovercard.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });

  let nodes = document.querySelectorAll("[data-hovercard]");

  for (let node of nodes) {
    node.addEventListener("mouseenter", hovercardEventListener);
    node.addEventListener("mouseleave", () => {
      document.getElementById("hovercard").classList.remove("visible");
    });
  }
}

async function hovercardEventListener(event) {
  let node = event.currentTarget;
  let value = node.dataset.hovercard;

  let targetRect = node.getBoundingClientRect();
  let bodyRect = document.body.getBoundingClientRect();

  let top = Math.abs(bodyRect.top) + targetRect.top + targetRect.height;
  let left = Math.abs(bodyRect.left) + targetRect.left + targetRect.width;

  const res = await fetch(`/hovercards/${value}.json`);
  const card = await res.json();

  if (card.empty) {
    return;
  }

  let hovercard = `
    <div class="hovercard-card">
      <div class="hovercard-title">
        <a href="${card.link}" target="_blank">
          ${card.title}
        </a>
      </div>
      <div class="hovercard-summary">
        ${card.description}
      </div>
    </div>
  `;

  if (node.matches('a[href]') && node.href === '#') {
    node.href = card.link;
  }

  const ele = document.getElementById("hovercard");
  ele.innerHTML = hovercard;
  ele.style.left = `${left}px`;
  ele.style.top = `${top}px`;
  ele.classList.add("visible");

  let rect = ele.getBoundingClientRect();
  if (rect.bottom >= window.innerHeight || rect.right >= window.innerWidth) {
    let newTop = top;
    let newLeft = left;
    if (rect.bottom >= window.innerHeight) {
      // Display above the link instead of below it.
      newTop = top - targetRect.height - rect.height;
    }
    if (rect.right >= window.innerWidth) {
      // Nudge the hovercard to the left as much as it needs to go so that its
      // right edge is inside the window.
      let difference = rect.right - window.innerWidth;
      newLeft -= difference;
    }
    ele.style.top = `${newTop}px`;
    ele.style.left = `${newLeft}px`;
  }
}

const ThemeSwitcher = {
  DEFAULT_THEME_PREFERENCE: "auto",
  MEDIA: window.matchMedia(`(prefers-color-scheme: light)`),
  setup () {
    this.root = document.documentElement;
    this.button = document.getElementById('theme-switcher');

    // We want to:
    //  - listen for clicks on this button to switch the theme
    //  - change this theme according to the OS prefferred theme
    //  - change this theme according to any stored preferences on this site
    //  - listen for OS preferred theme changing
    let preference = this.findSavedPreference() ?? this.DEFAULT_THEME_PREFERENCE;
    this.setPreference(preference);
    this.setupListeners();
  },

  findSavedPreference() {
    return localStorage.getItem("preferred-theme");
  },

  findOSTheme () {
    return this.MEDIA.matches ? "light" : "dark";
  },

  setupListeners () {
    this.button.addEventListener('click', this.onButtonClick.bind(this));
    this.MEDIA.addEventListener('change', () => {
      let newTheme = event.matches ? "light" : "dark";
      this.setTheme(newTheme);
    });
  },

  setTheme (newTheme) {
    if (this.root.dataset.theme === newTheme) return;
    this.root.dataset.theme = newTheme;
  },

  setPreference (newPreference) {
    localStorage.setItem("preferred-theme", newPreference);
    if (this.root.dataset.themeSetting === newPreference) return;
    this.root.dataset.themeSetting = newPreference;
    let theme = newPreference === 'auto' ? this.findOSTheme() : newPreference;
    this.setTheme(theme);
  },

  onButtonClick () {
    let currentValue = this.root.dataset.themeSetting;
    let newValue;

    switch (currentValue) {
      case 'dark':
        newValue = 'light';
        break;
      case 'light':
        newValue = 'auto';
        break;
      case 'auto':
        newValue = 'dark';
        break;
      default:
        newValue = this.DEFAULT_THEME_PREFERENCE;
    }
    this.setPreference(newValue);
  }
};

class SystemSwitcher {
  constructor() {
    this.BUTTON_TEXT_FOR_PLATFORM = {
      mac: 'mac',
      linux: 'Linux',
      win: 'Windows'
    };

    this.list = document.querySelector('.platform-switcher');
    if (!this.list) return;

    this.list.addEventListener('click', (event) => {
      let button = event.target.closest('button');
      if (!button) return;
      this.onClick(button);
    })

    this.observer = new MutationObserver(
      (mutationList) => {
      for (let mutation of mutationList) {
        if (mutation.type !== 'attributes') continue;
        if (mutation.attributeName !== 'data-platform') continue;
        this.reactToPlatformChange(document.body.dataset.platform);
      }
    });
    this.observer.observe(document.body, { attributes: true });

    this.setPlatform(this.getPreferredPlatform() ?? this.detectPlatform());
    this.reactToPlatformChange(document.body.dataset.platform);
  }

  detectPlatform () {
    // Make a rough guess as to the platform of a given user.
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    let os = null;

    if (macosPlatforms.includes(platform)) {
      os = 'mac';
    } else if (iosPlatforms.includes(platform)) {
      os = 'mac';
    } else if (windowsPlatforms.includes(platform)) {
      os = 'win';
    } else if (/Android/.test(userAgent)) {
      os = 'win';
    } else if (/Linux/.test(platform)) {
      os = 'linux';
    }

    return os;
  }

  setPlatform (platform) {
    document.body.setAttribute(`data-platform`, platform);
    localStorage.setItem("preferred-platform", platform);
  }

  getPreferredPlatform () {
    return localStorage.getItem("preferred-platform") ?? null;
  }

  onClick (button) {
    this.setPlatform(button.dataset.platform);
  }

  reactToPlatformChange (newPlatform) {
    let active = this.list.querySelector('.active');
    if (active?.dataset.platform === newPlatform) return;
    active?.classList.remove('active');

    let selector = `button[data-platform="${newPlatform}"]`;
    let newActive = this.list.querySelector(selector);
    newActive.classList.add('active');

    // Are there any tabbed containers with different content based on
    // platform? Those should be kept in sync with the platform selector. This
    // also ensures that the correct tab is focused for the user's platform
    // when the page is first shown.
    let tabWrappers = document.querySelectorAll('.tabs-tabs-wrapper');
    let targetButtonText = this.BUTTON_TEXT_FOR_PLATFORM[newPlatform];
    for (let wrapper of tabWrappers) {
      let buttons = Array.from(wrapper.querySelectorAll('button'));
      // innerText can reflect CSS text-transform, amazingly. Normalize text
      // before comparison.
      let button = buttons.find(
        b => b.innerText.toLowerCase().includes(targetButtonText.toLowerCase())
      );
      button?.click();
    }
  }
}

// Must be declared before the heading observer.
let autoToc = new AutoTOC();

{
  let topMargin = document.querySelector('.page_header')?.offsetHeight ?? 0;
  window.headingObserver = new HeadingObserver({ topMargin });
}

// Tab boxes need to be set up before the system switcher so that the latter
// can control them.
Tabs.setup();
ThemeSwitcher.setup();
Hovercards.setup();

new SystemSwitcher();
