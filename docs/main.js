const DEFAULT_THEME = "dark";
setupThemeSwitcher();
setupTabs();
setupHovercards();

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
