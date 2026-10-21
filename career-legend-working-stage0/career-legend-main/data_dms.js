"use strict";
/* ===== INSTAGRAM DM SYSTEM =====
 * 8 sender types × 10 intros × 25 bodies × 10 closers = 20,000 unique DMs, 3 replies each.
 * Fan messages: 25 templates × 20 compliments × 20 sign-offs = 10,000 unique (read-only, bottom of inbox).
 */
const DM_CATS = [
{id:"teammate", label:"Teammate", ico:"🧑‍🤝‍🧑",
 intros:["Yo!","Bro.","Oi oi.","Hermano!","Big man!","Pssst.","Real talk —","Listen,","Don't tell anyone but","After training today —"],
 bodies:[
 "the gaffer was watching YOU in the rondo, I swear",
 "some of the lads think you big-time'd them in the canteen",
 "we're doing a team dinner Thursday, you in?",
 "I need your FIFA rating settled — 1v1 tonight?",
 "the physio says my hamstring's fine but it does NOT feel fine",
 "the new signing keeps parking in your spot",
 "coach wants us doing extra finishing drills tomorrow at 8",
 "did you see what the fans made about us? we're a meme now",
 "the kit man is FUMING someone swapped his labels",
 "I told the press you're the hardest worker here, don't make me a liar",
 "keeper's been moaning you never track back, just a heads up",
 "we should room together for the away trip",
 "my cousin wants your shirt after Saturday, that cool?",
 "you got megged twice today and I have the video",
 "the captain wants a players-only meeting before the derby",
 "I'm starting a podcast and you're the first guest, no arguments",
 "someone leaked the training bibs colours to the fans, chaos",
 "if you score Saturday do the handshake celebration, promise?",
 "gaffer's naming the team early — heard your name in it",
 "I can't feel my legs after that beep test",
 "the youth team lads keep asking about you, you're their idol",
 "we're planning a surprise for the manager's birthday, act normal",
 "that nutmeg you did is all over my feed",
 "bring the good boots tomorrow, scouts are coming apparently",
 "the chef asked if you want the pasta or the pasta"],
 closers:["Don't leave me on read.","You know what to do.","Say less.","This stays between us.","Reply fast.","See you at training.","No cap.","Trust me.","😤😤😤","Anyway, big game soon."]},
{id:"agent", label:"Your Agent", ico:"💼",
 intros:["Kid,","Champ,","My star client!","Quick one —","Business update:","Read this twice —","Before you hear it elsewhere:","Numbers talk,","Confidential:","Got off a call —"],
 bodies:[
 "two clubs asked about you this morning, keeping them warm",
 "your market value moved again, in the right direction",
 "I floated your name to a bigger league, just testing waters",
 "we should talk contract before the window opens",
 "a brand wants a meeting, could be six figures",
 "the club is 'very happy' with you, which means they fear losing you",
 "don't post ANYTHING spicy this week, negotiations are delicate",
 "I got you an extra appearance fee clause, you're welcome",
 "a journalist is sniffing around for a story, say nothing",
 "your buyout clause is looking cheap, that's good AND bad",
 "keep scoring and I'll get you a release clause to dream about",
 "the manager told the board you're untouchable, leverage baby",
 "there's loan interest from a club where you'd actually PLAY",
 "I need your answer on the sponsorship by Friday",
 "the wage they pay you is honestly becoming disrespectful",
 "another agency tried to poach you, I handled it",
 "your image rights need sorting before you blow up any bigger",
 "a foreign club called at 3am MY TIME, they're desperate",
 "the tax people asked a question, I made it go away, legally",
 "if we win anything this season your bonus triggers, focus up",
 "I'm hearing your rival's agent talk trash, want me to respond?",
 "national team staff requested your fitness data, big sign",
 "your next deal makes us both rich, stay humble til then",
 "stop liking transfer rumour posts, the club NOTICED",
 "I put a clause in for a private box for your family"],
 closers:["Trust the process.","We eat soon.","Silence is money.","Call me.","Delete this after reading.","Business as usual.","Your move.","I only take 6%. Bargain.","📈📈📈","Sleep well, earn well."]},
{id:"manager", label:"The Gaffer", ico:"📋",
 intros:["Son,","Listen carefully.","No drama, but","Straight talk:","After the video session —","I don't text often, so read this:","Between us,","One thing:","About Saturday —","I noticed something."],
 bodies:[
 "your pressing numbers are the best in the squad, keep it up",
 "I need more from you in the final third, simple as that",
 "you're starting this weekend, tell no one",
 "I'm resting you, and no, it's not a punishment",
 "the way you tracked back last match won you big credit",
 "your body language when subbed off — fix it",
 "I want you taking the set pieces from now on",
 "there's a tactical tweak with your name on it, come early tomorrow",
 "the chairman asked about you, I said good things, mostly",
 "you train like it's a testimonial some days, that ends now",
 "senior players say you're coachable, that's rarer than talent",
 "I've seen a hundred like you quit at the first bench spell, don't",
 "your positioning on corners cost us, we fix it Monday",
 "if the press ask about your future, smile and say nothing",
 "I defended you in the board meeting today, don't waste it",
 "the captaincy conversation isn't crazy long-term, keep growing",
 "eat better, sleep more, the data doesn't lie",
 "you're one booking from suspension, be smart out there",
 "that thing you tried in the 89th — brave, I liked it",
 "I know the bench hurts, champions respond, tourists sulk",
 "your heat map looks like abstract art, let's talk positioning",
 "next match your job is their number 10, everywhere he goes",
 "the fans sing your name, make sure they never stop",
 "I was harsh on you today, it's because the ceiling is high",
 "young players get one reputation, guard yours"],
 closers:["That's all.","See me tomorrow.","Delete this.","We go again.","Say nothing.","Understood?","Rest well.","The badge comes first.","— Gaffer","Early night tonight."]},
{id:"family", label:"Family", ico:"🏡",
 intros:["Sweetheart,","Hey kiddo,","My champion!","Just checking in —","Grandma says hi.","Don't be mad but","Quick message —","We watched the game!","Miss you.","Before you sleep —"],
 bodies:[
 "we're all so proud of you, never forget where you started",
 "your old bedroom is exactly how you left it",
 "the neighbours keep asking for tickets, I said maybe",
 "are you EATING vegetables or just footballer food",
 "dad recorded the whole match and watches your touches in slow motion",
 "your little cousin wore your shirt to school again",
 "we saw the commentator say your name wrong and dad wrote a complaint",
 "don't read the comments, those people don't know you",
 "the whole street watched your match at our house",
 "grandma lit a candle before your game, she says it works",
 "send a photo of your apartment, I know it's a mess",
 "your old coach from under-9s says hello and 'told you so'",
 "we don't care about the result, are you happy though?",
 "your sister framed the newspaper page with your photo",
 "the dog sits by the TV when you play, I'm not joking",
 "please call your grandmother, it's been two weeks",
 "we put your first boots in a glass box, dad's idea",
 "if the manager shouts at you remember he shouted at legends too",
 "your mum cried at your interview, happy tears",
 "did you thank the bus driver like we taught you",
 "home is always here whenever football gets heavy",
 "we're saving every article, the album is getting thick",
 "don't buy us anything fancy, just come visit",
 "your dad tells everyone at work tactical analysis now, it's bad",
 "whatever happens Saturday, soup is in the freezer"],
 closers:["Love you endlessly.","Call us!","Proud is an understatement.","Eat well!","Grandma insists you reply.","Hugs from everyone.","We're always watching. Lovingly.","❤️❤️❤️","Home soon?","Sleep early!"]},
{id:"journalist", label:"Journalist", ico:"📰",
 intros:["Hi, hope it's okay to reach out —","Off the record:","Quick quote?","Writing a piece —","You didn't hear this from me,","Deadline in an hour —","My editor insists:","Exclusive opportunity:","No pressure, but","Following up —"],
 bodies:[
 "we're running a feature on your rise, want input or shall we guess?",
 "a source says the dressing room loves you, care to confirm?",
 "your name is in transfer talk again, any comment at all?",
 "I'm told the manager fought to keep you, that true?",
 "we're voting you into our team of the week, any words?",
 "there's a stat showing you're top of your league for sprints",
 "rumour is the national team scouts watched you Saturday",
 "I want to write the REAL story before the tabloids invent one",
 "your childhood coach gave us a lovely quote about you",
 "fans voted you their favourite player, reaction?",
 "someone leaked training ground footage of your free kicks",
 "the piece runs tomorrow, last chance to add your voice",
 "we know which boots you wear before the brand announces it",
 "your press conference answer went viral, follow-up interview?",
 "a rival fan account is spreading nonsense, want to set it straight?",
 "I'm doing a documentary pitch about academy kids like you",
 "the numbers say you're underrated, let me prove it in print",
 "care to confirm the dressing room playlist debate?",
 "we heard about your charity visit, mind if we cover it?",
 "one honest quote from you beats ten from your agent",
 "your old teammates keep telling us stories, all good ones",
 "the headline writes itself if you win this weekend",
 "readers ask about your pre-match routine, share it?",
 "I defended you on the podcast, just saying",
 "any message for the kid who holds your poster at every game?"],
 closers:["Strictly your call.","Deadline looms.","Think about it.","We print Friday.","Your words, verbatim, promise.","No tricks.","The public loves you.","🗞️","Editors, am I right?","Appreciate you."]},
{id:"rival", label:"Rival Player", ico:"😏",
 intros:["Heard of you.","So you're the hype.","Respect, but","Saw your clips.","Before we meet on the pitch —","People compare us.","Not friends, but","One pro to another:","They rate you, huh.","After last match —"],
 bodies:[
 "the pundits say you're faster than me, we'll test that",
 "nice goal last week, my grandma defends better though",
 "when we play, bring your best, I don't want excuses after",
 "you win the duel, I'll say your name in the interview",
 "that skill move won't work on me, try it, I dare you",
 "my club asked me about you, I said you're... decent",
 "the media wants a rivalry, shall we give them one?",
 "I watched your highlights at 2am, tell no one",
 "your fans photoshopped me, it was actually funny",
 "if you're ever in my city, dinner's on me, rivalry paused",
 "they gave you MY award nomination spot, motivate me why",
 "our transfer values are linked now, congrats to us both",
 "beat me Saturday and I'll post your celebration myself",
 "the number you wear? I wore it first, wear it well",
 "one of us wins the golden boot this year, may the best striker eat",
 "stop scoring, you're making my contract talks harder",
 "my manager showed YOUR clips in OUR meeting, disgusting",
 "the national team only has one spot for us, sleep on that",
 "I respect the grind, the trash talk is just seasoning",
 "your last defender-destroying run gave me flashbacks",
 "they say styles make rivalries, ours is cinema",
 "let's swap shirts after the match, I know a framer",
 "if either of us wins the big one, the other buys watches",
 "the algorithm keeps showing me your face, make it stop",
 "see you in the tunnel, don't blink first"],
 closers:["May the best one win.","No hard feelings. Some feelings.","Clock's ticking.","Iron sharpens iron.","😤","Tunnel talk soon.","Keep my name in your drafts.","Game recognises game.","Until Saturday.","Don't make it easy."]},
{id:"brand", label:"Brand Rep", ico:"🛍️",
 intros:["Hello star!","Exciting news —","Our team loved your last match!","Quick opportunity:","Campaign update:","The marketing dept is buzzing —","Confidential brief:","Big idea incoming:","Numbers came in —","Your content manager here —"],
 bodies:[
 "we want you in the next global campaign, cleats optional",
 "your engagement rate beat three A-listers this month",
 "can you post the product 'casually' in your next story?",
 "legal approved the billboard, your face, city centre, huge",
 "the limited edition collab sold out in four minutes",
 "we're flying you first class to the shoot, bring the smile",
 "focus groups say you're 'authentic', that's marketing gold",
 "your goal celebration is now our unofficial slogan",
 "the CEO watched your match and doubled the budget",
 "we need three photos: happy, focused, and 'mysterious'",
 "please stop tagging our competitor, we noticed, twice",
 "the ad with your face got more views than the trailer it interrupted",
 "kids are asking stores for 'the one the footballer has'",
 "renewal talks start soon, the numbers will make you laugh",
 "our rival brand offered you more? forward me that email",
 "wear the new colourway Saturday and watch the internet melt",
 "your bloopers from the shoot tested BETTER than the script",
 "the collab drops Friday, act surprised on camera",
 "we sponsored your rival too, keep beating him please, it's funny",
 "the meme you posted moved actual stock price, chill",
 "your signature line needs a name, ideas welcome, nothing rude",
 "the commercial director wants 'one more take' — it's never one",
 "sales spike every time you score, invoice attached, joking",
 "the mascot costume request is optional, mostly",
 "contract says one post a month, you did six, we love you"],
 closers:["Synergy!","The brand thanks you.","Invoice separately.","Stay on message.","You're the moment.","KPIs through the roof.","📊🚀","Our socials adore you.","More soon.","Don't read the fine print. Kidding."]},
{id:"mentor", label:"Old Coach", ico:"🧓",
 intros:["Remember me?","From your first coach:","Still watching, kid.","Saw the match.","An old man's advice —","You won't remember this drill, but","Quick note from the past:","The pitch where you started says hi.","Proud doesn't cover it.","One correction:"],
 bodies:[
 "you still drop your shoulder exactly like when you were nine",
 "the first touch is better, the decision after it can be quicker",
 "I show your clips to the under-10s every Saturday morning",
 "you did the drill we practiced for years, on live TV, beautiful",
 "don't let them coach the chaos out of your game",
 "your free kick stance changed, was that on purpose?",
 "the kid who cried after missing a penalty now takes them cold",
 "I kept your first registration form, still can't read your handwriting",
 "watch your left foot, you're telegraphing the cut inside again",
 "fame is loud, fundamentals are quiet, choose quiet daily",
 "the local paper interviewed me about you, I lied and said you listened",
 "your pressing angles improved, someone's coaching you well",
 "when you point at the badge, this whole town points back",
 "rest the body, but never rest the first yard in your head",
 "I told your parents at 12 you'd make it, collect my prize anytime",
 "the new turf at the old ground has your name on a plaque now",
 "you played tired last week, learn to hide it better",
 "remember: the best players make the simple pass look boring",
 "our club shop sells your poster, we make more than from kits",
 "when it gets heavy, come train with the kids, resets the soul",
 "your celebration is the same one from the under-11 cup final",
 "defenders fear you, now make midfielders fear you too",
 "I don't want tickets, I want you to keep the humility",
 "the drill you hated most is why your weak foot works",
 "one day you'll coach, start taking notes now"],
 closers:["Keep the joy.","The game remembers.","Once my player, always my player.","Head up, chest out.","Old school, still right.","Fundamentals forever.","⚽🧠","Come visit the club.","Tell your mum hello.","Class is permanent."]},
];
// replies: per category, 6 triples (chosen by body index % 6). tone order: warm / neutral / blunt
const DM_REPLIES = {
teammate:[["Haha love you bro 😂","Noted.","Focus on your own game 😅"],["I'm in, obviously","Maybe, let me check","Can't. Recovery night."],["You're the best teammate","Ok ok","Stop texting me at midnight"],["Say less 🤝","We'll see","Delete that video. Now."],["Team first, always","Fair enough","I do MY job out there"],["On it, brother","Cool","This chat is chaos"]],
agent:[["You're a genius, proceed","Send details first","No. Too risky."],["I trust you, do it","Let me sleep on it","I make the decisions here"],["Love the ambition!","Keep me posted","Stop calling other clubs"],["Whatever gets us up a level","Numbers first","My focus is football, not money"],["Handle it, that's your job","Explain the fine print","You take too much percentage"],["Let's build the empire","Cautious yes","I'm loyal to my club. Relax."]],
manager:[["Yes gaffer, whatever the team needs","Understood","I want more minutes, plain and simple"],["Thank you for the honesty","Ok, noted","I disagree, but I'll show you on the pitch"],["I'll be first at training","Got it","The bench is hard to accept"],["Appreciate you backing me","Makes sense","Play me and you'll see"],["The badge comes first","Fine","I know my worth"],["I'll fix it this week","Copy that","Harsh. But fair. Maybe."]],
family:[["Love you all so much ❤️","Miss you guys","I'm fine, stop worrying 😅"],["Coming home first free week!","Soon, promise","Schedule is brutal right now"],["Tell grandma the candle works","Haha thanks","Please don't write to commentators"],["You keep me grounded","Thanks mum","I eat fine! Mostly."],["Frame it, I'll sign it","Cute","Don't sell it on eBay dad"],["Family over everything","❤️","I'll call Sunday, promise"]],
journalist:[["Sure — call my agent to set it up","No comment","Write it without me"],["I appreciate fair coverage","Maybe after the match","You lot twist everything"],["One quote: 'we go again'","Let me think","Journalists ruined my week once. Never again."],["Cover the charity, not me","Fine, keep it factual","Delete my number"],["The fans deserve the real story","Send questions first","My football talks. Bye."],["You've been fair to me, ok","Off record only","Nice try."]],
rival:[["Respect, see you out there 🤝","We'll see","You'll be chasing my shadow"],["Dinner's on when rivalry's off","Ok, game on","I don't reply to future victims"],["Game recognises game","Sure","Keep watching my clips at 2am"],["May the best one win","Noted","One of us is nervous. Not me."],["This rivalry will be legendary","Fine by me","You talk more than you press"],["Shirt swap deal accepted","Maybe","Earn it first"]],
brand:[["Love it, let's go bigger","Send the brief","My agent handles ALL of this"],["The fans will love this","Approve the visuals first","No mascot costume. Final."],["Synergy indeed 😄","Ok, one post","I'm a footballer, not a billboard"],["Flying first class helps the chemistry","Details please","Match my rival's offer or no deal"],["Campaign sounds fun","Within reason","Read MY fine print"],["You had me at billboard","Fine, one take","Six posts was a phase"]],
mentor:[["Means everything coming from you","Thanks coach","I've grown past those drills"],["I'll visit the old pitch soon","Good catch, I'll work on it","The game's different at this level"],["You built my foundations","Noted, coach","My new staff handle technique now"],["Tell the kids I said keep going","Appreciated","Don't show them my misses"],["Humility, always. You taught me","I hear you","Fame hasn't changed me. Much."],["Saving this message forever","Wise as ever","I telegraph NOTHING"]],
};
// reply effects by category and tone (warm/neutral/blunt)
const DM_FX = {
teammate:[{trust:1.5,morale:2},{morale:0.5},{trust:-1,morale:1}],
agent:[{rep:0.6,money:2000},{},{rep:-0.3,morale:1}],
manager:[{trust:2.5},{trust:0.5},{trust:-2,morale:2}],
family:[{morale:3,energy:1},{morale:1.5},{morale:0.5}],
journalist:[{rep:1,followers:3000},{},{rep:-0.5,love:0.5}],
rival:[{love:1,followers:2000},{},{followers:5000,morale:1,love:-0.5}],
brand:[{followers:4000,love:0.5},{},{rep:0.4,morale:0.5}],
mentor:[{morale:2,trust:1},{morale:1},{morale:-0.5}],
};
const DM_TOTAL = DM_CATS.length * 10 * 25 * 10; // 20,000

/* ===== FAN MESSAGES (read-only, bottom of inbox) ===== */
const FAN_TEMPLATES = [
"I named my {thing} after you!","You are the reason I started playing football.","My whole family are {word} fans of yours.",
"I travelled 4 hours to watch you and it was {word}.","Your poster is on my ceiling so you're the first thing I see.",
"My teacher let us write essays about you, mine was {word}.","I saved a month for your shirt and it was worth it.",
"Grandpa says you remind him of the legends, and he never says that.","I scored today and did YOUR celebration!",
"Please never leave our club, you are {word}.","I drew you in art class, the teacher hung it up!",
"You waved at my section last match, I haven't recovered.","My baby sister's first word was basically your name.",
"Our whole school played as you at break time today.","I got your autograph last year and I protect it with my life.",
"When you scored I hugged a stranger, we're friends now.","I do your skill move in the mirror every night.",
"You liked my comment once and my friends still don't believe me.","Your interview made my dad cry. He says allergies. It was you.",
"We painted a mural of you on our street!","I recover from bad days by watching your highlights.",
"My physics teacher used your free kick to explain curves.","I asked the barber for YOUR haircut. The whole squad did.",
"You're proof kids from nowhere can make it somewhere.","One day I'll play against you and shake your hand."],
FAN_WORDS = ["incredible","unreal","legendary","magical","perfect","everything","world class","different","unstoppable","a dream","cinema","generational","electric","priceless","untouchable","glorious","breathtaking","special","limitless","forever"],
FAN_THINGS = ["goldfish","dog","cat","hamster","little brother's teddy","bike","playlist","gaming account","school project","left boot","alarm clock","fantasy team","parrot","skateboard","lucky pencil","turtle","street team","scooter","diary","pillow fort"],
FAN_CLOSERS = ["⚽❤️","GOAT!!","never stop!!","from your #1 fan","see you Saturday!!","🥺🥺","(please reply)","my hero!!","🔥🔥🔥","forever a fan","💯💯","you're him!!","best ever!!","🙌🙌","one love!!","(mum says hi too)","salute!!","👑👑","to the moon!!","respect!!"];
const FANMSG_TOTAL = FAN_TEMPLATES.length * FAN_WORDS.length * FAN_CLOSERS.length; // 10,000

function genFanMsg(state) {
  const seen = new Set(state.fanSeen || []);
  let id = 0;
  for (let t = 0; t < 25; t++) {
    const a = ri(0, FAN_TEMPLATES.length - 1), b = ri(0, FAN_WORDS.length - 1), c = ri(0, FAN_CLOSERS.length - 1);
    id = (a * FAN_WORDS.length + b) * FAN_CLOSERS.length + c;
    if (!seen.has(id)) break;
  }
  const c = id % FAN_CLOSERS.length, b = Math.floor(id / FAN_CLOSERS.length) % FAN_WORDS.length, a = Math.floor(id / (FAN_CLOSERS.length * FAN_WORDS.length));
  const text = FAN_TEMPLATES[a].replace("{word}", FAN_WORDS[b]).replace("{thing}", pick(FAN_THINGS)) + " " + FAN_CLOSERS[c];
  state.fanSeen = state.fanSeen || [];
  state.fanSeen.push(id);
  if (state.fanSeen.length > 3000) state.fanSeen.shift();
  return { text, from: genName(pick(Object.keys(POOLS))).split(" ")[0] + ri(7, 99), week: state.week, year: state.year, liked: false };
}

function dmSenderName(state, cat) {
  switch (cat.id) {
    case "teammate": return state.mates.length ? pick(state.mates) : genName("english");
    case "agent": { const a = AGENTS.find(x => x.id === state.agent); return a ? a.name : "Your Agent"; }
    case "manager": return "The Gaffer";
    case "family": return pick(["Mum", "Dad", "Your Sister", "Grandma", "Uncle T"]);
    case "journalist": return genName(natPool(state.player.nat));
    case "rival": return state.stars.length ? pick(state.stars).name : genName("spanish");
    case "brand": return state.brandDeals && state.brandDeals.length ? pick(state.brandDeals).name + " Team" : pick(BRANDS)[0] + " Team";
    case "mentor": return "Coach " + genName(natPool(state.player.nat)).split(" ")[1];
  }
  return "Unknown";
}

function genDM(state, catIdx) {
  const cat = DM_CATS[catIdx];
  const seen = new Set(state.dmSeen || []);
  let id = 0;
  for (let t = 0; t < 25; t++) {
    const i = ri(0, 9), b = ri(0, 24), c = ri(0, 9);
    id = ((catIdx * 10 + i) * 25 + b) * 10 + c;
    if (!seen.has(id)) break;
  }
  const c = id % 10, b = Math.floor(id / 10) % 25, i = Math.floor(id / 250) % 10;
  state.dmSeen = state.dmSeen || [];
  state.dmSeen.push(id);
  if (state.dmSeen.length > 6000) state.dmSeen.shift();
  return {
    id, cat: cat.id, catIdx, ico: cat.ico, label: cat.label,
    from: dmSenderName(state, cat),
    text: cat.intros[i] + " " + cat.bodies[b] + " " + cat.closers[c],
    replies: DM_REPLIES[cat.id][b % 6],
    replied: null, week: state.week, year: state.year,
  };
}

/* weekly inbox generation — call from advanceWeek */
function dmsWeekly(state) {
  const p = state.player;
  if (!state.inbox) return;
  const inWindow = (state.week >= 24 && state.week <= 27) || state.week >= 44 || state.week <= 3;
  const weights = [
    [0, 26], [1, inWindow ? 22 : 8], [2, state.academy ? 4 : 13], [3, 16],
    [4, 4 + p.rep / 6], [5, p.rep > 35 ? 8 : 1], [6, state.brandDeals && state.brandDeals.length ? 9 : 2], [7, 7],
  ];
  const total = weights.reduce((a, w) => a + w[1], 0);
  const n = 1 + (chance(55) ? 1 : 0) + (p.rep > 45 && chance(40) ? 1 : 0);
  for (let k = 0; k < n; k++) {
    let r = Math.random() * total;
    let catIdx = 0;
    for (const [ci, w] of weights) { r -= w; if (r <= 0) { catIdx = ci; break; } }
    state.inbox.unshift(genDM(state, catIdx));
  }
  if (state.inbox.length > 40) state.inbox.length = 40;
  // fan mail volume scales with fame
  const fanN = clamp(1 + Math.floor(Math.log10(p.followers + 10)) - 1, 1, 5);
  for (let k = 0; k < fanN; k++) state.fanbox.unshift(genFanMsg(state));
  if (state.fanbox.length > 25) state.fanbox.length = 25;
}

function replyDM(state, inboxIdx, toneIdx) {
  const dm = state.inbox[inboxIdx];
  if (!dm || dm.replied !== null) return;
  dm.replied = toneIdx;
  const fx = DM_FX[dm.cat][toneIdx] || {};
  const p = state.player;
  if (fx.morale) p.morale = clamp(p.morale + fx.morale, 0, 100);
  if (fx.trust) p.trust = clamp(p.trust + fx.trust, 0, 100);
  if (fx.rep) p.rep = clamp(p.rep + fx.rep, 0, 100);
  if (fx.energy) p.energy = clamp(p.energy + fx.energy, 0, 100);
  if (fx.followers) p.followers += fx.followers;
  if (fx.money) state.money += fx.money;
  if (fx.love && state.fans) state.fans.love = clamp(state.fans.love + fx.love, 0, 100);
  state.dmReplies = (state.dmReplies || 0) + 1;
  if (state.dmReplies >= 100) unlock(state, "dm100");
}

function likeAllFans(state) {
  const key = state.year * 100 + state.week;
  if (state.fanLikedWk === key) return false;
  state.fanLikedWk = key;
  state.fanbox.forEach(f => f.liked = true);
  if (state.fans) state.fans.love = clamp(state.fans.love + 1.5, 0, 100);
  state.player.followers += Math.round(200 + state.player.rep * 40);
  return true;
}

ACHIEVEMENTS.push(
  { id: "dm100", ico: "📱", name: "Inbox Hero", desc: "Reply to 100 DMs" },
);
