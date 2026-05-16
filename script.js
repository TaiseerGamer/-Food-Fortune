// ════════════════════════════════════════
//  Food Fortune — v0.1.0
//  New: Auto-clicker upgrades, Daily login
//       bonus/streak, Achievements, Sell dupes
// ════════════════════════════════════════

// ── DATA ──────────────────────────────────
const FOODS = [
  { name: "White Rice",      icon: "🍚", rarity: "common",    desc: "A humble staple. Not exciting, but reliable.",         sellValue: 1  },
  { name: "Plain Bread",     icon: "🍞", rarity: "common",    desc: "Just bread. Basic. You can do this.",                   sellValue: 1  },
  { name: "Boiled Egg",      icon: "🥚", rarity: "common",    desc: "Protein, that's about it.",                            sellValue: 1  },
  { name: "Carrot Sticks",   icon: "🥕", rarity: "common",    desc: "Crunchy and orange. Very common.",                     sellValue: 1  },
  { name: "Crackers",        icon: "🫙", rarity: "common",    desc: "The snack of mild disappointment.",                    sellValue: 1  },
  { name: "Ramen Bowl",      icon: "🍜", rarity: "uncommon",  desc: "Steaming noodles with a rich broth!",                  sellValue: 5  },
  { name: "Grilled Corn",    icon: "🌽", rarity: "uncommon",  desc: "Charred sweetness from the grill.",                    sellValue: 5  },
  { name: "Avocado Toast",   icon: "🥑", rarity: "uncommon",  desc: "A brunch classic. Somewhat trendy.",                   sellValue: 5  },
  { name: "Taco",            icon: "🌮", rarity: "uncommon",  desc: "Crunchy shell, tasty fillings.",                       sellValue: 5  },
  { name: "Pancakes",        icon: "🥞", rarity: "uncommon",  desc: "Fluffy stacked goodness.",                             sellValue: 5  },
  { name: "Sushi Platter",   icon: "🍣", rarity: "rare",      desc: "Fresh nigiri and rolls, beautifully arranged.",        sellValue: 20 },
  { name: "Beef Steak",      icon: "🥩", rarity: "rare",      desc: "A perfectly seared cut. Medium-rare, of course.",      sellValue: 20 },
  { name: "Lobster Bisque",  icon: "🦞", rarity: "rare",      desc: "Rich, creamy, and deeply indulgent.",                  sellValue: 20 },
  { name: "Truffle Pasta",   icon: "🍝", rarity: "rare",      desc: "Earthy truffles tossed with silky pasta.",             sellValue: 20 },
  { name: "Wagyu Burger",    icon: "🍔", rarity: "rare",      desc: "Premium beef, perfectly seasoned.",                    sellValue: 20 },
  { name: "Dragon Ramen",    icon: "🐉", rarity: "epic",      desc: "Legendary broth simmered for 72 hours.",               sellValue: 75 },
  { name: "Golden Cake",     icon: "🎂", rarity: "epic",      desc: "Encrusted with edible gold leaf.",                     sellValue: 75 },
  { name: "Kobe Teppanyaki", icon: "🔥", rarity: "epic",      desc: "Finest Kobe beef, teppanyaki style.",                  sellValue: 75 },
  { name: "Black Truffle",   icon: "🍄", rarity: "epic",      desc: "Rare fungal treasure from Périgord.",                  sellValue: 75 },
  { name: "Ambrosia Bowl",   icon: "🌟", rarity: "legendary", desc: "Food of the gods. Literally divine.",                  sellValue: 250 },
  { name: "Phoenix Wings",   icon: "🦅", rarity: "legendary", desc: "Spicy wings that burst into flame. Handle with care.", sellValue: 250 },
  { name: "Crystal Sashimi", icon: "💎", rarity: "legendary", desc: "Perfectly sliced, jewel-like tuna.",                   sellValue: 250 },
  { name: "Celestial Ramen", icon: "✨", rarity: "mythic",    desc: "A bowl from another dimension. Indescribable taste.",  sellValue: 1000 },
  { name: "Star Cake",       icon: "🌠", rarity: "mythic",    desc: "Baked in a supernova. Impossibly rare.",               sellValue: 1000 },
];

const RARITIES = {
  common:    { label: "COMMON"    },
  uncommon:  { label: "UNCOMMON"  },
  rare:      { label: "RARE"      },
  epic:      { label: "EPIC"      },
  legendary: { label: "LEGENDARY" },
  mythic:    { label: "MYTHIC"    },
};

const BOXES = [
  {
    name: "Snack Box",   icon: "📦", price: 10,  desc: "Basic luck. Common finds likely.", btnClass: "b0",
    weights: { common: 60, uncommon: 28, rare: 9, epic: 2.5, legendary: 0.4, mythic: 0.1 }
  },
  {
    name: "Gourmet Box", icon: "🎁", price: 50,  desc: "Better odds! Rare foods await.",   btnClass: "b1",
    weights: { common: 30, uncommon: 35, rare: 22, epic: 9, legendary: 3, mythic: 1 }
  },
  {
    name: "Legend Box",  icon: "👑", price: 200, desc: "Extreme luck. Mythic possible!",   btnClass: "b2",
    weights: { common: 10, uncommon: 20, rare: 30, epic: 22, legendary: 12, mythic: 6 }
  },
];

// ── AUTO-CLICKER UPGRADES ─────────────────
const UPGRADES = [
  {
    id: "snack_imp",
    icon: "🍪",
    name: "Cookie Jar",
    desc: "A jar that drops +1 coin per second automatically.",
    baseCps: 1,
    baseCost: 50,
    costScale: 1.6,
    maxLevel: 10,
  },
  {
    id: "pizza_oven",
    icon: "🍕",
    name: "Pizza Oven",
    desc: "Warm oven generates +5 coins/s.",
    baseCps: 5,
    baseCost: 200,
    costScale: 1.7,
    maxLevel: 10,
  },
  {
    id: "sushi_bar",
    icon: "🍣",
    name: "Sushi Bar",
    desc: "Premium bar generates +20 coins/s.",
    baseCps: 20,
    baseCost: 800,
    costScale: 1.8,
    maxLevel: 10,
  },
  {
    id: "ramen_shop",
    icon: "🍜",
    name: "Ramen Shop",
    desc: "A booming ramen shop: +80 coins/s.",
    baseCps: 80,
    baseCost: 3000,
    costScale: 1.9,
    maxLevel: 10,
  },
];

// ── ACHIEVEMENTS ──────────────────────────
const ACHIEVEMENTS = [
  { id: "first_click",  icon: "👆", name: "First Touch",     desc: "Click the coin for the first time.",   type: "clicks",    target: 1,    reward: 5    },
  { id: "click_100",    icon: "💪", name: "Finger Workout",  desc: "Click 100 times.",                     type: "clicks",    target: 100,  reward: 50   },
  { id: "click_1000",   icon: "🖱️", name: "Click Monster",   desc: "Click 1,000 times.",                   type: "clicks",    target: 1000, reward: 200  },
  { id: "first_box",    icon: "🎁", name: "Unboxed!",        desc: "Open your first box.",                 type: "boxes",     target: 1,    reward: 10   },
  { id: "box_25",       icon: "📦", name: "Box Hoarder",     desc: "Open 25 boxes.",                       type: "boxes",     target: 25,   reward: 100  },
  { id: "box_100",      icon: "🏪", name: "Box Magnate",     desc: "Open 100 boxes.",                      type: "boxes",     target: 100,  reward: 500  },
  { id: "foods_5",      icon: "🥗", name: "Foodie",          desc: "Collect 5 unique foods.",              type: "unique",    target: 5,    reward: 30   },
  { id: "foods_15",     icon: "🍽️", name: "Gourmet",         desc: "Collect 15 unique foods.",             type: "unique",    target: 15,   reward: 150  },
  { id: "foods_all",    icon: "👨‍🍳", name: "Master Chef",     desc: "Collect all 24 unique foods.",         type: "unique",    target: 24,   reward: 2000 },
  { id: "rare_find",    icon: "🔵", name: "Rare Find",       desc: "Obtain a Rare food.",                  type: "rarity",    target: "rare",      reward: 40   },
  { id: "epic_find",    icon: "🟣", name: "Epic Taste",      desc: "Obtain an Epic food.",                 type: "rarity",    target: "epic",      reward: 100  },
  { id: "legend_find",  icon: "🟠", name: "Legendary Feast", desc: "Obtain a Legendary food.",             type: "rarity",    target: "legendary", reward: 300  },
  { id: "mythic_find",  icon: "🩷", name: "Mythic Bite",     desc: "Obtain a Mythic food.",                type: "rarity",    target: "mythic",    reward: 1000 },
  { id: "streak_3",     icon: "🔥", name: "On a Roll",       desc: "Log in 3 days in a row.",              type: "streak",    target: 3,    reward: 75   },
  { id: "streak_7",     icon: "🌟", name: "Weekly Warrior",  desc: "Maintain a 7-day streak.",             type: "streak",    target: 7,    reward: 500  },
  { id: "sold_100",     icon: "💸", name: "Market Flip",     desc: "Earn 100 coins by selling food.",      type: "sellTotal", target: 100,  reward: 50   },
];

// ── STATE ──────────────────────────────────
let money        = 0;
let totalClicks  = 0;
let totalBoxes   = 0;
let collection   = {}; // name -> { food, count }
let upgradeLevels = {}; // upgradeId -> level
let achievementsDone = new Set();
let totalSellEarned  = 0;
let loginStreak      = 0;
let rarityFound      = new Set(); // rarities obtained at least once

// ── DOM ────────────────────────────────────
const moneyEl     = document.getElementById("money-display");
const clicksEl    = document.getElementById("stat-clicks");
const boxesEl     = document.getElementById("stat-boxes");
const foodsEl     = document.getElementById("stat-foods");
const streakEl    = document.getElementById("stat-streak");
const collList    = document.getElementById("collection-list");
const coinBtn     = document.getElementById("coin-btn");
const overlay     = document.getElementById("modal-overlay");
const modalIcon   = document.getElementById("modal-icon");
const modalRar    = document.getElementById("modal-rarity");
const modalName   = document.getElementById("modal-name");
const modalDesc   = document.getElementById("modal-desc");
const modalClose  = document.getElementById("modal-close");
const cpsBadge    = document.getElementById("cps-badge");
const cpsVal      = document.getElementById("cps-val");
const sellAllBtn  = document.getElementById("sell-all-btn");
const achToast    = document.getElementById("achievement-toast");
const toastIcon   = document.getElementById("toast-icon");
const toastName   = document.getElementById("toast-name");
const dailyBanner = document.getElementById("daily-banner");
const dailyTitle  = document.getElementById("daily-title");
const dailySub    = document.getElementById("daily-sub");
const dailyClaim  = document.getElementById("daily-claim-btn");

// ── HELPERS ────────────────────────────────
function updateMoney() { moneyEl.textContent = money.toLocaleString(); }

function updateStats() {
  clicksEl.textContent = totalClicks.toLocaleString();
  boxesEl.textContent  = totalBoxes.toLocaleString();
  foodsEl.textContent  = Object.values(collection).reduce((s, v) => s + v.count, 0).toLocaleString();
  streakEl.textContent = loginStreak;
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
  return UPGRADES.reduce((sum, u) => {
    const lvl = upgradeLevels[u.id] || 0;
    return sum + u.baseCps * lvl;
  }, 0);
}

function getUpgradeCost(upg) {
  const lvl = upgradeLevels[upg.id] || 0;
  return Math.floor(upg.baseCost * Math.pow(upg.costScale, lvl));
}

// ── COIN CLICK ─────────────────────────────
coinBtn.addEventListener("click", (e) => {
  money++;
  totalClicks++;
  updateMoney();
  updateStats();
  coinBtn.classList.add("popping");
  setTimeout(() => coinBtn.classList.remove("popping"), 100);
  spawnFloater(e.clientX, e.clientY, 1);
  renderBoxButtons();
  renderUpgrades();
  checkAchievements();
});

// ── AUTO-CLICKER TICK ─────────────────────
setInterval(() => {
  const cps = getTotalCps();
  if (cps > 0) {
    money += cps;
    updateMoney();
    renderBoxButtons();
    renderUpgrades();
  }
}, 1000);

// ── RARITY PICK ────────────────────────────
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

// ── OPEN BOX ───────────────────────────────
function openBox(boxIdx) {
  const box = BOXES[boxIdx];
  if (money < box.price) return;
  money -= box.price;
  totalBoxes++;
  updateMoney();
  updateStats();
  renderBoxButtons();

  const food = pickFood(box);
  if (!collection[food.name]) collection[food.name] = { food, count: 0 };
  collection[food.name].count++;
  rarityFound.add(food.rarity);
  renderCollection();

  const rar = RARITIES[food.rarity];
  modalIcon.textContent = food.icon;
  modalRar.textContent  = rar.label;
  modalRar.className    = "modal-rarity-label rarity-color-" + food.rarity;
  modalName.textContent = food.name;
  modalName.className   = "modal-food-name rarity-color-" + food.rarity;
  modalDesc.textContent = food.desc;
  if (food.rarity === "legendary" || food.rarity === "mythic") {
    modalName.classList.add("shine");
    setTimeout(() => modalName.classList.remove("shine"), 1300);
  }
  overlay.classList.add("show");
  checkAchievements();
}

modalClose.addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("show"); });

// ── BUY UPGRADE ────────────────────────────
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

function updateCpsBadge() {
  const cps = getTotalCps();
  if (cps > 0) {
    cpsBadge.style.display = "inline-flex";
    cpsVal.textContent = cps.toLocaleString();
  } else {
    cpsBadge.style.display = "none";
  }
}

// ── SELL DUPLICATES ────────────────────────
function sellDupe(foodName) {
  const entry = collection[foodName];
  if (!entry || entry.count <= 1) return;
  const dupes = entry.count - 1;
  const earned = dupes * entry.food.sellValue;
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
      const dupes = entry.count - 1;
      total += dupes * entry.food.sellValue;
      totalSellEarned += dupes * entry.food.sellValue;
      entry.count = 1;
    }
  });
  if (total > 0) {
    money += total;
    updateMoney();
    renderCollection();
    checkAchievements();
    // show a floater near the button
    const btn = sellAllBtn.getBoundingClientRect();
    spawnFloater(btn.left + btn.width / 2, btn.top, total, "#5dde78");
  }
}

sellAllBtn.addEventListener("click", sellAllDupes);

// ── ACHIEVEMENTS ───────────────────────────
let toastQueue = [];
let toastRunning = false;

function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (achievementsDone.has(ach.id)) return;
    let done = false;
    switch (ach.type) {
      case "clicks":    done = totalClicks >= ach.target; break;
      case "boxes":     done = totalBoxes  >= ach.target; break;
      case "unique":    done = Object.keys(collection).length >= ach.target; break;
      case "rarity":    done = rarityFound.has(ach.target); break;
      case "streak":    done = loginStreak >= ach.target; break;
      case "sellTotal": done = totalSellEarned >= ach.target; break;
    }
    if (done) {
      achievementsDone.add(ach.id);
      money += ach.reward;
      updateMoney();
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
  toastName.textContent = `${ach.name} (+${ach.reward} 🪙)`;
  achToast.classList.add("show");
  setTimeout(() => {
    achToast.classList.remove("show");
    setTimeout(() => { toastRunning = false; runToastQueue(); }, 400);
  }, 3000);
}

// ── DAILY LOGIN BONUS ──────────────────────
function checkDailyBonus() {
  const today     = new Date().toDateString();
  const lastLogin = localStorage.getItem("ff_lastLogin") || "";
  const streak    = parseInt(localStorage.getItem("ff_streak") || "0");
  const claimed   = localStorage.getItem("ff_claimed") === today;

  if (claimed) return; // already claimed today

  // Calculate streak
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  loginStreak = (lastLogin === yesterday) ? streak + 1 : 1;

  const bonus = Math.min(loginStreak * 10, 200); // 10 per day, cap 200

  dailyTitle.textContent = `Day ${loginStreak} Bonus! 🎉`;
  dailySub.textContent   = `Login streak reward: +${bonus} 🪙`;
  dailyClaim.textContent = `Claim +${bonus} 🪙`;
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

// ── RENDER: BOX BUTTONS ────────────────────
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
      <button class="box-btn ${box.btnClass}" ${money < box.price ? "disabled" : ""} data-idx="${i}">Open!</button>
    `;
    card.querySelector("button").addEventListener("click", () => openBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: UPGRADES ──────────────────────
function renderUpgrades() {
  const grid = document.getElementById("upgrades-grid");
  grid.innerHTML = "";
  UPGRADES.forEach((upg, i) => {
    const lvl   = upgradeLevels[upg.id] || 0;
    const maxed = lvl >= upg.maxLevel;
    const cost  = getUpgradeCost(upg);
    const cps   = upg.baseCps * lvl;

    const card = document.createElement("div");
    card.className = "upgrade-card" + (maxed ? " maxed" : "");
    card.innerHTML = `
      <div class="upgrade-icon">${upg.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${upg.name}</div>
        <div class="upgrade-desc">${upg.desc}</div>
        <span class="upgrade-level">Lvl ${lvl}/${upg.maxLevel} · ${cps > 0 ? `+${cps}/s` : "idle"}</span>
      </div>
      <div class="upgrade-right">
        <div class="upgrade-price">${maxed ? "—" : "🪙 " + cost.toLocaleString()}</div>
        <button class="upgrade-btn ${maxed ? "maxed-btn" : ""}"
          ${maxed ? "disabled" : money < cost ? "disabled" : ""}
          data-idx="${i}">
          ${maxed ? "MAX" : "Buy"}
        </button>
      </div>
    `;
    if (!maxed) {
      card.querySelector("button").addEventListener("click", () => { buyUpgrade(i); updateCpsBadge(); });
    }
    grid.appendChild(card);
  });
}

// ── RENDER: ACHIEVEMENTS ──────────────────
function renderAchievements() {
  const list = document.getElementById("achievements-list");
  list.innerHTML = "";

  ACHIEVEMENTS.forEach(ach => {
    const done = achievementsDone.has(ach.id);
    let progress = 0;

    switch (ach.type) {
      case "clicks":    progress = Math.min(totalClicks / ach.target, 1); break;
      case "boxes":     progress = Math.min(totalBoxes  / ach.target, 1); break;
      case "unique":    progress = Math.min(Object.keys(collection).length / ach.target, 1); break;
      case "rarity":    progress = rarityFound.has(ach.target) ? 1 : 0; break;
      case "streak":    progress = Math.min(loginStreak / ach.target, 1); break;
      case "sellTotal": progress = Math.min(totalSellEarned / ach.target, 1); break;
    }

    const pct = Math.round(progress * 100);

    const card = document.createElement("div");
    card.className = "ach-card" + (done ? " unlocked" : "");
    card.innerHTML = `
      <div class="ach-icon ${done ? "" : "locked"}">${ach.icon}</div>
      <div class="ach-info">
        <div class "ach-name ${done ? "" : "locked"}">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
        ${!done ? `
          <div class="ach-progress-wrap">
            <div class="ach-progress-bar">
              <div class="ach-progress-fill ${pct >= 100 ? "done" : ""}" style="width:${pct}%"></div>
            </div>
            <div class="ach-pct">${pct}%</div>
          </div>` : ""}
      </div>
      <div class="ach-reward">+${ach.reward} 🪙</div>
    `;
    list.appendChild(card);
  });
}

// ── RENDER: COLLECTION ────────────────────
function renderCollection() {
  collList.innerHTML = "";
  const sorted = Object.values(collection).sort((a, b) => {
    const order = ["mythic","legendary","epic","rare","uncommon","common"];
    return order.indexOf(a.food.rarity) - order.indexOf(b.food.rarity);
  });
  if (sorted.length === 0) {
    collList.innerHTML = '<p class="empty-msg">Open boxes to discover foods!</p>';
    return;
  }
  sorted.forEach(({ food, count }) => {
    const item = document.createElement("div");
    item.className = "coll-item";
    const hasDupe = count > 1;
    item.innerHTML = `
      <div class="rarity-dot dot-${food.rarity}"></div>
      <span class="coll-icon">${food.icon}</span>
      <span class="coll-name rarity-color-${food.rarity}">${food.name}</span>
      <span class="coll-count">×${count}</span>
      ${hasDupe ? `<button class="coll-sell-btn" data-name="${food.name}">Sell (${count - 1}) +${(count-1)*food.sellValue}🪙</button>` : ""}
    `;
    if (hasDupe) {
      item.querySelector(".coll-sell-btn").addEventListener("click", () => sellDupe(food.name));
    }
    collList.appendChild(item);
  });
}

// ── TAB SWITCHING ─────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "achievements") renderAchievements();
    if (btn.dataset.tab === "upgrades")     renderUpgrades();
  });
});

// ── INIT ──────────────────────────────────
checkDailyBonus();
renderBoxButtons();
renderUpgrades();
renderCollection();
renderAchievements();
updateCpsBadge();