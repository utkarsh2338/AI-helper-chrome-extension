let aiButton;
let lastSelection = "";

function showButton(x, y) {
    if (!aiButton) {
        aiButton = document.createElement("button");
        aiButton.innerText = "Ask Shukla";
        aiButton.style.position = "absolute";
        aiButton.style.zIndex = 9999;
        aiButton.style.padding = "6px 10px";
        aiButton.style.background = "#111";
        aiButton.style.color = "#fff";
        aiButton.style.borderRadius = "6px";
        aiButton.style.border = "none";
        aiButton.style.cursor = "pointer";
        document.body.appendChild(aiButton);

        // Add click event listener only once when button is created
        aiButton.addEventListener("click", async () => {
            if (lastSelection.length > 5) {
                try {
                    // Gather context
                    const activeInput = document.activeElement;
                    const context = {
                        question: lastSelection,
                        pageTitle: document.title,
                        domain: window.location.hostname,
                        label: null,
                        placeholder: null
                    };

                    // If selection is near a form field, get its context
                    if (activeInput && (activeInput.tagName === "TEXTAREA" || activeInput.tagName === "INPUT")) {
                        // Try to find label
                        if (activeInput.id) {
                            const label = document.querySelector(`label[for="${activeInput.id}"]`);
                            context.label = label?.innerText || null;
                        }
                        // Get placeholder if available
                        context.placeholder = activeInput.placeholder || null;
                    }

                    const response = await fetch("http://localhost:3000/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ context })
                    });

                    const data = await response.json();

                    if (activeInput && (activeInput.tagName === "TEXTAREA" || activeInput.tagName === "INPUT")) {
                        activeInput.value = data.answer;
                    } else {
                        alert(data.answer);
                    }
                } catch (error) {
                    console.error("Error calling AI API:", error);
                    alert("Failed to get AI response. Please try again.");
                }
            }
            aiButton.style.display = "none";
        });
    }

    aiButton.style.top = y + "px";
    aiButton.style.left = x + "px";
    aiButton.style.display = "block";
}

document.addEventListener("mouseup", (e) => {
    const text = window.getSelection().toString().trim();
    lastSelection = text;

    if (text.length > 5) {
        showButton(e.pageX, e.pageY);
    } else if (aiButton) {
        aiButton.style.display = "none";
    }
});
