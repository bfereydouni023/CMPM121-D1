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

//set up counter variable, growth rate and bubble popped counter text
let pops = 0;
let growthRate = 0;
let upgradeLevel = 0;
const counter = document.createElement("div");
counter.className = "counter";
const updateCounter = () => {
  counter.textContent = `Bubbles popped: ${pops.toFixed(1)}`; //makes the number of bubbles only show up to the tenth position
};
updateCounter();

//creates the clickable bubble button
const bubbleButton = document.createElement("button");
bubbleButton.type = "button";
bubbleButton.className = "bubble-button";
bubbleButton.textContent = "🫧";
bubbleButton.ariaLabel = "Pop the bubble";

//upgrade button that increases automatic growth rate
const upgradeButton = document.createElement("button");
upgradeButton.type = "button";
upgradeButton.className = "upgrade-button";
upgradeButton.textContent = "Buy an auto bubble popper (+1/s)";
upgradeButton.disabled = true;

const upgradeStatus = document.createElement("p");
upgradeStatus.className = "upgrade-status";

const updateUpgradeButton = () => {
  upgradeButton.disabled = pops < 10;
  upgradeButton.textContent =
    `Buy an auto bubble popper (+1/s) — Level ${upgradeLevel}`;
};

updateUpgradeButton();

//incremenet counter when bubble button is clicked, update upgrade button to track when enough bubbles are collected to unlock button
bubbleButton.addEventListener("click", () => {
  pops += 1;
  updateCounter();
  updateUpgradeButton();
});

//increment counter automatically based on elapsed time per animation frame
let lastTimestamp: number | null = null;

const growContinuously = (timestamp: number) => {
  if (lastTimestamp !== null) {
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    pops += deltaSeconds * growthRate;
    updateCounter();
    updateUpgradeButton();
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(growContinuously);
};

requestAnimationFrame(growContinuously);

//add upgrade button, make it so it costs 10 bubble pops

upgradeButton.addEventListener("click", () => {
  if (pops < 10) return;

  pops -= 10;
  growthRate += 1;
  upgradeLevel += 1;
  updateCounter();
  updateUpgradeButton();
});

//append the button, title and subtitle texts to the main element created prior
app.append(
  title,
  subtitle,
  counter,
  bubbleButton,
  upgradeButton,
  upgradeStatus,
);

//add the widget containing the button and titles to the page
document.body.innerHTML = "";
document.body.append(app);
