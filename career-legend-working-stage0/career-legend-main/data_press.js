"use strict";
/* ===== PRESS CONFERENCES =====
 * Unique conferences = OPENERS x TOPICS x TWISTS + SPECIALS
 * 24 x 21 x 21 + 45 = 10,629 unique press conferences.
 */
const PRESS_OPENERS = [
"Thanks for coming in.", "Big crowd in the press room tonight.", "Straight to it —",
"The cameras are all on you.", "You're trending worldwide right now.", "Let's talk about tonight.",
"The fans outside are still singing.", "Quite an atmosphere out there.", "The gaffer just left this seat.",
"You look tired — we'll be quick.", "First question from the local paper.", "The international press want a word.",
"Social media is on fire about you.", "The pundits were arguing about you at half time.", "Your teammates mentioned you in their interviews.",
"The opposition manager talked about you too.", "There's a lot of noise around you lately.", "The club's media officer says one question each.",
"You're the story of the day.", "Radio wants a soundbite.", "The kids in the mixed zone were chanting your name.",
"Front page tomorrow, probably.", "The documentary crew is filming this.", "Last press conference of the week —",
]; // 24
const PRESS_TOPICS = [
"How would you rate your performance out there",
"What did the manager say to you before kick-off",
"Do you feel you're getting enough minutes",
"Is this squad good enough to win the title",
"What's your relationship like with the fans",
"Where do you see yourself in three years",
"How do you handle the pressure at your age",
"What do you say to your critics",
"Was that result fair on the balance of play",
"How is your fitness holding up this season",
"Are you happy at this club",
"What's the dressing room mood like right now",
"Who is the toughest opponent you've faced",
"How important is the national team to you",
"What do you do to switch off from football",
"Is there a rivalry brewing with your teammates for places",
"What would winning silverware here mean to you",
"How do you deal with fame this early in your career",
"What part of your game are you working on most",
"Did the occasion get to the team tonight",
"What's your message to the supporters",
]; // 21
const PRESS_TWISTS = [
"— and please, be honest with us.", "— the fans deserve a real answer.", "— in one word, if you can.",
"— because the numbers tell a different story.", "— your agent might disagree.", "— no media training answers, please.",
"— we've heard the rumours.", "— off the record, of course. (It's not.)", "— the whole city is asking.",
"— even your manager dodged that one.", "— and don't smile your way out of it.", "— some say you've changed.",
"— the away fans had their own opinion.", "— you were caught on camera reacting.", "— a yes or no will do.",
"— think carefully before you answer.", "— this is your chance to set it straight.", "— the club might not like the truth.",
"— we'll quote you word for word.", "— last player who answered that got fined.", "— and then we'll let you go home.",
]; // 21
const PRESS_SPECIALS = [
{cond:"hattrick", q:"THREE goals! Where does tonight rank in your career so far?"},
{cond:"hattrick", q:"You took the match ball home — who are you giving it to?"},
{cond:"hattrick", q:"A hat-trick! Did you know you'd score three the moment you woke up?"},
{cond:"red", q:"About that red card... what exactly were you thinking?"},
{cond:"red", q:"Your teammates had to dig in with ten men. Do you owe them an apology?"},
{cond:"red", q:"The referee's report will be brutal. What's your version of events?"},
{cond:"bigwin", q:"A statement victory! Is this team ready to beat anyone in the world?"},
{cond:"bigwin", q:"You just toppled a giant. How loud was that dressing room?"},
{cond:"bigwin", q:"Nights like this — is this why you play football?"},
{cond:"loss", q:"A tough defeat tonight. Where did it go wrong out there?"},
{cond:"loss", q:"The travelling fans stayed to the end despite the loss. A word for them?"},
{cond:"loss", q:"Some players hid tonight. Did you do enough?"},
{cond:"greatgame", q:"That rating will be a 9 in the papers tomorrow. Your best game yet?"},
{cond:"greatgame", q:"You ran the whole match. Are you reaching a new level?"},
{cond:"poorgame", q:"Not your night tonight. What happened out there?"},
{cond:"poorgame", q:"The boo-boys were on your back today. Does that reach you on the pitch?"},
{cond:"derby", q:"You've just played the biggest rivalry in the region. Did you feel the hate?"},
{cond:"goal", q:"Talk us through your goal — what were you thinking in that moment?"},
{cond:"goal", q:"That finish is going viral already. Did you mean it exactly like that?"},
{cond:"assist", q:"That assist was pure vision. Do you see passes other players can't?"},
{cond:"cleansheet", q:"Another clean sheet. How much pride do you take in shutting the door?"},
{cond:"injury", q:"You limped off at the end — how bad is it, honestly?"},
{cond:"young", q:"You're still a teenager playing with adults. Do you ever feel out of place?"},
{cond:"young", q:"Your school friends watched you on TV tonight. What would you tell them?"},
{cond:"star", q:"You're one of the biggest names in world football now. Does the boy who started at 14 still exist?"},
{cond:"star", q:"Legends are compared to you now. Who do YOU compare yourself to?"},
{cond:"window", q:"The transfer window is open and your name is everywhere. Will you be here next month?"},
{cond:"window", q:"A journalist claims you've already agreed terms elsewhere. True or false?"},
{cond:"window", q:"Your price tag keeps climbing. Do you ever feel like a number?"},
{cond:"nt", q:"You wore your country's shirt tonight. What does that badge mean to you?"},
{cond:"nt", q:"The whole nation watched tonight. Do you carry them with you out there?"},
{cond:"captainless", q:"Some say you should wear the armband soon. Would you accept it?"},
{cond:"streak", q:"That's several wins in a row now. Whisper it — is something special happening?"},
{cond:"unbeaten", q:"Still unbeaten in your last five. What's the secret in that dressing room?"},
{cond:"lowmorale", q:"You've looked frustrated lately. Is everything okay behind the scenes?"},
{cond:"highform", q:"You're the form player in the league right now. How long can you keep this up?"},
{cond:"newclub", q:"Early days at your new club. Have the fans won you over yet?"},
{cond:"newclub", q:"Was leaving your old club the right call? No regrets?"},
{cond:"veteran", q:"You've seen everything in this game. What keeps you hungry?"},
{cond:"veteran", q:"Younger players study your clips. What do you tell them?"},
{cond:"ballon", q:"You are a Ballon d'Or winner. Say it out loud. How does it sound?"},
{cond:"trophy", q:"Champagne is soaking the dressing room. Describe the feeling in one sentence."},
{cond:"trophy", q:"You've just won silverware. Who was the first person you thought of?"},
{cond:"milestone", q:"Another career milestone tonight. Do you keep track of your own numbers?"},
{cond:"any", q:"Forget football for a second — are you happy?"},
]; // 45

const PRESS_COMBO_TOTAL = PRESS_OPENERS.length * PRESS_TOPICS.length * PRESS_TWISTS.length; // 10,584
const PRESS_TOTAL = PRESS_COMBO_TOTAL + PRESS_SPECIALS.length; // 10,629

/* answers aligned to each question topic — [humble, confident, spicy] */
const PRESS_TONE_META = [["humble", "🤝"], ["confident", "😤"], ["spicy", "🔥"]];
const PRESS_TOPIC_ANSWERS = [
["I'll watch it back — there's always something to improve.", "Honestly? I was everywhere out there tonight.", "Watch the highlights back and tell me."],
["Just to play my game and trust my teammates.", "He said the team needs me — and he's right.", "What's said inside stays inside."],
["That's the manager's call. I'll be ready when needed.", "Players in my form should start every week.", "Ask the man who writes the team sheet."],
["We take it one match at a time.", "With me playing like this? Absolutely.", "We'll answer that one in May."],
["They give us everything — we owe them the same.", "They love me, I love them. Simple.", "Even the ones who boo will clap eventually."],
["Improving every season, wherever that takes me.", "At the very top, winning everything.", "Somewhere your paper can't afford to cover."],
["My family keeps me grounded, honestly.", "Pressure is a privilege.", "What pressure?"],
["Criticism is part of football. I use it as fuel.", "My numbers already answered them.", "I don't know my critics. They know me."],
["Both teams gave everything out there.", "We deserved more, plain and simple.", "The table doesn't care about 'fair'."],
["Feeling strong — the staff take great care of us.", "Best shape of my life, and it shows.", "I'd run another 90 minutes right now."],
["I'm focused and settled here.", "I'm happy — and ambitious. Both can be true.", "Next question."],
["Tight group. We fight for each other in there.", "That dressing room is full of winners. Trust me.", "What happens in the dressing room stays there."],
["Every opponent at this level is tough.", "Nobody has kept me quiet yet.", "Toughest opponent? Myself, in training."],
["Representing my country is the greatest honour there is.", "I belong on that stage.", "The shirt speaks for itself."],
["Family, quiet dinners, early nights.", "Winning IS how I switch off.", "That's private, respectfully."],
["Competition for places makes everyone better.", "Anyone is welcome to fight me for my shirt.", "There's no rivalry if there's no contest."],
["It would mean everything — mostly for these fans.", "We're building something here. Trophies follow.", "I didn't come here to take photos."],
["I stay normal around the people I trust.", "Fame follows good football. I focus on the football.", "You lot made me famous. Blame yourselves."],
["A bit of everything — you never stop learning.", "Making the strong parts even stronger.", "Even my weaknesses are decent."],
["Maybe for moments — we grow from nights like this.", "Not me. I live for occasions like that.", "The occasion got to the referee, not to us."],
["Thank you for travelling, for singing, for believing.", "Stay with us — the best is still coming.", "See you at the next one. Bring more voice."],
]; // 21 — aligned 1:1 with PRESS_TOPICS
const PRESS_COND_ANSWERS = {
hattrick:["The team created every one of those goals.", "Three tonight. There's more where that came from.", "The match ball is coming home with me. Any objections?"],
red:["No excuses — I let the team down and I'll apologise to the lads.", "That decision was harsh and I'll keep saying it.", "Ask the referee. He had the best view of nothing."],
bigwin:["Huge result, but it's three points like any other.", "We feared nobody tonight and it showed.", "Giants fall when we're on the pitch."],
loss:["We own this defeat together, and we'll respond together.", "One bad night doesn't define this team.", "You can lose a battle. The war is long."],
greatgame:["One of those nights where everything clicked.", "This is the level now. Get used to it.", "Just rate it a 10 and save us both time."],
poorgame:["Below my standards — I'll fix it on the training pitch.", "Even the greats have off nights.", "I've already forgotten that match. You should too."],
derby:["Derbies are for the fans — glad we gave them something to sing about.", "The city knows whose it is now.", "We heard the hate all week. We answered on the grass."],
goal:["Right place, right time — credit the pass, honestly.", "I saw the gap and took it. Pure instinct.", "Frame that one. It'll be worth something someday."],
assist:["The finish made my pass look better than it was.", "I see passes before they exist.", "I do the maths, he collects the autographs."],
cleansheet:["Clean sheets are a team effort, front to back.", "Nothing gets past us at the moment.", "Strikers hate coming here. Good."],
injury:["We'll scan it tomorrow — hopefully it's nothing.", "I've come back stronger before, I'll do it again.", "I'd play on one leg if they let me."],
young:["I'm just grateful the club trusts young players.", "Age is a number. Level is a fact.", "Old enough to hurt teams, apparently."],
star:["The kid from the academy is still in here somewhere.", "I earned every step of this journey.", "Legends? I'm busy writing my own chapter."],
window:["I'm this club's player. That's all I'll say.", "My agent handles the noise. I handle the football.", "If the news is big enough, you'll hear it from me first."],
nt:["Every cap feels like the very first one.", "When the anthem plays, I become more.", "I'd walk to every camp if I had to."],
captainless:["There are proper leaders in that dressing room already.", "If they ask me, I'd wear it with everything I have.", "Armband or not — I lead."],
streak:["Momentum is nice. Humility keeps it.", "Why would we stop now?", "Whisper louder. We like it."],
unbeaten:["The secret is boring: hard work and recovery.", "We simply refuse to lose.", "Find someone who can beat us, then we'll talk."],
lowmorale:["Everyone has heavy weeks. I'm okay — thank you for asking.", "Frustration means I care. Watch the response.", "My private life is not a press topic."],
highform:["Form is borrowed — the work behind it is mine.", "As long as my legs move, this continues.", "That sounds like the league's problem, not mine."],
newclub:["The welcome here has been incredible, honestly.", "Right move, right time. You'll all see why.", "My old club can watch me on TV."],
veteran:["Love of the game — that part never retires.", "Experience beats time. Check my stats.", "The young lads race me in sprints. They lose."],
ballon:["It belongs to my family, my teammates, my coaches.", "It sounds correct. It sounds earned.", "Say it again — slowly. Ballon. d'Or. Winner."],
trophy:["This is why we sacrifice everything — for days like this.", "The first of many. Write that down.", "Soaked in champagne and still sharper than these questions."],
milestone:["The numbers just happen when you love the work.", "Milestones are checkpoints, not finish lines.", "My accountant counts. I score."],
any:["Genuinely, yes. This life is a gift.", "Happiness is winning. So — mostly yes.", "Deep question for a Tuesday. Ask my dog."],
};

/* build a press conference for the given context; avoids repeats via state.pressSeen */
function genPressConf(state, ctx) {
  const conds = [];
  if (ctx.hattrick) conds.push("hattrick");
  if (ctx.red) conds.push("red");
  if (ctx.bigwin) conds.push("bigwin");
  if (ctx.loss) conds.push("loss");
  if (ctx.rating >= 8.5) conds.push("greatgame");
  if (ctx.played && ctx.rating > 0 && ctx.rating < 5.7) conds.push("poorgame");
  if (ctx.goals > 0) conds.push("goal");
  if (ctx.assists > 0) conds.push("assist");
  if (ctx.cleansheet) conds.push("cleansheet");
  if (ctx.injured) conds.push("injury");
  if (ctx.nt) conds.push("nt");
  if (ctx.trophy) conds.push("trophy");
  const p = state.player;
  if (p.age <= 17) conds.push("young");
  if (p.age >= 33) conds.push("veteran");
  if (p.rep >= 75) conds.push("star");
  if (p.form >= 7.6) conds.push("highform");
  if (p.morale <= 35) conds.push("lowmorale");
  if ((state.week >= 24 && state.week <= 27) || state.week <= 3) conds.push("window");
  if (state.career.ballons > 0) conds.push("ballon");
  if (state.career.transfers.length && state.career.seasons.length && state.career.seasons[state.career.seasons.length - 1].club !== state.club.name) conds.push("newclub");
  if ([50, 100, 200, 300, 400, 500].includes(state.career.goals) || [100, 250, 500].includes(state.career.apps)) conds.push("milestone");
  conds.push("any");

  const seen = new Set(state.pressSeen || []);
  // 45% chance to use a matching special
  const specials = PRESS_SPECIALS.map((s, i) => ({ ...s, id: PRESS_COMBO_TOTAL + i }))
    .filter(s => conds.includes(s.cond) && !seen.has(s.id));
  let id, text, triple;
  if (specials.length && chance(45)) {
    const s = pick(specials);
    id = s.id; text = s.q;
    triple = PRESS_COND_ANSWERS[s.cond] || PRESS_COND_ANSWERS.any;
  } else {
    // random unseen combo (10,584 of them; collisions are near-impossible to exhaust)
    for (let tries = 0; tries < 30; tries++) {
      const o = ri(0, PRESS_OPENERS.length - 1), t = ri(0, PRESS_TOPICS.length - 1), w = ri(0, PRESS_TWISTS.length - 1);
      id = (o * PRESS_TOPICS.length + t) * PRESS_TWISTS.length + w;
      if (!seen.has(id)) break;
    }
    const w = id % PRESS_TWISTS.length;
    const t = Math.floor(id / PRESS_TWISTS.length) % PRESS_TOPICS.length;
    const o = Math.floor(id / (PRESS_TWISTS.length * PRESS_TOPICS.length));
    text = `${PRESS_OPENERS[o]} ${PRESS_TOPICS[t]} ${PRESS_TWISTS[w]}`;
    triple = PRESS_TOPIC_ANSWERS[t] || PRESS_COND_ANSWERS.any;
  }
  const answers = triple.map((txt, i) => ({ tone: PRESS_TONE_META[i][0], ico: PRESS_TONE_META[i][1], text: txt }));
  return { id, text, answers, special: id >= PRESS_COMBO_TOTAL };
}

/* apply the outcome of a chosen tone */
function applyPressAnswer(state, pc, toneIdx) {
  const p = state.player;
  const F = state.fans;
  const tone = pc.answers[toneIdx].tone;
  const mult = pc.special ? 1.6 : 1;
  let outcome = "";
  if (tone === "humble") {
    p.trust = clamp(p.trust + 2 * mult, 0, 100);
    p.morale = clamp(p.morale + 1, 0, 100);
    F.love = clamp(F.love + 1.2 * mult, 0, 100);
    outcome = "🤝 Measured and classy. The manager and the fans approve.";
  } else if (tone === "confident") {
    p.rep = clamp(p.rep + 0.8 * mult, 0, 100);
    p.followers += Math.round((600 + p.rep * 90) * mult);
    if (chance(18)) {
      F.love = clamp(F.love - 2, 0, 100);
      p.trust = clamp(p.trust - 1.5, 0, 100);
      outcome = "😬 A few pundits called it arrogant. The clip is everywhere.";
    } else {
      F.love = clamp(F.love + 1.5 * mult, 0, 100);
      outcome = "😤 Confidence looks good on you. The fans are eating it up.";
    }
  } else {
    p.followers += Math.round((2000 + p.rep * 220) * mult);
    if (chance(55)) {
      F.love = clamp(F.love + 3 * mult, 0, 100);
      p.rep = clamp(p.rep + 1 * mult, 0, 100);
      outcome = "🔥 ICONIC. The quote is a meme within the hour — fans have a new chant.";
    } else {
      F.love = clamp(F.love - 3 * mult, 0, 100);
      p.trust = clamp(p.trust - 2, 0, 100);
      p.rep = clamp(p.rep - 0.5, 0, 100);
      outcome = "🧯 Yikes. The club's media team is doing damage control.";
    }
  }
  if (!state.pressSeen) state.pressSeen = [];
  state.pressSeen.push(pc.id);
  if (state.pressSeen.length > 4000) state.pressSeen.shift();
  state.pressCount = (state.pressCount || 0) + 1;
  return outcome;
}

/* ===== SOCIAL POSTS (fans system) ===== */
const SOCIAL_POSTS = [
{id:"skills", ico:"🎬", name:"Skills clip", desc:"Big follower gains", fx:{followers:2.2, love:0.8}},
{id:"grind", ico:"🏋️", name:"Training grind", desc:"Fans respect the work", fx:{followers:0.8, love:1.6, trust:1.5}},
{id:"family", ico:"👨‍👩‍👦", name:"Family day", desc:"Wholesome — fans love it", fx:{followers:0.6, love:2.4, morale:2}},
{id:"meme", ico:"😂", name:"Spicy meme", desc:"Huge reach, small risk", fx:{followers:3.5, love:-0.5, risky:true}},
{id:"thanks", ico:"🙏", name:"Thank the fans", desc:"Maximum fan love", fx:{followers:0.4, love:3.2}},
];
function doSocialPost(state, postId) {
  const post = SOCIAL_POSTS.find(s => s.id === postId);
  if (!post) return null;
  const p = state.player, F = state.fans;
  const reach = 400 + p.rep * 160 + Math.sqrt(p.followers) * 6;
  let gained = Math.round(reach * post.fx.followers * rf(0.7, 1.4));
  let love = (post.fx.love || 0) * rf(0.8, 1.3);
  let note;
  if (post.fx.risky && chance(25)) {
    love = -3; gained = Math.round(gained * 0.4);
    note = "😅 The meme aged badly within hours. Ratio'd.";
  } else {
    note = `${post.ico} Post is doing numbers — +${fmtNum(gained)} followers.`;
  }
  p.followers += gained;
  F.love = clamp(F.love + love, 0, 100);
  if (post.fx.trust) p.trust = clamp(p.trust + post.fx.trust, 0, 100);
  if (post.fx.morale) p.morale = clamp(p.morale + post.fx.morale, 0, 100);
  F.posts = (F.posts || 0) + 1;
  F.lastPostWk = state.year * 100 + state.week;
  return note;
}
function fanLoveWord(v) {
  return v >= 90 ? "🐐 Worshipped" : v >= 75 ? "❤️ Adored" : v >= 60 ? "😍 Loved" : v >= 45 ? "🙂 Liked" : v >= 30 ? "😐 Tolerated" : v >= 15 ? "😒 Doubted" : "🍅 Booed";
}
