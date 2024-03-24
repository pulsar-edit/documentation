const DEFAULT_THEME = "dark";
setupThemeSwitcher();
setupTabs();
setupHovercards();

let threshold = [];
for (let i = 0; i <= 20; i++) {
  threshold.push(i * 0.05);
}

function debounce (fn, delay) {
  let timeout = null;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

// Highlight the sidebar navigation item that corresponds to the section that
// the user is reading.
class HeadingObserver {
  constructor() {
    let sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    this.sidebar = sidebar;
    this.activeId = null;

    let listener = (entries, observer) => {
      if (this.clickedOnAnchor) return;
      let matched = false;
      for (let entry of entries) {
        matched ||= this.didIntersect(entry, observer);
      }

      if (matched) return;

      if (this.narrowObserver === observer) {
        let closest = this.getClosestHeadingToTopOfViewport();
        this.setActive(closest?.id ?? null);
      }
    };

    let debouncedRecheck = debounce(() => {
      // Sanity check to make sure that the element is still within the
      // viewport. If it is, then we won't second-guess the
      // `IntersectionObserver`s.
      if (this.activeId && this.withinViewport(this.activeId)) return

      // Otherwise, we should invoke both observers manually — preferring the
      // narrow observer, then falling back to the wide observer.
      let narrowRecords = this.narrowObserver.takeRecords();
      let wideRecords = this.wideObserver.takeRecords();

      // Only take action on either observer if there are new records. If there
      // aren't, that means that no headings changed intersection state since
      // the last time we checked.
      if (narrowRecords > 0) {
        listener(narrowRecords, this.narrowObserver);
      } else if (wideRecords > 0) {
        listener(narrowRecords, this.wideObserver);
      }

      if (!this.activeId) {
        let closest = this.getClosestHeadingToTopOfViewport();
        this.setActive(closest?.id ?? null);
      }

    }, 200);

    // When the window scrolls very quickly — like when the user presses
    // Home/End, or otherwise jumps to the top or bottom — sometimes it's so
    // fast that the IntersectionObservers don't even react. We can fix this by
    // invoking them manually after the scroll has finished.
    window.addEventListener('scroll', debouncedRecheck);

    this.narrowObserver = new IntersectionObserver(
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
        rootMargin: '0px 0px -90% 0px',
        threshold
      }
    );

    // When nothing has yet gone past the narrow viewport, we fall back to a
    // different `IntersectionObserver` that looks at the entire viewport. In
    // that scenario, we should mark the first header in the document as active
    // as long as it's within the viewport.
    this.wideObserver = new IntersectionObserver(listener);

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
    this.wideObserver.disconnect();
    this.narrowObserver.disconnect();
    let links = this.sidebar.querySelectorAll('a');
    for (let link of links) {
      let href = link.getAttribute('href');
      if (!href?.startsWith('#')) continue;

      let id = href.substring(1);
      let heading = document.getElementById(id);
      if (!heading) continue;

      this.ids.push(id);
      this.headings.push(heading);

      this.wideObserver.observe(heading);
      this.narrowObserver.observe(heading);
    }
  }

  setActive(id) {
    this.activeId = id;
    let href = `#${id}`;

    let previousActive = this.sidebar.querySelector('li.active a');
    previousActive?.closest('li')?.classList.remove('active');

    let linkForId = this.sidebar.querySelector(`a[href="${href}"]`);
    if (!linkForId) return;

    linkForId.closest('li')?.classList.add('active');
  }

  getClosestHeadingToTopOfViewport() {
    let windowHeight = window.innerHeight;
    let previousHeading;
    for (let heading of this.headings) {
      let rect = heading.getBoundingClientRect();
      if (rect.bottom >= 0) {
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
    if (observer === this.narrowObserver) {
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

    requestAnimationFrame(() => {
      this.setActive(id);
    })

    setTimeout(() => {
      this.clickedOnAnchor = false;
    }, 200)
  }

  withinViewport(elementOrId) {
    let element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    let rect = element.getBoundingClientRect();
    if (rect.top < 0) return false;
    if (rect.bottom > window.innerHeight) return false;
    return true;
  }
}

new HeadingObserver();


function setupTabs() {
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

      button.addEventListener("click", tabBtnEventListener);
    }

    if (!isAnyBtnActive) {
      // This section has no active buttons. But since we want the first button
      // to be active on page load, we will manually trigger one to be active

      // HINT: TODO: We could also allow a page to store a users preference,
      // and preload the button activation for there prefferred format here
      let defaultBtn = buttons[0];
      defaultBtn.click();
    }
  }
}

function tabBtnEventListener(event) {
  let button = event.target;
  let section = button.parentElement.parentElement.querySelector(`[data-index="${button.dataset.tab}"]`);

  let allButtons = button.parentElement.getElementsByClassName("tabs-tab-button");
  let allSections = button.parentElement.parentElement.getElementsByClassName("tabs-tab-content");

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

function setupThemeSwitcher() {
  let root = document.documentElement;
  const themeBtn = document.getElementById("theme-switcher");

  // We want to:
  //  - listen for clicks on this button to switch the theme
  //  - change this theme according to the OS prefferred theme
  //  - change this theme according to any stored preferences on this site
  //  - listen for OS prefferred theme changing

  let userPref = findSavedUserPrefTheme() ?? findOSThemePref() ?? DEFAULT_THEME;
  if (root.dataset.theme !== userPref) {
    root.dataset.theme = userPref;
  }

  themeBtn.addEventListener("click", () => {
    let curValue = root.dataset.theme;

    if (curValue === "dark") {
      root.dataset.theme = "light";
      localStorage.setItem("preferred-theme", "light");
    } else if (curValue === "light") {
      root.dataset.theme = "dark";
      localStorage.setItem("preferred-theme", "dark");
    } else {
      // This was an unsupported value; reset to a known good value.
      root.dataset.theme = DEFAULT_THEME;
    }
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    let newScheme = event.matches ? "dark" : "light";
    document.documentElement.dataset.theme = newScheme;
  });
}

function findOSThemePref() {
  if (!window.matchMedia) return null;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    // os prefers light
    return "light";
  } else {
    // os prefers dark
    return "dark";
  }
}

function findSavedUserPrefTheme() {
  return localStorage.getItem("preferred-theme");
}
