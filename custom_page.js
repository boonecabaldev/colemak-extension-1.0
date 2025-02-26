// custom_page.js

document.addEventListener("DOMContentLoaded", () => {
    let previouslyFocusedElement = document.activeElement;
    const textArea = document.getElementById("colemakTextArea");

    if (textArea) {
        // Load saved text and cursor position when the popup opens
        chrome.storage.local.get(["savedText", "cursorPos"], (data) => {
            if (data.savedText !== undefined) {
                textArea.value = data.savedText;
            }
            if (data.cursorPos !== undefined) {
                setTimeout(() => textArea.setSelectionRange(data.cursorPos, data.cursorPos), 10);
            }
        });

        textArea.focus();
    }

    textArea.addEventListener("keydown", (event) => {
        dvorakToColemakConversion(event);
    });

    // Clear text when F8 is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key === "F8") {
            textArea.value = "";  // Clear textarea
            chrome.storage.local.set({ savedText: "", cursorPos: 0 }); // Clear saved state
            console.log("Textarea cleared.");
        }
    });

    // Save text and cursor position on input
    textArea.addEventListener("input", () => {
        chrome.storage.local.set({ savedText: textArea.value });
    });

    textArea.addEventListener("keyup", () => {
        chrome.storage.local.set({ cursorPos: textArea.selectionStart });
    });

    // Save on focus loss (ensures persistence)
    window.addEventListener("blur", () => {
        chrome.storage.local.set({
            savedText: textArea.value,
            cursorPos: textArea.selectionStart
        });
    });

    document.getElementById("saveButton").addEventListener("click", () => {
        const textContent = textArea.value;
        const blob = new Blob([textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "colemak_text.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        textArea.focus();
    });

    document.getElementById("copyButton").addEventListener("click", () => {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        textArea.select();
        document.execCommand("copy");
        textArea.setSelectionRange(start, end);
        textArea.focus();
        displayMessage("Content copied to clipboard");
    });

    // Listen for "Copy and Clear" button click to function identically to Shift+Enter
    const copyAndClearButton = document.getElementById("copyAndClearButton");
    copyAndClearButton.addEventListener("click", handleSaveAndClose);

    document.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.key === "Enter") {
            handleSaveAndClose();
        }
    });

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
                    chrome.storage.local.set({ savedText: "", cursorPos: 0 }); // Clear saved state
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
        chrome.storage.local.set({
            savedText: textArea.value,
            cursorPos: textArea.selectionStart
        });
        chrome.runtime.sendMessage({ type: "popupClosed" });
    };

    function displayMessage(message) {
        const messageDiv = document.getElementById("message");
        messageDiv.innerText = message;
        messageDiv.style.display = "block";
        setTimeout(() => { messageDiv.style.display = "none"; }, 2000);
    }

    const dvorakToColemak = {
        "'": "q", ",": "w", ".": "f", "p": "p", "y": "g", "f": "j", "g": "l", "c": "u", "r": "y", "l": ";",
        "a": "a", "o": "r", "e": "s", "u": "t", "i": "d", "d": "h", "h": "n", "t": "e", "n": "i", ";": "z",
        "q": "x", "j": "c", "k": "v", "x": "b", "b": "k", "m": "m", "\"": "Q", "<": "W", ">": "F",
        "P": "P", "Y": "G", "F": "J", "G": "L", "C": "U", "R": "Y", "L": ":", "A": "A", "O": "R", "E": "S",
        "U": "T", "I": "D", "D": "H", "H": "N", "T": "E", "N": "I", ":": "Z", "Q": "X", "J": "C", "K": "V",
        "X": "B", "B": "K", "M": "M", "s": "o", "S": "O", "-": "'", "_": "\"", "/": "[", "?": "{", "=": "]",
        "+": "}", "[": "-", "{": "_", "]": "=", "}": "+", "w": ",", "W": "<", "v": ".", "V": ">", "z": "/", "Z": "?"
    };

    function dvorakToColemakConversion(event) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const colemakKey = dvorakToColemak[event.key];
        if (colemakKey) {
            textArea.setRangeText(colemakKey, start, end, "end");
            event.preventDefault();
        }
    }
});