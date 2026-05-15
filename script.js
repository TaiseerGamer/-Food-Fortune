const FOODS = [
  // COMMON
  { name: "White Rice",      icon: "🍚", rarity: "common",    desc: "A humble staple. Not exciting, but reliable." },
  { name: "Plain Bread",     icon: "🍞", rarity: "common",    desc: "Just bread. Basic. You can do this." },
  { name: "Boiled Egg",      icon: "🥚", rarity: "common",    desc: "Protein, that's about it." },
  { name: "Carrot Sticks",   icon: "🥕", rarity: "common",    desc: "Crunchy and orange. Very common." },
  { name: "Crackers",        icon: "🫙", rarity: "common",    desc: "The snack of mild disappointment." },
  // UNCOMMON
  { name: "Ramen Bowl",      icon: "🍜", rarity: "uncommon",  desc: "Steaming noodles with a rich broth!" },
  { name: "Grilled Corn",    icon: "🌽", rarity: "uncommon",  desc: "Charred sweetness from the grill." },
  { name: "Avocado Toast",   icon: "🥑", rarity: "uncommon",  desc: "A brunch classic. Somewhat trendy." },
  { name: "Taco",            icon: "🌮", rarity: "uncommon",  desc: "Crunchy shell, tasty fillings." },
  { name: "Pancakes",        icon: "🥞", rarity: "uncommon",  desc: "Fluffy stacked goodness." },
  // RARE
  { name: "Sushi Platter",   icon: "🍣", rarity: "rare",      desc: "Fresh nigiri and rolls, beautifully arranged." },
  { name: "Beef Steak",      icon: "🥩", rarity: "rare",      desc: "A perfectly seared cut. Medium-rare, of course." },
  { name: "Lobster Bisque",  icon: "🦞", rarity: "rare",      desc: "Rich, creamy, and deeply indulgent." },
  { name: "Truffle Pasta",   icon: "🍝", rarity: "rare",      desc: "Earthy truffles tossed with silky pasta." },
  { name: "Wagyu Burger",    icon: "🍔", rarity: "rare",      desc: "Premium beef, perfectly seasoned." },
  // EPIC
  { name: "Dragon Ramen",    icon: "🐉", rarity: "epic",      desc: "Legendary broth simmered for 72 hours." },
  { name: "Golden Cake",     icon: "🎂", rarity: "epic",      desc: "Encrusted with edible gold leaf." },
  { name: "Kobe Teppanyaki", icon: "🔥", rarity: "epic",      desc: "Finest Kobe beef, teppanyaki style." },
  { name: "Black Truffle",   icon: "🍄", rarity: "epic",      desc: "Rare fungal treasure from Périgord." },
  // LEGENDARY
  { name: "Ambrosia Bowl",   icon: "🌟", rarity: "legendary", desc: "Food of the gods. Literally divine." },
  { name: "Phoenix Wings",   icon: "🦅", rarity: "legendary", desc: "Spicy wings that burst into flame. Handle with care." },
  { name: "Crystal Sashimi", icon: "💎", rarity: "legendary", desc: "Perfectly sliced, jewel-like tuna." },
  // MYTHIC
  { name: "Celestial Ramen", icon: "✨", rarity: "mythic",    desc: "A bowl from another dimension. Indescribable taste." },
  { name: "Star Cake",       icon: "🌠", rarity: "mythic",    desc: "Baked in a supernova. Impossibly rare." },
];

const RARITIES = {
  common:    { label: "COMMON",    weight: 60 },
  uncommon:  { label: "UNCOMMON",  weight: 25 },
  rare:      { label: "RARE",      weight: 10 },
  epic:      { label: "EPIC",      weight: 4  },
  legendary: { label: "LEGENDARY", weight: 0.8 },
  mythic:    { label: "MYTHIC",    weight: 0.2 },
};

const BOXES = [
  {
    name: "Snack Box",
    icon: "📦",
    price: 10,
    desc: "Basic luck. Common finds likely.",
    btnClass: "b0",
    weights: { common: 60, uncommon: 28, rare: 9, epic: 2.5, legendary: 0.4, mythic: 0.1 }
  },
  {
    name: "Gourmet Box",
    icon: "🎁",
    price: 50,
    desc: "Better odds! Rare foods await.",
    btnClass: "b1",
    weights: { common: 30, uncommon: 35, rare: 22, epic: 9, legendary: 3, mythic: 1 }
  },
  {
    name: "Legend Box",
    icon: "👑",
    price: 200,
    desc: "Extreme luck. Mythic possible!",
    btnClass: "b2",
    weights: { common: 10, uncommon: 20, rare: 30, epic: 22, legendary: 12, mythic: 6 }
  },
];

let money = 0;
let totalClicks = 0;
let totalBoxes = 0;
let collection = {};

const moneyEl    = document.getElementById("money-display");
const clicksEl   = document.getElementById("stat-clicks");
const boxesEl    = document.getElementById("stat-boxes");
const foodsEl    = document.getElementById("stat-foods");
const collList   = document.getElementById("collection-list");
const coinBtn    = document.getElementById("coin-btn");
const overlay    = document.getElementById("modal-overlay");
const modalIcon  = document.getElementById("modal-icon");
const modalRar   = document.getElementById("modal-rarity");
const modalName  = document.getElementById("modal-name");
const modalDesc  = document.getElementById("modal-desc");
const modalClose = document.getElementById("modal-close");

function updateMoney() {
  moneyEl.textContent = money.toLocaleString();
}

function updateStats() {
  clicksEl.textContent = totalClicks.toLocaleString();
  boxesEl.textContent  = totalBoxes.toLocaleString();
  foodsEl.textContent  = Object.values(collection).reduce((s, v) => s + v.count, 0).toLocaleString();
}

function spawnFloater(x, y, amount) {
  const el = document.createElement("div");
  el.className = "floater";
  el.textContent = `+${amount}`;
  el.style.left = (x - 20) + "px";
  el.style.top  = (y - 30) + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

coinBtn.addEventListener("click", (e) => {
  money++;
  totalClicks++;
  updateMoney();
  updateStats();
  coinBtn.classList.add("popping");
  setTimeout(() => coinBtn.classList.remove("popping"), 100);
  spawnFloater(e.clientX, e.clientY, 1);
  renderBoxButtons();
});

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

function openBox(boxIdx) {
  const box = BOXES[boxIdx];
  if (money < box.price) return;
  money -= box.price;
  totalBoxes++;
  updateMoney();
  updateStats();
  renderBoxButtons();

  const food = pickFood(box);
  if (!collection[food.name]) {
    collection[food.name] = { food, count: 0 };
  }
  collection[food.name].count++;
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
}

modalClose.addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("show");
});

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

function renderCollection() {
  collList.innerHTML = "";
  const sorted = Object.values(collection).sort((a, b) => {
    const order = ["mythic", "legendary", "epic", "rare", "uncommon", "common"];
    return order.indexOf(a.food.rarity) - order.indexOf(b.food.rarity);
  });
  if (sorted.length === 0) {
    collList.innerHTML = '<p class="empty-msg">Open boxes to discover foods!</p>';
    return;
  }
  sorted.forEach(({ food, count }) => {
    const item = document.createElement("div");
    item.className = "coll-item";
    item.innerHTML = `
      <div class="rarity-dot dot-${food.rarity}"></div>
      <span class="coll-icon">${food.icon}</span>
      <span class="coll-name rarity-color-${food.rarity}">${food.name}</span>
      <span class="coll-count">×${count}</span>
    `;
    collList.appendChild(item);
  });
}

renderBoxButtons();
renderCollection();