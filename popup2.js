

// popup.js

let previouslyFocusedElement = null;
let clipboardData = "";

// Track the focused element when the popup opens
document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ type: "popupOpened" });

  // Focus the textarea when the popup opens
  const textArea = document.getElementById("colemakTextArea");
  if (textArea) {
    textArea.focus();
  }

  // Add the event listener for keydown (for Dvorak to Colemak conversion)
  textArea.addEventListener("keydown", (event) => {
    dvorakToColemakConversion(event);
  });

  // Listen for Shift+Enter or the "Save and Close" button click
  const saveAndCloseButton = document.getElementById("saveAndCloseButton");
  saveAndCloseButton.addEventListener("click", handleSaveAndClose);

  // Detect Shift+Enter for "Save and Close"
  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.key === "Enter") {
      handleSaveAndClose();
    }
  });

  // Listen for "Copy and Clear" button click to function identically to Shift+Enter
  const copyAndClearButton = document.getElementById("copyAndClearButton");
  copyAndClearButton.addEventListener("click", handleSaveAndClose);

  // Function to handle both Save and Close, and Copy and Clear
  function handleSaveAndClose() {
    const textArea = document.getElementById("colemakTextArea");
    const text = textArea.value;

    // Focus the popup window before performing the clipboard operation
    window.focus(); // Make sure the popup is focused

    // Ensure the clipboard operation is inside a user-initiated event
    try {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log("Text copied to clipboard!");
          textArea.value = "";  // Clear the text area
          // Close the popup
          window.close();
        })
        .catch(err => {
          console.error("Error copying text to clipboard: ", err);
        });
    } catch (err) {
      console.error("Clipboard error: ", err);
    }
  }

  // Handle focus and pasting clipboard data when the popup closes
  window.onbeforeunload = () => {
    chrome.runtime.sendMessage({ type: "popupClosed" });
  };
});

// Dvorak to Colemak Conversion
      const dvorakToColemak = {
        "'": "q",
        ",": "w",
        ".": "f",
        p: "p",
        y: "g",
        f: "j",
        g: "l",
        c: "u",
        r: "y",
        l: ";",
        a: "a",
        o: "r",
        e: "s",
        u: "t",
        i: "d",
        d: "h",
        h: "n",
        t: "e",
        n: "i",
        ";": "z",
        q: "x",
        j: "c",
        k: "v",
        x: "b",
        b: "k",
        m: "m",
        //v: ".",
        //z: "/",
        '"': "Q",
        "<": "W",
        ">": "F",
        P: "P",
        Y: "G",
        F: "J",
        G: "L",
        C: "U",
        R: "Y",
        L: ":",
        A: "A",
        O: "R",
        E: "S",
        U: "T",
        I: "D",
        D: "H",
        H: "N",
        T: "E",
        N: "I",
        ":": "Z",
        Q: "X",
        J: "C",
        K: "V",
        X: "B",
        B: "K",
        M: "M",
        //V: ">",
        //Z: "?",
        s: "o",
        S: "O",
        "-": "'",
        _: '"',
        "/": "[",
        "?": "{",
        "=": "]",
        "+": "}",
        "[": "-",
        "{": "_",
        "]": "=",
        "}": "+",
        w: ",",
        W: "<",
        v: ".",
        V: ">",
        z: "/",
        Z: "?"
      };

// Perform the Dvorak to Colemak conversion on keydown
function dvorakToColemakConversion(event) {
  const textArea = document.getElementById("colemakTextArea");
  const start = textArea.selectionStart;
  const end = textArea.selectionEnd;
  
  // Convert the key press from Dvorak to Colemak
  const colemakKey = dvorakToColemak[event.key];
  if (colemakKey) {
    textArea.setRangeText(colemakKey, start, end, "end");
    event.preventDefault();  // Prevent the default action of the keypress
  }
}