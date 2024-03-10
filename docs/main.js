
window.addEventListener("load", () => {
  setupTabs();
  setupHovercards();
});

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
  let nodes = document.querySelectorAll("[data-hovercard]");

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].addEventListener("mouseover", hovercardEventListener);
    nodes[i].addEventListener("mouseleave", (event) => {
      document.getElementById("hovercard").classList.remove("visible");
    });
    nodes[i].addEventListener("mouseout", (event) => {
      document.getElementById("hovercard").classList.remove("visible");
    });
  }
}

async function hovercardEventListener(event) {
  let node = event.target;
  let value = node.dataset.hovercard;

  const res = await fetch(`/hovercards/${value}.json`);
  const card = await res.json();

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

  const ele = document.getElementById("hovercard");
  ele.innerHTML = hovercard;
  ele.style.left = `${event.clientX}px`;
  ele.style.top = `${event.pageY}px`;
  ele.classList.add("visible");
}
