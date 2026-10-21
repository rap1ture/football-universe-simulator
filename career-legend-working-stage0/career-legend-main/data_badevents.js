"use strict";
/* ===== BAD LIFE EVENTS =====
 * 100 events, 1-2 fire per season. sev 1 = bad, sev 2 = really bad, sev 3 = devastating.
 * A bad event starts a GRIEF period: morale crashes and you play worse until it passes.
 * money: fraction of your bank lost, when relevant.
 */
const BAD_EVENTS = [
// ——— sev 3 · devastating (15)
{t:"Your grandmother — the one who lit a candle before every match — has passed away.", sev:3, ico:"🕯️"},
{t:"A close relative has passed away suddenly. Football feels very small today.", sev:3, ico:"🖤"},
{t:"Your brother has been sentenced to life in prison. The family is shattered.", sev:3, ico:"⛓️"},
{t:"Your childhood best friend was in a terrible accident and is in a coma.", sev:3, ico:"🏥"},
{t:"Your father suffered a heart attack. He survived — but nothing feels safe anymore.", sev:3, ico:"💔"},
{t:"Your mother has been diagnosed with a serious illness. Treatment starts immediately.", sev:3, ico:"🎗️"},
{t:"The coach who discovered you at age 9 — your second father — has died.", sev:3, ico:"🪦"},
{t:"A fire tore through your family home. Everyone is safe. Everything else is gone.", sev:3, ico:"🔥", money:0.10},
{t:"Your agent of many years has been stealing from you. The betrayal cuts deeper than the money.", sev:3, ico:"🗡️", money:0.22},
{t:"A flood devastated your hometown. Streets you grew up on are underwater.", sev:3, ico:"🌊"},
{t:"Your baby nephew is seriously ill. The whole family lives at the hospital now.", sev:3, ico:"👶"},
{t:"A stalker breached your home while your family slept. Everyone is safe, no one is okay.", sev:3, ico:"🚨"},
{t:"Your former youth teammate — your roommate in the academy — passed away far too young.", sev:3, ico:"🕊️"},
{t:"Your parents are divorcing after 30 years, and it is not amicable. You're caught in the middle.", sev:3, ico:"💥"},
{t:"A childhood friend took his own life. You keep rereading his last message to you.", sev:3, ico:"🖤"},
// ——— sev 2 · really bad (35)
{t:"Your dog — your shadow since you were 12 — has died.", sev:2, ico:"🐕"},
{t:"Your cat passed away in her sleep. The house is unbearably quiet.", sev:2, ico:"🐈"},
{t:"Your long-term partner ended things. The tabloids somehow already know.", sev:2, ico:"💔"},
{t:"Burglars emptied your house while you were at an away match.", sev:2, ico:"🥷", money:0.06},
{t:"Your best friend from the academy got released and is quitting football. He won't answer calls.", sev:2, ico:"📵"},
{t:"A teammate suffered a career-ending injury right in front of you in training.", sev:2, ico:"🩼"},
{t:"Your grandfather is in hospital. Doctors say prepare for a long fight.", sev:2, ico:"🏥"},
{t:"Someone leaked your private family photos. Lawyers are on it. The damage is done.", sev:2, ico:"📸"},
{t:"Your sister's husband walked out on her and the kids. She's moving in with you.", sev:2, ico:"🧳"},
{t:"A crash on the motorway — you walked away, your car didn't. You keep replaying it.", sev:2, ico:"🚗"},
{t:"Your childhood club went bankrupt and folded. 94 years of history, gone.", sev:2, ico:"⚰️"},
{t:"An investment your cousin swore by turned out to be a scam.", sev:2, ico:"📉", money:0.12},
{t:"Your parents' shop was vandalized by rival fans because of YOUR transfer.", sev:2, ico:"🧱"},
{t:"Death threats arrived after your missed penalty. Police are involved.", sev:2, ico:"✉️"},
{t:"Your old mentor has dementia. Today he didn't remember your name.", sev:2, ico:"🥀"},
{t:"Your parrot of 9 years flew away. The empty cage is worse than you expected.", sev:2, ico:"🦜"},
{t:"A fake charity used your name and face. Donors lost money. Trust is broken.", sev:2, ico:"🎭"},
{t:"Your uncle gambled away the family savings — including money you sent home.", sev:2, ico:"🎰", money:0.05},
{t:"Your closest friend in the squad just got sold overseas without warning.", sev:2, ico:"✈️"},
{t:"You found out your entourage laughs at you behind your back. All of them.", sev:2, ico:"🎪"},
{t:"Your childhood home was demolished for a car park. You watched the video twice.", sev:2, ico:"🏚️"},
{t:"A journalist fabricated quotes that turned your hometown against you.", sev:2, ico:"🗞️"},
{t:"Your horse — okay, you bought a horse last year — is seriously ill.", sev:2, ico:"🐎"},
{t:"Identity thieves opened accounts in your name across three countries.", sev:2, ico:"🪪", money:0.04},
{t:"Your little brother is being brutally bullied at school because of your last performance.", sev:2, ico:"🎒"},
{t:"The family dog needs surgery with a 50/50 chance. You paid instantly. Now you wait.", sev:2, ico:"🩺", money:0.01},
{t:"Your ex is writing a tell-all book. The publisher sent you a 'courtesy' preview.", sev:2, ico:"📖"},
{t:"Your cousin crashed the supercar you lent him. He's fine. You said 'as long as you're okay' and meant it. Mostly.", sev:2, ico:"🏎️", money:0.03},
{t:"A lifelong fan who wrote you letters every month has passed away. His family sent you his scrapbook.", sev:2, ico:"📔"},
{t:"Mould destroyed your trophy room. Some things can be re-bought. The match balls can't.", sev:2, ico:"🏆"},
{t:"Your nutritionist sold your private health data to a betting company.", sev:2, ico:"🔓"},
{t:"An old teammate you idolized got banned for match-fixing. You gave the quote: 'no comment.'", sev:2, ico:"⚖️"},
{t:"Your goldfish— no, actually, all six goldfish. The heater malfunctioned. You named every one of them.", sev:2, ico:"🐠"},
{t:"Your hometown statue fund was embezzled by the organizer. The half-built statue has no face.", sev:2, ico:"🗿"},
{t:"Turbulence so bad on the team flight that the physio started praying. You've booked a therapist.", sev:2, ico:"🛬"},
// ——— sev 1 · bad (50)
{t:"Your phone was snatched — with two years of unpacked voicemails from your grandma on it.", sev:1, ico:"📱"},
{t:"Rival fans keyed your car in the training ground car park.", sev:1, ico:"🔑"},
{t:"Food poisoning from the team hotel buffet. The fish was a mistake.", sev:1, ico:"🤢"},
{t:"The airline lost the bag with your lucky boots inside.", sev:1, ico:"🧳"},
{t:"Your social media got hacked and posted crypto scams for six hours.", sev:1, ico:"👾"},
{t:"A deepfake of you advertising teeth whitener is everywhere.", sev:1, ico:"🦷"},
{t:"Your landlord sold the flat. You have 30 days and 4,000 pairs of trainers.", sev:1, ico:"📦"},
{t:"A 'friend' borrowed money and changed his number.", sev:1, ico:"👻", money:0.01},
{t:"The barber experimented. The match is televised. There is no hat rule exemption.", sev:1, ico:"💈"},
{t:"Your ex sold a 'my life with a footballer' story. It's mostly lies and one true embarrassing bit.", sev:1, ico:"🗑️"},
{t:"Emergency wisdom tooth surgery. The swelling has its own fan account.", sev:1, ico:"😬"},
{t:"Someone stole the bike you've had since the academy days.", sev:1, ico:"🚲"},
{t:"A neighbour dispute over your dog escalated to lawyers. Over ONE flowerbed.", sev:1, ico:"🌷"},
{t:"A burst pipe soaked your signed-shirt collection.", sev:1, ico:"💧"},
{t:"The pitch where you learned the game is now a supermarket. They kept ONE goalpost as 'art'.", sev:1, ico:"🛒"},
{t:"A parody account of you is funnier than you. It hurts more than it should.", sev:1, ico:"🤡"},
{t:"You invested in your cousin's restaurant. The health inspector's report went viral.", sev:1, ico:"🍽️", money:0.02},
{t:"Passport stolen the night before international duty. Emergency documents. Emergency stress.", sev:1, ico:"🛂"},
{t:"Grandma had a fall. She's fine — she's furious at the fuss — but your heart stopped for an hour.", sev:1, ico:"🤕"},
{t:"The dog went missing for two days. Found at a butcher's shop, living like a king. Traitor.", sev:1, ico:"🦴"},
{t:"Your sister failed her final exams and cried on the phone for an hour.", sev:1, ico:"📚"},
{t:"Your best friend is emigrating. The group chat will never be the same.", sev:1, ico:"🌏"},
{t:"A teammate spread a rumour that you big-time the kit man. You do NOT.", sev:1, ico:"🗣️"},
{t:"The scout who found you retired without saying goodbye.", sev:1, ico:"👋"},
{t:"You got locked out of your gaming account. Eleven years. Every skin. Gone pending 'review'.", sev:1, ico:"🎮"},
{t:"Your custom boots arrived in the wrong size for the third time.", sev:1, ico:"👟"},
{t:"A pigeon situation has developed on your balcony. The pigeons are winning.", sev:1, ico:"🐦"},
{t:"You bought your mum a house. She refuses to leave the old one. The new one hosts her plants.", sev:1, ico:"🪴"},
{t:"Fined by the club for being late — the gate guard didn't believe it was you.", sev:1, ico:"⏰", money:0.005},
{t:"Your wax statue looks like a different, much older man.", sev:1, ico:"🗽"},
{t:"The council rejected your plan for free youth pitches. 'Parking concerns.'", sev:1, ico:"🚧"},
{t:"You were photographed crying at an animated film premiere. It was a very sad film.", sev:1, ico:"🎬"},
{t:"Your childhood idol was rude to you at an awards dinner.", sev:1, ico:"🥶"},
{t:"The club shop misspelled your name on an entire shirt run. It's selling MORE now.", sev:1, ico:"👕"},
{t:"You sat in traffic for 4 hours and missed your own surprise party.", sev:1, ico:"🚦"},
{t:"A seagull stole food from your hand in front of 200 fans filming.", sev:1, ico:"🐦‍⬛"},
{t:"Your tattoo artist misspelled 'Believe'. It says 'Beleive'. It's very large.", sev:1, ico:"🪡"},
{t:"Your podcast-mad teammate released your private hot takes as 'banter'.", sev:1, ico:"🎙️"},
{t:"The hotel fire alarm went off at 3am before the biggest match of the season.", sev:1, ico:"🔔"},
{t:"You loaned your spare car to the youth team's top scorer. It came back smelling of energy drink and regret.", sev:1, ico:"🥤"},
{t:"A famous DJ dedicated a diss track to your last performance. It's catchy. That's the problem.", sev:1, ico:"🎧"},
{t:"Your fantasy league rivals — your own family — benched you this week.", sev:1, ico:"📊"},
{t:"The airline sat you next to a fan of your fiercest rivals. For eleven hours.", sev:1, ico:"💺"},
{t:"Your smart home locked you out and played opera at full volume until 2am.", sev:1, ico:"🏠"},
{t:"You waved at someone who wasn't waving at you. The clip has 4 million views.", sev:1, ico:"🫠"},
{t:"Laundry disaster: every piece of white kit is now a delicate pink.", sev:1, ico:"🧺"},
{t:"Your mum found your burner account. The one where you defend yourself. She's disappointed.", sev:1, ico:"🕵️"},
{t:"A cow escaped onto the training pitch and outran two full-backs. The memes write themselves.", sev:1, ico:"🐄"},
{t:"Your favourite boots were discontinued. You bought the last 14 pairs on earth.", sev:1, ico:"📉", money:0.005},
{t:"The stadium DJ played your goal song... when the OTHER team scored. Twice.", sev:1, ico:"🔊"},
]; // 100 total
const BAD_TOTAL = BAD_EVENTS.length;

/* responses shown for every bad event */
const BAD_RESPONSES = [
{t:"Take time with the people you love", d:"Shorter grief, but it costs you energy now"},
{t:"Pour everything into football", d:"Grief runs its course, training keeps you sane"},
{t:"Tell no one. Carry it alone.", d:"Risky — it might fester"},
];

function fireBadEvent(state) {
  const seen = new Set(state.badSeen || []);
  const pool = BAD_EVENTS.map((e, i) => ({ ...e, id: i })).filter(e => !seen.has(e.id));
  const ev = pool.length ? pick(pool) : { ...pick(BAD_EVENTS), id: -1 };
  if (ev.id >= 0) { state.badSeen = state.badSeen || []; state.badSeen.push(ev.id); }
  return ev;
}

function applyBadEvent(state, ev, choiceIdx) {
  const p = state.player;
  const moraleHit = ev.sev === 3 ? ri(28, 38) : ev.sev === 2 ? ri(16, 22) : ri(8, 12);
  let weeks = ev.sev === 3 ? ri(7, 10) : ev.sev === 2 ? ri(4, 6) : ri(2, 3);
  let note;
  if (choiceIdx === 0) { weeks = Math.max(1, weeks - 2); p.energy = clamp(p.energy - 10, 0, 100); note = "You go home. It helps more than words can."; }
  else if (choiceIdx === 1) { note = "You train in silence. The ball, at least, asks no questions."; }
  else { if (chance(50)) { weeks += 2; note = "You carry it alone. It gets heavier."; } else { note = "You carry it alone. Somehow, you manage."; } }
  p.morale = clamp(p.morale - moraleHit, 0, 100);
  if (ev.money) state.money = Math.max(0, Math.round(state.money * (1 - ev.money)));
  if (state.fans) state.fans.love = clamp(state.fans.love + 1, 0, 100); // fans send support
  state.grief = { weeks, sev: ev.sev, label: ev.ico + " " + (ev.sev === 3 ? "Devastated" : ev.sev === 2 ? "Grieving" : "Shaken") };
  state.badCount = (state.badCount || 0) + 1;
  if (state.badCount >= 10) unlock(state, "resilient");
  addNews(state, `${ev.ico} ${ev.t}`, "red");
  return note;
}

/* weekly tick — call at top of advanceWeek */
function griefWeekly(state) {
  const g = state.grief;
  if (!g || g.weeks <= 0) return;
  g.weeks--;
  state.player.morale = clamp(state.player.morale - 0.5, 0, 100);
  if (g.weeks <= 0) {
    state.grief = null;
    state.player.morale = clamp(state.player.morale + 6, 0, 100);
    addNews(state, "🌤️ The weight lifts a little. You laughed at training today — really laughed — for the first time in a while.", "grn");
  }
}

ACHIEVEMENTS.push(
  { id: "resilient", ico: "🛡️", name: "Through the Storm", desc: "Endure 10 bad life events and keep going" },
);
