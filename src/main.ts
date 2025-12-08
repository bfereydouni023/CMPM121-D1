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
const counter = document.createElement("div");
counter.className = "counter";
const updateCounter = () => {
  counter.textContent = `Bubbles popped: ${pops.toFixed(1)}`; //makes the number of bubbles only show up to the tenth position
};
updateCounter();

// track and display the current growth rate
const rateDisplay = document.createElement("p");
rateDisplay.className = "rate-display";
const updateRateDisplay = () => {
  rateDisplay.textContent = `Growth rate: ${growthRate.toFixed(1)} bubbles/sec`;
};
updateRateDisplay();

//creates the clickable bubble button
const bubbleButton = document.createElement("button");
bubbleButton.type = "button";
bubbleButton.className = "bubble-button";
bubbleButton.textContent = "🫧";
bubbleButton.ariaLabel = "Pop the bubble";

//Shape for each upgrade option so costs, rates, and UI stay grouped together
type Upgrade = {
  id: string;
  name: string;
  cost: number;
  rate: number;
  count: number;
  button: HTMLButtonElement;
  statusLine: HTMLLIElement;
};

// Config for the three available upgrades (A, B, C) with their costs and rates
const upgradeConfigs = [
  {
    id: "Hire a friend!",
    name: "Bubble popping is so fun, why do it alone?",
    cost: 10,
    rate: 0.1,
  },
  {
    id: "Auto Bubble Popper (TM)",
    name: "Bikini Bottom Motor Company's newest product!",
    cost: 100,
    rate: 2.0,
  },
  {
    id: "UNLEASH THE SPONGE!",
    name: "Hire SpongeBob, the bubble popper GOAT",
    cost: 1000,
    rate: 50,
  },
];

// Build upgrade objects with buttons and status lines for display/purchasing
const upgrades: Upgrade[] = upgradeConfigs.map((config) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "upgrade-button";

  const statusLine = document.createElement("li");
  statusLine.className = "upgrade-count";

  return {
    ...config,
    count: 0,
    button,
    statusLine,
  };
});

// Sum the contribution from all owned upgrades to update the passive growth rate
const recalculateGrowthRate = () => {
  growthRate = upgrades.reduce(
    (total, upgrade) => total + upgrade.count * upgrade.rate,
    0,
  );
  updateRateDisplay();
};

// Refresh upgrade button labels and disabled state based on current bubbles owned
const updateUpgradeButtons = () => {
  upgrades.forEach((upgrade) => {
    upgrade.button.disabled = pops < upgrade.cost;
    const formattedCost = upgrade.cost.toFixed(1);
    upgrade.button.textContent =
      `${upgrade.id} — ${upgrade.name} | Cost: ${formattedCost} bubbles (+${upgrade.rate} bubbles/sec) | Owned: ${upgrade.count}`;
    //`${upgrade.id} — ${upgrade.name} | Cost: ${upgrade.cost} bubbles (+${upgrade.rate} bubbles/sec) | Owned: ${upgrade.count}`;
  });
};

// List that summarizes how many of each upgrade the player owns
const statusList = document.createElement("ul");
statusList.className = "upgrade-status";

// Update function to keep the owned-count status list in sync with purchases
const updateStatusList = () => {
  upgrades.forEach((upgrade) => {
    upgrade.statusLine.textContent =
      `${upgrade.id} (${upgrade.name}): ${upgrade.count}`;
  });
};

//logic for what should happen when an upgrade is clicked
upgrades.forEach((upgrade) => {
  upgrade.button.addEventListener("click", () => {
    if (pops < upgrade.cost) return;

    pops -= upgrade.cost;
    upgrade.count += 1;
    upgrade.cost *= 1.15;
    recalculateGrowthRate();
    updateCounter();
    updateStatusList();
    updateUpgradeButtons();
  });

  statusList.append(upgrade.statusLine);
});

//incremenet counter when bubble button is clicked, update upgrade button to track when enough bubbles are collected to unlock button
bubbleButton.addEventListener("click", () => {
  pops += 1;
  updateCounter();
  updateUpgradeButtons();
});

//increment counter automatically based on elapsed time per animation frame
let lastTimestamp: number | null = null;

const growContinuously = (timestamp: number) => {
  if (lastTimestamp !== null) {
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    pops += deltaSeconds * growthRate;
    updateCounter();
    updateUpgradeButtons();
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(growContinuously);
};

requestAnimationFrame(growContinuously);

const upgradesTitle = document.createElement("h2");
upgradesTitle.className = "upgrade-heading";
upgradesTitle.textContent = "Upgrades";

const upgradeList = document.createElement("div");
upgradeList.className = "upgrade-list";
upgrades.forEach((upgrade) => {
  upgradeList.append(upgrade.button);
});

const statusSection = document.createElement("div");
statusSection.className = "status-section";

const statusHeading = document.createElement("p");
statusHeading.className = "status-heading";
statusHeading.textContent = "Owned upgrades:";

statusSection.append(statusHeading, statusList);
updateStatusList();
updateUpgradeButtons();

//append the button, title and subtitle texts to the main element created prior
app.append(
  title,
  subtitle,
  counter,
  rateDisplay,
  bubbleButton,
  upgradesTitle,
  upgradeList,
  statusSection,
);

//add the widget containing the button and titles to the page
document.body.innerHTML = "";
document.body.append(app);
