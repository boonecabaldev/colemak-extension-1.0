document.addEventListener("DOMContentLoaded", () => {
    let previouslyFocusedElement = document.activeElement;
    const textArea = document.getElementById("colemakTextArea");
    const messageDiv = document.getElementById("message"); // Status message element

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

    // Listen for F8 to clear all text and show status message
    document.addEventListener("keydown", (event) => {
        if (event.key === "F8") {
            textArea.value = ""; // Clear the textarea
            chrome.storage.local.set({ savedText: "", cursorPos: 0 }); // Reset saved state
            displayMessage("Textarea cleared!"); // Show status message
        }
    });

    // Save on focus loss (ensures persistence)
    window.addEventListener("blur", () => {
        chrome.storage.local.set({
            savedText: textArea.value,
            cursorPos: textArea.selectionStart
        });
    });

    // Function to show a temporary status message
    function displayMessage(message) {
        messageDiv.innerText = message;
        messageDiv.style.display = "block";
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 2000); // Hide message after 2 seconds
    }
});
