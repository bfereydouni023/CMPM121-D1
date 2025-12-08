import "./style.css";

//creating bubble button with bubble emoji
const bubbleButton = document.createElement("button");
bubbleButton.type = "button";
bubbleButton.className = "bubble-button";
bubbleButton.textContent = "🫧";
bubbleButton.ariaLabel = "Pop the bubble";

//when bubble is clicked, make the button 'click' down
bubbleButton.addEventListener("click", () => {
  bubbleButton.classList.add("bubble-pop");
  globalThis.setTimeout(() => {
    bubbleButton.classList.remove("bubble-pop");
  }, 120);
});

//renders the button to the screen
document.body.append(bubbleButton);
