// background.js

let previouslyFocusedElement = null;
let clipboardData = "";

// Listen for when the popup is opened
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popupOpened") {
    // Track the focused element's ID (if any)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          const focusedElement = document.activeElement;
          if (focusedElement && focusedElement.id) {
            focusedElement.id;
          } else {
            null;
          }
        `
      }, (result) => {
        previouslyFocusedElement = result[0] || null;
      });
    });

    // Store clipboard content
    navigator.clipboard.readText().then((text) => {
      clipboardData = text;
    }).catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
  }

  // Listen for when the popup is closed
  if (message.type === "popupClosed" && previouslyFocusedElement) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          const focusedElement = document.getElementById("${previouslyFocusedElement}");
          if (focusedElement) {
            focusedElement.value = "${clipboardData}";
          }
        `
      });
    });
  }
});
