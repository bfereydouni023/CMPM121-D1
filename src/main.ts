import "./style.css";

//creating main element that will contain the clicker button
const app = document.createElement("main");
app.className = "app";

//creating header element with the game title
const title = document.createElement("h1");
title.textContent = "Bubble Clicker";

//creates subtitle element
const subtitle = document.createElement("p");
subtitle.className = "subtitle";
subtitle.textContent = "Tap the bubble to start popping!";

//set up counter variable and bubble popped counter text
let pops = 0;
const counter = document.createElement("div");
counter.className = "counter";
counter.textContent = `Bubbles popped: ${pops}`;

//creates the clickable bubble button
const bubbleButton = document.createElement("button");
bubbleButton.type = "button";
bubbleButton.className = "bubble-button";
bubbleButton.textContent = "🫧";
bubbleButton.ariaLabel = "Pop the bubble";

//incremenet counter when bubble button is clicked
bubbleButton.addEventListener("click", () => {
  pops += 1;
  counter.textContent = `Bubbles popped: ${pops}`;
});

//append the button, title and subtitle texts to the main element created prior
app.append(title, subtitle, counter, bubbleButton);

//add the widget containing the button and titles to the page
document.body.innerHTML = "";
document.body.append(app);
