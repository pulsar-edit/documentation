
window.addEventListener("load", () => {
  setupTabs();
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
