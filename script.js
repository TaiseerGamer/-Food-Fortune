// ════════════════════════════════════════════════════════
//  Food Fortune — v0.1.1
//  New: Eid al-Adha Limited Event
//    - Exclusive Eid foods (Eid rarity)
//    - Eid event boxes (costs Mooncoins 🌙)
//    - Eid daily blessing (7-day streak calendar)
//    - Eid achievement badges
//  Carried from v0.1.0:
//    - Auto-clicker upgrades
//    - Daily login bonus / streak
//    - Achievements & milestones
//    - Sell duplicate foods
// ════════════════════════════════════════════════════════

// ── FOOD DATA ──────────────────────────────────────────
const FOODS = [
  // COMMON
  { name: "White Rice",      icon: "🍚", rarity: "common",    desc: "A humble staple. Not exciting, but reliable.",         sellValue: 1,    isEid: false },
  { name: "Plain Bread",     icon: "🍞", rarity: "common",    desc: "Just bread. Basic. You can do this.",                   sellValue: 1,    isEid: false },
  { name: "Boiled Egg",      icon: "🥚", rarity: "common",    desc: "Protein, that's about it.",                            sellValue: 1,    isEid: false },
  { name: "Carrot Sticks",   icon: "🥕", rarity: "common",    desc: "Crunchy and orange. Very common.",                     sellValue: 1,    isEid: false },
  { name: "Crackers",        icon: "🫙", rarity: "common",    desc: "The snack of mild disappointment.",                    sellValue: 1,    isEid: false },
  // UNCOMMON
  { name: "Ramen Bowl",      icon: "🍜", rarity: "uncommon",  desc: "Steaming noodles with a rich broth!",                  sellValue: 5,    isEid: false },
  { name: "Grilled Corn",    icon: "🌽", rarity: "uncommon",  desc: "Charred sweetness from the grill.",                    sellValue: 5,    isEid: false },
  { name: "Avocado Toast",   icon: "🥑", rarity: "uncommon",  desc: "A brunch classic. Somewhat trendy.",                   sellValue: 5,    isEid: false },
  { name: "Taco",            icon: "🌮", rarity: "uncommon",  desc: "Crunchy shell, tasty fillings.",                       sellValue: 5,    isEid: false },
  { name: "Pancakes",        icon: "🥞", rarity: "uncommon",  desc: "Fluffy stacked goodness.",                             sellValue: 5,    isEid: false },
  // RARE
  { name: "Sushi Platter",   icon: "🍣", rarity: "rare",      desc: "Fresh nigiri and rolls, beautifully arranged.",        sellValue: 20,   isEid: false },
  { name: "Beef Steak",      icon: "🥩", rarity: "rare",      desc: "A perfectly seared cut. Medium-rare, of course.",      sellValue: 20,   isEid: false },
  { name: "Lobster Bisque",  icon: "🦞", rarity: "rare",      desc: "Rich, creamy, and deeply indulgent.",                  sellValue: 20,   isEid: false },
  { name: "Truffle Pasta",   icon: "🍝", rarity: "rare",      desc: "Earthy truffles tossed with silky pasta.",             sellValue: 20,   isEid: false },
  { name: "Wagyu Burger",    icon: "🍔", rarity: "rare",      desc: "Premium beef, perfectly seasoned.",                    sellValue: 20,   isEid: false },
  // EPIC
  { name: "Dragon Ramen",    icon: "🐉", rarity: "epic",      desc: "Legendary broth simmered for 72 hours.",               sellValue: 75,   isEid: false },
  { name: "Golden Cake",     icon: "🎂", rarity: "epic",      desc: "Encrusted with edible gold leaf.",                     sellValue: 75,   isEid: false },
  { name: "Kobe Teppanyaki", icon: "🔥", rarity: "epic",      desc: "Finest Kobe beef, teppanyaki style.",                  sellValue: 75,   isEid: false },
  { name: "Black Truffle",   icon: "🍄", rarity: "epic",      desc: "Rare fungal treasure from Périgord.",                  sellValue: 75,   isEid: false },
  // LEGENDARY
  { name: "Ambrosia Bowl",   icon: "🌟", rarity: "legendary", desc: "Food of the gods. Literally divine.",                  sellValue: 250,  isEid: false },
  { name: "Phoenix Wings",   icon: "🦅", rarity: "legendary", desc: "Spicy wings that burst into flame. Handle with care.", sellValue: 250,  isEid: false },
  { name: "Crystal Sashimi", icon: "💎", rarity: "legendary", desc: "Perfectly sliced, jewel-like tuna.",                   sellValue: 250,  isEid: false },
  // MYTHIC
  { name: "Celestial Ramen", icon: "✨", rarity: "mythic",    desc: "A bowl from another dimension. Indescribable taste.",  sellValue: 1000, isEid: false },
  { name: "Star Cake",       icon: "🌠", rarity: "mythic",    desc: "Baked in a supernova. Impossibly rare.",               sellValue: 1000, isEid: false },
];

// ── EID EXCLUSIVE FOODS ────────────────────────────────
const EID_FOODS = [
  { name: "Lamb Ouzi",        icon: "🐑", rarity: "eid", desc: "Slow-roasted whole lamb over fragrant rice. The crown of Eid al-Adha.",          sellValue: 150,  isEid: true },
  { name: "Mansaf",           icon: "🍲", rarity: "eid", desc: "Jordan's national pride — lamb in jameed sauce on a bed of rice.",               sellValue: 150,  isEid: true },
  { name: "Stuffed Grape Leaves", icon: "🌿", rarity: "eid", desc: "Tender vine leaves filled with spiced rice and minced lamb.",                sellValue: 100,  isEid: true },
  { name: "Knafeh",           icon: "🧡", rarity: "eid", desc: "Crispy shredded pastry soaked in sugar syrup over creamy cheese. Pure bliss.",   sellValue: 120,  isEid: true },
  { name: "Ma'amoul",         icon: "🌙", rarity: "eid", desc: "Buttery date-filled cookies dusted with powdered sugar. Eid tradition.",         sellValue: 80,   isEid: true },
  { name: "Harees",           icon: "🥣", rarity: "eid", desc: "Slow-cooked wheat and lamb porridge, a beloved Eid comfort dish.",               sellValue: 100,  isEid: true },
  { name: "Eid Kebab Platter",icon: "🍢", rarity: "eid", desc: "Skewers of perfectly spiced minced lamb, grilled over open flame.",              sellValue: 130,  isEid: true },
  // RARE EID
  { name: "Whole Roast Lamb", icon: "🔥", rarity: "eid-rare", desc: "An entire lamb roasted to golden perfection. A true feast centerpiece.",    sellValue: 400,  isEid: true },
  { name: "Saffron Biryani",  icon: "🌾", rarity: "eid-rare", desc: "Aromatic saffron rice layered with tender lamb and caramelized onions.",    sellValue: 380,  isEid: true },
  { name: "Royal Baklava",    icon: "🍯", rarity: "eid-rare", desc: "Forty paper-thin layers of pastry, pistachios, and rose-water syrup.",      sellValue: 350,  isEid: true },
  // LEGENDARY EID
  { name: "Al-Kabsa Royale",  icon: "👑", rarity: "eid-legendary", desc: "Saudi Arabia's legendary spiced rice with a full lamb shoulder. Reserved for kings.", sellValue: 1200, isEid: true },
  { name: "The Blessed Table",icon: "🕌", rarity: "eid-legendary", desc: "A mythical spread assembled only once a year. All Eid foods at once.",   sellValue: 2000, isEid: true },
];

const ALL_FOODS = [...FOODS, ...EID_FOODS];

// ── RARITIES ───────────────────────────────────────────
const RARITIES = {
  common:        { label: "COMMON"        },
  uncommon:      { label: "UNCOMMON"      },
  rare:          { label: "RARE"          },
  epic:          { label: "EPIC"          },
  legendary:     { label: "LEGENDARY"     },
  mythic:        { label: "MYTHIC"        },
  eid:           { label: "EID EXCLUSIVE" },
  "eid-rare":    { label: "EID RARE"      },
  "eid-legendary":{ label: "EID LEGENDARY"},
};

// ── STANDARD BOXES ────────────────────────────────────
const BOXES = [
  { name: "Snack Box",   icon: "📦", price: 10,  desc: "Basic luck. Common finds likely.", btnClass: "b0",
    weights: { common: 60, uncommon: 28, rare: 9, epic: 2.5, legendary: 0.4, mythic: 0.1 } },
  { name: "Gourmet Box", icon: "🎁", price: 50,  desc: "Better odds! Rare foods await.",   btnClass: "b1",
    weights: { common: 30, uncommon: 35, rare: 22, epic: 9, legendary: 3, mythic: 1 } },
  { name: "Legend Box",  icon: "👑", price: 200, desc: "Extreme luck. Mythic possible!",   btnClass: "b2",
    weights: { common: 10, uncommon: 20, rare: 30, epic: 22, legendary: 12, mythic: 6 } },
];

// ── EID BOXES (cost Mooncoins) ─────────────────────────
const EID_BOXES = [
  {
    name: "Eid Blessing Box", icon: "🌙",
    price: 15, currency: "mooncoins",
    desc: "Basic Eid box. Common Eid foods likely.",
    weights: { "eid": 70, "eid-rare": 25, "eid-legendary": 5 },
  },
  {
    name: "Sacrifice Chest",  icon: "🐑",
    price: 40, currency: "mooncoins",
    desc: "Premium Eid chest. Rare & Legendary Eid foods!",
    weights: { "eid": 40, "eid-rare": 40, "eid-legendary": 20 },
  },
];

// ── EID DAILY BLESSINGS (7 days) ──────────────────────
const EID_DAILY_REWARDS = [
  { day: 1, icon: "🌙", reward: 10,  type: "mooncoins", label: "10 🌙" },
  { day: 2, icon: "🌙", reward: 15,  type: "mooncoins", label: "15 🌙" },
  { day: 3, icon: "🐑", reward: 25,  type: "mooncoins", label: "25 🌙" },
  { day: 4, icon: "🌙", reward: 20,  type: "mooncoins", label: "20 🌙" },
  { day: 5, icon: "🌟", reward: 35,  type: "mooncoins", label: "35 🌙" },
  { day: 6, icon: "🌙", reward: 30,  type: "mooncoins", label: "30 🌙" },
  { day: 7, icon: "👑", reward: 100, type: "mooncoins", label: "100 🌙" },
];

// ── AUTO-CLICKER UPGRADES ─────────────────────────────
const UPGRADES = [
  { id: "snack_imp",  icon: "🍪", name: "Cookie Jar",  desc: "A jar that drops +1 coin/s automatically.", baseCps: 1,  baseCost: 50,   costScale: 1.6, maxLevel: 10 },
  { id: "pizza_oven", icon: "🍕", name: "Pizza Oven",  desc: "Warm oven generates +5 coins/s.",           baseCps: 5,  baseCost: 200,  costScale: 1.7, maxLevel: 10 },
  { id: "sushi_bar",  icon: "🍣", name: "Sushi Bar",   desc: "Premium bar generates +20 coins/s.",        baseCps: 20, baseCost: 800,  costScale: 1.8, maxLevel: 10 },
  { id: "ramen_shop", icon: "🍜", name: "Ramen Shop",  desc: "A booming ramen shop: +80 coins/s.",        baseCps: 80, baseCost: 3000, costScale: 1.9, maxLevel: 10 },
];

// ── ACHIEVEMENTS ──────────────────────────────────────
const ACHIEVEMENTS = [
  // Standard
  { id: "first_click", icon: "👆", name: "First Touch",       desc: "Click the coin for the first time.",  type: "clicks",    target: 1,             reward: 5,    rewardType: "coins", isEid: false },
  { id: "click_100",   icon: "💪", name: "Finger Workout",    desc: "Click 100 times.",                    type: "clicks",    target: 100,           reward: 50,   rewardType: "coins", isEid: false },
  { id: "click_1000",  icon: "🖱️", name: "Click Monster",     desc: "Click 1,000 times.",                  type: "clicks",    target: 1000,          reward: 200,  rewardType: "coins", isEid: false },
  { id: "first_box",   icon: "🎁", name: "Unboxed!",          desc: "Open your first box.",                type: "boxes",     target: 1,             reward: 10,   rewardType: "coins", isEid: false },
  { id: "box_25",      icon: "📦", name: "Box Hoarder",       desc: "Open 25 boxes.",                      type: "boxes",     target: 25,            reward: 100,  rewardType: "coins", isEid: false },
  { id: "box_100",     icon: "🏪", name: "Box Magnate",       desc: "Open 100 boxes.",                     type: "boxes",     target: 100,           reward: 500,  rewardType: "coins", isEid: false },
  { id: "foods_5",     icon: "🥗", name: "Foodie",            desc: "Collect 5 unique foods.",             type: "unique",    target: 5,             reward: 30,   rewardType: "coins", isEid: false },
  { id: "foods_15",    icon: "🍽️", name: "Gourmet",           desc: "Collect 15 unique foods.",            type: "unique",    target: 15,            reward: 150,  rewardType: "coins", isEid: false },
  { id: "foods_all",   icon: "👨‍🍳", name: "Master Chef",       desc: "Collect all 24 unique foods.",        type: "unique",    target: 24,            reward: 2000, rewardType: "coins", isEid: false },
  { id: "rare_find",   icon: "🔵", name: "Rare Find",         desc: "Obtain a Rare food.",                 type: "rarity",    target: "rare",        reward: 40,   rewardType: "coins", isEid: false },
  { id: "epic_find",   icon: "🟣", name: "Epic Taste",        desc: "Obtain an Epic food.",                type: "rarity",    target: "epic",        reward: 100,  rewardType: "coins", isEid: false },
  { id: "legend_find", icon: "🟠", name: "Legendary Feast",   desc: "Obtain a Legendary food.",            type: "rarity",    target: "legendary",   reward: 300,  rewardType: "coins", isEid: false },
  { id: "mythic_find", icon: "🩷", name: "Mythic Bite",       desc: "Obtain a Mythic food.",               type: "rarity",    target: "mythic",      reward: 1000, rewardType: "coins", isEid: false },
  { id: "streak_3",    icon: "🔥", name: "On a Roll",         desc: "Log in 3 days in a row.",             type: "streak",    target: 3,             reward: 75,   rewardType: "coins", isEid: false },
  { id: "streak_7",    icon: "🌟", name: "Weekly Warrior",    desc: "Maintain a 7-day streak.",            type: "streak",    target: 7,             reward: 500,  rewardType: "coins", isEid: false },
  { id: "sold_100",    icon: "💸", name: "Market Flip",       desc: "Earn 100 coins by selling food.",     type: "sellTotal", target: 100,           reward: 50,   rewardType: "coins", isEid: false },
  // Eid Exclusive Achievements
  { id: "eid_first",      icon: "🌙", name: "Eid Mubarak!",      desc: "Open your first Eid box.",                        type: "eidBoxes",      target: 1,  reward: 20,  rewardType: "mooncoins", isEid: true },
  { id: "eid_boxes_10",   icon: "🐑", name: "Sacrifice Spirit",  desc: "Open 10 Eid boxes.",                              type: "eidBoxes",      target: 10, reward: 50,  rewardType: "mooncoins", isEid: true },
  { id: "eid_food_first", icon: "🍲", name: "Feast Begins",      desc: "Collect your first Eid exclusive food.",          type: "eidFoods",      target: 1,  reward: 15,  rewardType: "mooncoins", isEid: true },
  { id: "eid_food_5",     icon: "🌿", name: "Eid Table",         desc: "Collect 5 different Eid exclusive foods.",        type: "eidFoods",      target: 5,  reward: 60,  rewardType: "mooncoins", isEid: true },
  { id: "eid_food_all",   icon: "🕌", name: "Grand Eid Feast",   desc: "Collect all 12 Eid exclusive foods.",             type: "eidFoods",      target: 12, reward: 300, rewardType: "mooncoins", isEid: true },
  { id: "eid_legend",     icon: "👑", name: "Royal Blessing",    desc: "Obtain an Eid Legendary food.",                   type: "rarity",        target: "eid-legendary", reward: 100, rewardType: "mooncoins", isEid: true },
  { id: "eid_streak_7",   icon: "✨", name: "7 Days of Eid",     desc: "Claim all 7 Eid daily blessings.",                type: "eidDailyStreak",target: 7,  reward: 150, rewardType: "mooncoins", isEid: true },
];

// ── STATE ──────────────────────────────────────────────
let money            = 0;
let mooncoins        = 0;
let totalClicks      = 0;
let totalBoxes       = 0;
let totalEidBoxes    = 0;
let collection       = {};       // name -> { food, count }
let upgradeLevels    = {};       // upgradeId -> level
let achievementsDone = new Set();
let totalSellEarned  = 0;
let loginStreak      = 0;
let rarityFound      = new Set();
let eidFoodsFound    = new Set();
let eidDaysClaimed   = [];       // array of day numbers (1-7) claimed this event

// ── DOM REFS ───────────────────────────────────────────
const moneyEl      = document.getElementById("money-display");
const clicksEl     = document.getElementById("stat-clicks");
const boxesEl      = document.getElementById("stat-boxes");
const foodsEl      = document.getElementById("stat-foods");
const streakEl     = document.getElementById("stat-streak");
const mooncoinsEl  = document.getElementById("stat-mooncoins");
const eidCurrEl    = document.getElementById("eid-currency");
const collList     = document.getElementById("collection-list");
const coinBtn      = document.getElementById("coin-btn");
const overlay      = document.getElementById("modal-overlay");
const resultModal  = document.getElementById("result-modal");
const modalIcon    = document.getElementById("modal-icon");
const modalRar     = document.getElementById("modal-rarity");
const modalName    = document.getElementById("modal-name");
const modalDesc    = document.getElementById("modal-desc");
const modalEidBadge= document.getElementById("modal-eid-badge");
const modalClose   = document.getElementById("modal-close");
const cpsBadge     = document.getElementById("cps-badge");
const cpsVal       = document.getElementById("cps-val");
const sellAllBtn   = document.getElementById("sell-all-btn");
const achToast     = document.getElementById("achievement-toast");
const toastIcon    = document.getElementById("toast-icon");
const toastLabel   = document.getElementById("toast-label");
const toastName    = document.getElementById("toast-name");
const dailyBanner  = document.getElementById("daily-banner");
const dailyTitle   = document.getElementById("daily-title");
const dailySub     = document.getElementById("daily-sub");
const dailyClaim   = document.getElementById("daily-claim-btn");
const eidClaimBtn  = document.getElementById("eid-claim-day-btn");
const eidDaysRow   = document.getElementById("eid-days-row");

// ── HELPERS ────────────────────────────────────────────
function updateMoney() {
  moneyEl.textContent = money.toLocaleString();
}

function updateMooncoins() {
  mooncoins = Math.max(0, mooncoins);
  mooncoinsEl.textContent = mooncoins.toLocaleString();
  eidCurrEl.textContent   = mooncoins.toLocaleString();
}

function updateStats() {
  clicksEl.textContent = totalClicks.toLocaleString();
  boxesEl.textContent  = totalBoxes.toLocaleString();
  foodsEl.textContent  = Object.values(collection).reduce((s, v) => s + v.count, 0).toLocaleString();
  streakEl.textContent = loginStreak;
  updateMooncoins();
}

function spawnFloater(x, y, amount, color) {
  const el = document.createElement("div");
  el.className = "floater";
  el.textContent = `+${amount}`;
  if (color) el.style.color = color;
  el.style.left = (x - 20) + "px";
  el.style.top  = (y - 30) + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function getTotalCps() {
  return UPGRADES.reduce((sum, u) => sum + u.baseCps * (upgradeLevels[u.id] || 0), 0);
}

function getUpgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(upg.costScale, upgradeLevels[upg.id] || 0));
}

function updateCpsBadge() {
  const cps = getTotalCps();
  if (cps > 0) { cpsBadge.style.display = "inline-flex"; cpsVal.textContent = cps.toLocaleString(); }
  else          { cpsBadge.style.display = "none"; }
}

// ── COIN CLICK ─────────────────────────────────────────
let clickCount = 0;
coinBtn.addEventListener("click", (e) => {
  money++;
  totalClicks++;
  clickCount++;
  // Award 1 mooncoin every 10 clicks
  if (clickCount % 10 === 0) {
    mooncoins++;
    updateMooncoins();
    spawnFloater(e.clientX - 20, e.clientY - 50, "1 🌙", "#ffe680");
  }
  updateMoney();
  updateStats();
  coinBtn.classList.add("popping");
  setTimeout(() => coinBtn.classList.remove("popping"), 100);
  spawnFloater(e.clientX, e.clientY, 1);
  renderBoxButtons();
  renderUpgrades();
  renderEidBoxes();
  checkAchievements();
});

// ── AUTO-CLICKER TICK ──────────────────────────────────
setInterval(() => {
  const cps = getTotalCps();
  if (cps > 0) {
    money += cps;
    updateMoney();
    renderBoxButtons();
    renderUpgrades();
  }
}, 1000);

// ── PICK FOOD (standard) ───────────────────────────────
function pickFood(box) {
  const w = box.weights;
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let chosenRarity = "common";
  for (const [r, wt] of Object.entries(w)) {
    rand -= wt;
    if (rand <= 0) { chosenRarity = r; break; }
  }
  const pool = FOODS.filter(f => f.rarity === chosenRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── PICK EID FOOD ──────────────────────────────────────
function pickEidFood(box) {
  const w = box.weights;
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let chosenRarity = "eid";
  for (const [r, wt] of Object.entries(w)) {
    rand -= wt;
    if (rand <= 0) { chosenRarity = r; break; }
  }
  const pool = EID_FOODS.filter(f => f.rarity === chosenRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── OPEN STANDARD BOX ─────────────────────────────────
function openBox(idx) {
  const box = BOXES[idx];
  if (money < box.price) return;
  money -= box.price;
  totalBoxes++;
  updateMoney();
  updateStats();
  renderBoxButtons();
  const food = pickFood(box);
  registerFood(food);
  showFoodModal(food, false);
  checkAchievements();
}

// ── OPEN EID BOX ───────────────────────────────────────
function openEidBox(idx) {
  const box = EID_BOXES[idx];
  if (mooncoins < box.price) return;
  mooncoins -= box.price;
  totalEidBoxes++;
  updateMooncoins();
  renderEidBoxes();
  const food = pickEidFood(box);
  registerFood(food);
  eidFoodsFound.add(food.name);
  showFoodModal(food, true);
  checkAchievements();
}

// ── REGISTER FOOD TO COLLECTION ────────────────────────
function registerFood(food) {
  if (!collection[food.name]) collection[food.name] = { food, count: 0 };
  collection[food.name].count++;
  rarityFound.add(food.rarity);
  renderCollection();
}

// ── SHOW FOOD MODAL ────────────────────────────────────
function showFoodModal(food, isEid) {
  const rar = RARITIES[food.rarity];
  modalIcon.textContent = food.icon;
  modalRar.textContent  = rar.label;
  const rarClass = isEid ? "rarity-color-eid" : "rarity-color-" + food.rarity;
  modalRar.className    = "modal-rarity-label " + rarClass;
  modalName.textContent = food.name;
  modalName.className   = "modal-food-name " + rarClass;
  modalDesc.textContent = food.desc;

  if (isEid) {
    modalEidBadge.style.display = "inline-block";
    resultModal.classList.add("eid-modal");
    modalName.classList.add("eid-shine");
    setTimeout(() => modalName.classList.remove("eid-shine"), 1700);
  } else {
    modalEidBadge.style.display = "none";
    resultModal.classList.remove("eid-modal");
    if (food.rarity === "legendary" || food.rarity === "mythic") {
      modalName.classList.add("shine");
      setTimeout(() => modalName.classList.remove("shine"), 1300);
    }
  }
  overlay.classList.add("show");
}

modalClose.addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("show"); });

// ── BUY UPGRADE ────────────────────────────────────────
function buyUpgrade(idx) {
  const upg = UPGRADES[idx];
  const lvl = upgradeLevels[upg.id] || 0;
  if (lvl >= upg.maxLevel) return;
  const cost = getUpgradeCost(upg);
  if (money < cost) return;
  money -= cost;
  upgradeLevels[upg.id] = lvl + 1;
  updateMoney();
  renderUpgrades();
  renderBoxButtons();
  updateCpsBadge();
}

// ── SELL DUPLICATES ────────────────────────────────────
function sellDupe(foodName) {
  const entry = collection[foodName];
  if (!entry || entry.count <= 1) return;
  const earned = (entry.count - 1) * entry.food.sellValue;
  entry.count = 1;
  money += earned;
  totalSellEarned += earned;
  updateMoney();
  renderCollection();
  checkAchievements();
}

function sellAllDupes() {
  let total = 0;
  Object.keys(collection).forEach(name => {
    const entry = collection[name];
    if (entry.count > 1) {
      total += (entry.count - 1) * entry.food.sellValue;
      totalSellEarned += (entry.count - 1) * entry.food.sellValue;
      entry.count = 1;
    }
  });
  if (total > 0) {
    money += total;
    updateMoney();
    renderCollection();
    checkAchievements();
    const r = sellAllBtn.getBoundingClientRect();
    spawnFloater(r.left + r.width / 2, r.top, total, "#5dde78");
  }
}

sellAllBtn.addEventListener("click", sellAllDupes);

// ── ACHIEVEMENTS ───────────────────────────────────────
let toastQueue = [], toastRunning = false;

function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (achievementsDone.has(ach.id)) return;
    let done = false;
    switch (ach.type) {
      case "clicks":         done = totalClicks >= ach.target; break;
      case "boxes":          done = totalBoxes  >= ach.target; break;
      case "unique":         done = Object.keys(collection).filter(n => !collection[n].food.isEid).length >= ach.target; break;
      case "rarity":         done = rarityFound.has(ach.target); break;
      case "streak":         done = loginStreak >= ach.target; break;
      case "sellTotal":      done = totalSellEarned >= ach.target; break;
      case "eidBoxes":       done = totalEidBoxes >= ach.target; break;
      case "eidFoods":       done = eidFoodsFound.size >= ach.target; break;
      case "eidDailyStreak": done = eidDaysClaimed.length >= ach.target; break;
    }
    if (done) {
      achievementsDone.add(ach.id);
      if (ach.rewardType === "mooncoins") { mooncoins += ach.reward; updateMooncoins(); }
      else { money += ach.reward; updateMoney(); }
      toastQueue.push(ach);
      runToastQueue();
      renderAchievements();
    }
  });
}

function runToastQueue() {
  if (toastRunning || toastQueue.length === 0) return;
  toastRunning = true;
  const ach = toastQueue.shift();
  toastIcon.textContent = ach.icon;
  const rewardStr = ach.rewardType === "mooncoins"
    ? `+${ach.reward} 🌙 Mooncoins`
    : `+${ach.reward} 🪙`;
  toastName.textContent = `${ach.name} (${rewardStr})`;
  if (ach.isEid) {
    achToast.classList.add("eid-toast");
    toastLabel.textContent = "✨ Eid Achievement!";
    toastLabel.className = "toast-label eid-toast-label";
  } else {
    achToast.classList.remove("eid-toast");
    toastLabel.textContent = "Achievement Unlocked!";
    toastLabel.className = "toast-label";
  }
  achToast.classList.add("show");
  setTimeout(() => {
    achToast.classList.remove("show");
    setTimeout(() => { toastRunning = false; runToastQueue(); }, 400);
  }, 3200);
}

// ── STANDARD DAILY LOGIN BONUS ─────────────────────────
function checkDailyBonus() {
  const today     = new Date().toDateString();
  const lastLogin = localStorage.getItem("ff_lastLogin") || "";
  const streak    = parseInt(localStorage.getItem("ff_streak") || "0");
  if (localStorage.getItem("ff_claimed") === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  loginStreak = (lastLogin === yesterday) ? streak + 1 : 1;
  const bonus = Math.min(loginStreak * 10, 200);
  dailyTitle.textContent    = `Day ${loginStreak} Bonus! 🎉`;
  dailySub.textContent      = `Login streak reward: +${bonus} 🪙`;
  dailyClaim.textContent    = `Claim +${bonus} 🪙`;
  dailyBanner.style.display = "flex";
  dailyClaim.addEventListener("click", () => {
    money += bonus;
    updateMoney();
    renderBoxButtons();
    dailyBanner.style.display = "none";
    localStorage.setItem("ff_lastLogin", today);
    localStorage.setItem("ff_streak",    loginStreak);
    localStorage.setItem("ff_claimed",   today);
    updateStats();
    checkAchievements();
  }, { once: true });
}

// ── EID DAILY BLESSINGS ────────────────────────────────
function initEidDailyBlessings() {
  const stored = localStorage.getItem("ff_eidDays");
  eidDaysClaimed = stored ? JSON.parse(stored) : [];
  renderEidDaysRow();

  const todayClaimed = localStorage.getItem("ff_eidDayClaimedDate") === new Date().toDateString();
  eidClaimBtn.disabled = todayClaimed || eidDaysClaimed.length >= 7;
  if (eidDaysClaimed.length >= 7) eidClaimBtn.textContent = "All 7 Days Claimed! 🌙";
  if (todayClaimed && eidDaysClaimed.length < 7) eidClaimBtn.textContent = "Come back tomorrow 🌙";
}

function renderEidDaysRow() {
  eidDaysRow.innerHTML = "";
  EID_DAILY_REWARDS.forEach((day) => {
    const claimed = eidDaysClaimed.includes(day.day);
    const isNext  = eidDaysClaimed.length + 1 === day.day;
    const isFuture= day.day > eidDaysClaimed.length + 1;
    const chip = document.createElement("div");
    chip.className = "eid-day-chip" + (claimed ? " claimed" : isNext ? " today" : " future");
    chip.innerHTML = `
      <span class="eid-day-num">Day ${day.day}</span>
      <span class="eid-day-reward">${claimed ? "✅" : day.icon}</span>
      <span class="eid-day-check">${claimed ? "Done" : day.label}</span>
    `;
    eidDaysRow.appendChild(chip);
  });
}

eidClaimBtn.addEventListener("click", () => {
  const nextDay = eidDaysClaimed.length + 1;
  if (nextDay > 7) return;
  const reward = EID_DAILY_REWARDS[nextDay - 1];
  mooncoins += reward.reward;
  eidDaysClaimed.push(nextDay);
  updateMooncoins();
  renderEidDaysRow();
  renderEidBoxes();
  localStorage.setItem("ff_eidDays", JSON.stringify(eidDaysClaimed));
  localStorage.setItem("ff_eidDayClaimedDate", new Date().toDateString());
  eidClaimBtn.disabled = true;
  eidClaimBtn.textContent = nextDay >= 7 ? "All 7 Days Claimed! 🌙" : "Come back tomorrow 🌙";
  // Floater
  const r = eidClaimBtn.getBoundingClientRect();
  spawnFloater(r.left + r.width / 2, r.top, `${reward.reward} 🌙`, "#ffe680");
  checkAchievements();
});

// ── RENDER: STANDARD BOXES ─────────────────────────────
function renderBoxButtons() {
  const grid = document.getElementById("boxes-grid");
  grid.innerHTML = "";
  BOXES.forEach((box, i) => {
    const card = document.createElement("div");
    card.className = "box-card";
    card.innerHTML = `
      <div class="box-icon">${box.icon}</div>
      <div class="box-name">${box.name}</div>
      <div class="box-desc">${box.desc}</div>
      <div class="box-price">🪙 ${box.price.toLocaleString()}</div>
      <button class="box-btn ${box.btnClass}" ${money < box.price ? "disabled" : ""}>Open!</button>
    `;
    card.querySelector("button").addEventListener("click", () => openBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: EID BOXES ──────────────────────────────────
function renderEidBoxes() {
  const grid = document.getElementById("eid-boxes-grid");
  grid.innerHTML = "";
  EID_BOXES.forEach((box, i) => {
    const card = document.createElement("div");
    card.className = "eid-box-card";
    card.innerHTML = `
      <div class="eid-box-icon">${box.icon}</div>
      <div class="eid-box-name">${box.name}</div>
      <div class="eid-box-desc">${box.desc}</div>
      <div class="eid-box-price">🌙 ${box.price} MC</div>
      <button class="eid-box-btn" ${mooncoins < box.price ? "disabled" : ""}>Open!</button>
    `;
    card.querySelector("button").addEventListener("click", () => openEidBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: UPGRADES ───────────────────────────────────
function renderUpgrades() {
  const grid = document.getElementById("upgrades-grid");
  grid.innerHTML = "";
  UPGRADES.forEach((upg, i) => {
    const lvl   = upgradeLevels[upg.id] || 0;
    const maxed = lvl >= upg.maxLevel;
    const cost  = getUpgradeCost(upg);
    const card  = document.createElement("div");
    card.className = "upgrade-card" + (maxed ? " maxed" : "");
    card.innerHTML = `
      <div class="upgrade-icon">${upg.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${upg.name}</div>
        <div class="upgrade-desc">${upg.desc}</div>
        <span class="upgrade-level">Lvl ${lvl}/${upg.maxLevel} · ${upg.baseCps * lvl > 0 ? `+${upg.baseCps * lvl}/s` : "idle"}</span>
      </div>
      <div class="upgrade-right">
        <div class="upgrade-price">${maxed ? "—" : "🪙 " + cost.toLocaleString()}</div>
        <button class="upgrade-btn ${maxed ? "maxed-btn" : ""}" ${maxed || money < cost ? "disabled" : ""}>
          ${maxed ? "MAX" : "Buy"}
        </button>
      </div>
    `;
    if (!maxed) card.querySelector("button").addEventListener("click", () => buyUpgrade(i));
    grid.appendChild(card);
  });
}

// ── RENDER: ACHIEVEMENTS ───────────────────────────────
function renderAchievements() {
  const list = document.getElementById("achievements-list");
  list.innerHTML = "";

  // Separate Eid and standard, show Eid first
  const sorted = [...ACHIEVEMENTS].sort((a, b) => {
    if (a.isEid && !b.isEid) return -1;
    if (!a.isEid && b.isEid) return 1;
    return 0;
  });

  sorted.forEach(ach => {
    const done = achievementsDone.has(ach.id);
    let progress = 0;
    switch (ach.type) {
      case "clicks":         progress = Math.min(totalClicks / ach.target, 1); break;
      case "boxes":          progress = Math.min(totalBoxes  / ach.target, 1); break;
      case "unique":         progress = Math.min(Object.keys(collection).filter(n => !collection[n].food.isEid).length / ach.target, 1); break;
      case "rarity":         progress = rarityFound.has(ach.target) ? 1 : 0; break;
      case "streak":         progress = Math.min(loginStreak / ach.target, 1); break;
      case "sellTotal":      progress = Math.min(totalSellEarned / ach.target, 1); break;
      case "eidBoxes":       progress = Math.min(totalEidBoxes / ach.target, 1); break;
      case "eidFoods":       progress = Math.min(eidFoodsFound.size / ach.target, 1); break;
      case "eidDailyStreak": progress = Math.min(eidDaysClaimed.length / ach.target, 1); break;
    }
    const pct = Math.round(progress * 100);
    const rewardStr = ach.rewardType === "mooncoins" ? `+${ach.reward} 🌙` : `+${ach.reward} 🪙`;
    const card = document.createElement("div");
    card.className = "ach-card" + (done ? " unlocked" : "") + (ach.isEid ? " eid-ach" : "");
    card.innerHTML = `
      <div class="ach-icon ${done ? "" : "locked"}">${ach.icon}</div>
      <div class="ach-info">
        <div class="ach-name ${ach.isEid ? "eid-name" : ""}">${ach.name}</div>
        <div class="ach-desc ${ach.isEid ? "eid-desc" : ""}">${ach.desc}</div>
        ${!done ? `<div class="ach-progress-wrap">
          <div class="ach-progress-bar">
            <div class="ach-progress-fill ${pct >= 100 ? "done" : ""} ${ach.isEid ? "eid-fill" : ""}" style="width:${pct}%"></div>
          </div>
          <div class="ach-pct">${pct}%</div>
        </div>` : ""}
      </div>
      <div class="ach-reward ${ach.isEid ? "eid-reward" : ""}">${rewardStr}</div>
    `;
    list.appendChild(card);
  });
}

// ── RENDER: COLLECTION ─────────────────────────────────
function renderCollection() {
  collList.innerHTML = "";
  const sorted = Object.values(collection).sort((a, b) => {
    const order = ["eid-legendary","eid-rare","eid","mythic","legendary","epic","rare","uncommon","common"];
    return order.indexOf(a.food.rarity) - order.indexOf(b.food.rarity);
  });
  if (sorted.length === 0) {
    collList.innerHTML = '<p class="empty-msg">Open boxes to discover foods!</p>';
    return;
  }
  sorted.forEach(({ food, count }) => {
    const item = document.createElement("div");
    item.className = "coll-item" + (food.isEid ? " eid-item" : "");
    const hasDupe = count > 1;
    const colorClass = food.isEid ? "rarity-color-eid" : "rarity-color-" + food.rarity;
    const dotClass   = food.isEid ? "dot-eid" : "dot-" + food.rarity;
    item.innerHTML = `
      <div class="rarity-dot ${dotClass}"></div>
      <span class="coll-icon">${food.icon}</span>
      <span class="coll-name ${colorClass}">${food.name}</span>
      <span class="coll-count">×${count}</span>
      ${hasDupe ? `<button class="coll-sell-btn" data-name="${food.name}">Sell (${count-1}) +${(count-1)*food.sellValue}🪙</button>` : ""}
    `;
    if (hasDupe) item.querySelector(".coll-sell-btn").addEventListener("click", () => sellDupe(food.name));
    collList.appendChild(item);
  });
}

// ── TABS ───────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "achievements") renderAchievements();
    if (btn.dataset.tab === "upgrades")     renderUpgrades();
    if (btn.dataset.tab === "eid")          renderEidBoxes();
  });
});

// ── INIT ───────────────────────────────────────────────
checkDailyBonus();
initEidDailyBlessings();
renderBoxButtons();
renderEidBoxes();
renderUpgrades();
renderCollection();
renderAchievements();
updateCpsBadge();
updateMooncoins();