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

    // Add keyboard shortcuts for F8 (Copy), F4 (Clear), and F9 (Paste)
    document.addEventListener("keydown", async (event) => {
        if (event.key === "F4") {
            textArea.value = ""; // Clear textarea
            chrome.storage.local.set({ savedText: "", cursorPos: 0 }); // Clear saved state
            displayMessage("Cleared all text!"); // Show status message
        }
        if (event.key === "F8") {
            copyText();
        }
        if (event.key === "F9") {
            event.preventDefault(); // Prevent default browser action
            pasteText();
        }
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

    document.getElementById("copyButton").addEventListener("click", copyText);

    // Listen for "Copy and Clear" button click to function identically to Shift+Enter
    const copyAndClearButton = document.getElementById("copyAndClearButton");
    copyAndClearButton.addEventListener("click", handleSaveAndClose);

    document.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.key === "Enter") {
            handleSaveAndClose();
        }
    });

    function copyText() {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const selectedText = textArea.value.substring(start, end);
        
        let textToCopy;
        let message;

        if (selectedText.length > 0) {
            textToCopy = selectedText;
            message = "Selection copied to clipboard!";
        } else {
            textToCopy = textArea.value;
            message = "Copied all text to clipboard!";
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            displayMessage(message);
        }).catch(err => {
            console.error("Clipboard error:", err);
        });

        setTimeout(() => {
            if (selectedText.length > 0) {
                textArea.setSelectionRange(start, end); // Keep selection
            } else {
                textArea.setSelectionRange(start, start); // Restore cursor
            }
            textArea.focus();
        }, 10);
    }

async function pasteText() {
    const textArea = document.getElementById("colemakTextArea");
    
    try {
        // Try using the Clipboard API (Requires user-initiated event & clipboardRead permission)
        const clipboardText = await navigator.clipboard.readText();
        insertTextAtCursor(textArea, clipboardText);
    } catch (err) {
        console.warn("Clipboard API failed, trying execCommand fallback...");

        // Fallback method using execCommand (deprecated but works in some cases)
        textArea.focus();
        document.execCommand("paste");
    }
}
    function handleSaveAndClose() {
        const text = textArea.value;
        window.focus(); // Make sure the popup is focused

        try {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log("Text copied to clipboard!");
                    textArea.value = "";  // Clear the text area
                    chrome.storage.local.set({ savedText: "", cursorPos: 0 }); // Clear saved state
                    window.close();
                })
                .catch(err => {
                    console.error("Error copying text to clipboard: ", err);
                });
        } catch (err) {
            console.error("Clipboard error: ", err);
        }
    }

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