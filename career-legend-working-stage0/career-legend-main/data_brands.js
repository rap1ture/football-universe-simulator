"use strict";
/* ===== BRAND ENDORSEMENTS =====
 * 101 big-name brands. tier 1-5 = how famous you must be.
 * You hold multiple deals at once (slots grow with reputation), alongside your boot sponsor.
 */
const BRANDS = [
// tier 5 — global icons
["McDonald's","🍟",5],["Coca-Cola","🥤",5],["Apple","🍎",5],["Samsung","📱",5],["Google","🔍",5],
["Microsoft","🪟",5],["Amazon","📦",5],["Mercedes-Benz","⭐",5],["Ferrari","🐎",5],["Lamborghini","🐂",5],
["Rolex","⌚",5],["Gucci","👜",5],["Louis Vuitton","💼",5],["Emirates","✈️",5],
// tier 4 — massive
["Pepsi","🥤",4],["Netflix","🎬",4],["Disney+","🏰",4],["Walmart","🛒",4],["Starbucks","☕",4],
["Red Bull","🪽",4],["Gatorade","🧪",4],["Toyota","🚗",4],["BMW","🚘",4],["Audi","🔘",4],
["Tesla","⚡",4],["Porsche","🏎️",4],["PlayStation","🎮",4],["Xbox","🎮",4],["Nintendo","🍄",4],
["EA Sports FC","🕹️",4],["Spotify","🎧",4],["YouTube","▶️",4],["TikTok","🎵",4],["Prada","🕶️",4],
["Armani","🤵",4],["Visa","💳",4],["Mastercard","💳",4],["Qatar Airways","✈️",4],
// tier 3 — household names
["Uber Eats","🛵",3],["DoorDash","🚪",3],["Costco","🏬",3],["Target","🎯",3],["IKEA","🪑",3],
["Burger King","👑",3],["KFC","🍗",3],["Subway","🥪",3],["Domino's","🍕",3],["Pizza Hut","🍕",3],
["Taco Bell","🌮",3],["Chick-fil-A","🐓",3],["Monster Energy","⚡",3],["Powerade","💧",3],["Prime Hydration","💦",3],
["Sprite","🍋",3],["Fanta","🍊",3],["Oreo","🍪",3],["Doritos","🔺",3],["KitKat","🍫",3],
["Snickers","🍫",3],["M&M's","🍬",3],["Nutella","🍞",3],["Honda","🏍️",3],["Ford","🛻",3],
["Volkswagen","🚙",3],["Hyundai","🚗",3],["Twitch","🟣",3],["Beats","🎧",3],["Ray-Ban","🕶️",3],
["PayPal","💸",3],["LEGO","🧱",3],["Airbnb","🏠",3],["Gillette","🪒",3],
// tier 2 — solid deals
["Grubhub","🥡",2],["Deliveroo","🐬",2],["Instacart","🛒",2],["Aldi","🧺",2],["Lidl","🧺",2],
["7-Eleven","🏪",2],["Wendy's","🍔",2],["Chipotle","🌯",2],["Five Guys","🍔",2],["Dunkin'","🍩",2],
["Popeyes","🍗",2],["Krispy Kreme","🍩",2],["Papa John's","🍕",2],["Dr Pepper","🥤",2],
["Mountain Dew","⛰️",2],["Pringles","🥔",2],["Lay's","🥔",2],["Cheetos","🐆",2],["Haribo","🐻",2],
["Kia","🚗",2],["Nissan","🚗",2],["GoPro","📷",2],["Levi's","👖",2],["Zara","👕",2],
["Old Spice","🧴",2],["Colgate","🦷",2],
// tier 1 — starter deals (and the funny ones)
["Little Caesars","🍕",1],["Duolingo","🦉",1],["Ryanair","✈️",1],
]; // 101 total
const BRAND_PAY = { 1: 600, 2: 3000, 3: 12000, 4: 45000, 5: 150000 }; // weekly base by tier

function brandSlots(rep) {
  return rep >= 92 ? 5 : rep >= 80 ? 4 : rep >= 62 ? 3 : rep >= 40 ? 2 : rep >= 15 ? 1 : 0;
}
function brandTierMax(rep) {
  return rep >= 82 ? 5 : rep >= 68 ? 4 : rep >= 50 ? 3 : rep >= 30 ? 2 : 1;
}
function genBrandOffer(state) {
  const p = state.player;
  const tMax = brandTierMax(p.rep);
  const taken = new Set(state.brandDeals.map(d => d.name).concat(state.brandOffers.map(o => o.name)));
  const cands = BRANDS.filter(b => b[2] <= tMax && b[2] >= Math.max(1, tMax - 1) && !taken.has(b[0]));
  if (!cands.length) return null;
  const b = pick(cands);
  const famousMult = 1 + Math.min(1.5, p.followers / 40e6);       // being famous pays
  const weekly = Math.round(BRAND_PAY[b[2]] * rf(0.8, 1.35) * famousMult);
  return { name: b[0], ico: b[1], tier: b[2], weekly, folWk: Math.round(weekly / 3), bonus: weekly * 20, years: ri(2, 3) };
}
function signBrandDeal(state, offerIdx) {
  const o = state.brandOffers[offerIdx];
  if (!o) return;
  if (state.brandDeals.length >= brandSlots(state.player.rep)) return;
  state.brandOffers.splice(offerIdx, 1);
  state.brandDeals.push({ name: o.name, ico: o.ico, tier: o.tier, weekly: o.weekly, folWk: o.folWk, until: state.year + o.years });
  state.money += o.bonus;
  state.player.followers += o.folWk * 4;
  if (state.fans) state.fans.love = clamp(state.fans.love + 1, 0, 100);
  state.brandSignedCount = (state.brandSignedCount || 0) + 1;
  addNews(state, `${o.ico} You're the new face of ${o.name}! ${fmtM(o.bonus)} signing bonus + ${fmtM(o.weekly)}/wk.`, "gold");
  unlock(state, "brand1");
  if (state.brandSignedCount >= 5) unlock(state, "brand5");
  if (state.brandDeals.length >= 4) unlock(state, "brandmax");
}
/* weekly processing: income + new offers; call from advanceWeek */
function brandsWeekly(state) {
  const p = state.player;
  if (!state.brandDeals) return;
  let income = 0;
  for (const d of state.brandDeals) { income += d.weekly; p.followers += d.folWk; }
  if (income) {
    const loveMult = state.fans ? 1 + (state.fans.love - 50) / 250 : 1;
    const agentMult = state.agent === "elite" ? 1.25 : 1;
    state.money += Math.round(income * loveMult * agentMult);
  }
  const slots = brandSlots(p.rep);
  if (state.brandDeals.length < slots && state.brandOffers.length < 3 && chance(10 + p.rep / 7)) {
    const o = genBrandOffer(state);
    if (o) {
      state.brandOffers.push(o);
      addNews(state, `${o.ico} ${o.name} want YOU in their next campaign — ${fmtM(o.weekly)}/wk. Check the Life tab!`, "blu");
    }
  }
}
/* season rollover: expire deals */
function brandsRollover(state) {
  if (!state.brandDeals) return;
  const expired = state.brandDeals.filter(d => d.until <= state.year + 1);
  for (const d of expired) addNews(state, `${d.ico} Your ${d.name} deal has ended. It was a good run.`, "");
  state.brandDeals = state.brandDeals.filter(d => d.until > state.year + 1);
  state.brandOffers = [];
}

ACHIEVEMENTS.push(
  { id: "brand1", ico: "📢", name: "Sellout (Affectionate)", desc: "Sign your first brand endorsement" },
  { id: "brand5", ico: "🪧", name: "Billboard Face", desc: "Sign 5 brand deals in one career" },
  { id: "brandmax", ico: "🌟", name: "Walking Advert", desc: "Hold 4 endorsements at the same time" },
);
