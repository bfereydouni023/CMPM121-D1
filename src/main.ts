import "./style.css";

// ===========================
// === GAME STATE ===
// ===========================
let gameCurrency = 0;
let passiveIncomeRate = 0;

//Shape for each upgrade option so costs, rates, and UI stay grouped together
type Upgrade = {
  id: string;
  description: string;
  cost: number;
  rate: number;
  count: number;
  button: HTMLButtonElement;
  statusLine: HTMLLIElement;
};

// ===========================
// === DOM ELEMENTS ===
// ===========================

// Main container
const app = document.createElement("main");
app.className = "app";

// Header and subtitle
const title = document.createElement("h1");
title.textContent = "Bubble Clicker";

const subtitle = document.createElement("p");
subtitle.className = "subtitle";
subtitle.textContent = "Tap the bubble to start popping!";

// Counter and rate display
const counter = document.createElement("div");
counter.className = "counter";

const rateDisplay = document.createElement("p");
rateDisplay.className = "rate-display";

// Main action button
const mainActionButton = document.createElement("button");
mainActionButton.type = "button";
mainActionButton.className = "bubble-button";
mainActionButton.textContent = "🫧";
mainActionButton.ariaLabel = "Pop the bubble";

// Upgrade related elements
const upgradesTitle = document.createElement("h2");
upgradesTitle.className = "upgrade-heading";
upgradesTitle.textContent = "Upgrades";

const upgradeList = document.createElement("div");
upgradeList.className = "upgrade-list";

const statusList = document.createElement("ul");
statusList.className = "upgrade-status";

const statusSection = document.createElement("div");
statusSection.className = "status-section";

const statusHeading = document.createElement("p");
statusHeading.className = "status-heading";
statusHeading.textContent = "Owned upgrades:";

// ===========================
// === UPDATE FUNCTIONS ===
// ===========================

const updateCounter = () => {
  counter.textContent = `Bubbles popped: ${gameCurrency.toFixed(1)}`;
};

const updateRateDisplay = () => {
  rateDisplay.textContent = `Growth rate: ${
    passiveIncomeRate.toFixed(1)
  } bubbles/sec`;
};

const updateUpgradeButtons = () => {
  upgrades.forEach((upgrade) => {
    upgrade.button.disabled = gameCurrency < upgrade.cost;
    const formattedCost = upgrade.cost.toFixed(1);
    upgrade.button.textContent =
      `${upgrade.id} — ${upgrade.description} | Cost: ${formattedCost} bubbles (+${upgrade.rate} bubbles/sec) | Owned: ${upgrade.count}`;
  });
};

//helper function to dry updating counter and upgrade button
const refreshCurrencyUI = () => {
  updateCounter();
  updateUpgradeButtons();
};

const updateStatusList = () => {
  upgrades.forEach((upgrade) => {
    upgrade.statusLine.textContent =
      `${upgrade.id} (${upgrade.description}): ${upgrade.count}`;
  });
};

// ===========================
// === UPGRADE SYSTEM ===
// ===========================

// Config for the available upgrades with their costs and rates
const upgradeConfigs = [
  {
    id: "Hire a friend!",
    description: "Bubble popping is so fun, why do it alone?",
    cost: 10,
    rate: 0.1,
  },
  {
    id: "Auto Bubble Popper (TM)",
    description: "Bikini Bottom Motor Company's newest product!",
    cost: 100,
    rate: 2.0,
  },
  {
    id: "Bubblenaut Crew",
    description:
      "Elite pirates that chart the seven seas, annihilating bubbles they find.",
    cost: 1000,
    rate: 50,
  },
  {
    id: "Bubble Bot 3000",
    description:
      "A turbo-charged robot that shreds through bubbles around the clock. Proudly produced by K & P Company",
    cost: 5000,
    rate: 125,
  },
  {
    id: "UNLEASH THE SPONGE!",
    description: "Hire SpongeBob, the bubble popper GOAT",
    cost: 20000,
    rate: 600,
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
const recalculatepassiveIncomeRate = () => {
  passiveIncomeRate = upgrades.reduce(
    (total, upgrade) => total + upgrade.count * upgrade.rate,
    0,
  );
  updateRateDisplay();
};

// ===========================
// === EVENT LISTENERS ===
// ===========================

// Main bubble button click handler
mainActionButton.addEventListener("click", () => {
  gameCurrency += 1;
  refreshCurrencyUI();
});

// Upgrade button click handlers
upgrades.forEach((upgrade) => {
  upgrade.button.addEventListener("click", () => {
    if (gameCurrency < upgrade.cost) return;

    gameCurrency -= upgrade.cost;
    upgrade.count += 1;
    upgrade.cost *= 1.15;
    recalculatepassiveIncomeRate();
    updateStatusList();
    refreshCurrencyUI();
  });

  statusList.append(upgrade.statusLine);
});

// Continuous passive income growth
let lastTimestamp: number | null = null;

const growContinuously = (timestamp: number) => {
  if (lastTimestamp !== null) {
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    gameCurrency += deltaSeconds * passiveIncomeRate;
    refreshCurrencyUI();
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(growContinuously);
};

// ===========================
// === INITIALIZATION ===
// ===========================

// Set initial display values

updateRateDisplay();
updateStatusList();
refreshCurrencyUI();

// Populate upgrade list and status section
upgrades.forEach((upgrade) => {
  upgradeList.append(upgrade.button);
});
statusSection.append(statusHeading, statusList);

// Append all elements to main container
app.append(
  title,
  subtitle,
  counter,
  rateDisplay,
  mainActionButton,
  upgradesTitle,
  upgradeList,
  statusSection,
);

// Add main container to page
document.body.innerHTML = "";
document.body.append(app);

// Start the game loop
requestAnimationFrame(growContinuously);
