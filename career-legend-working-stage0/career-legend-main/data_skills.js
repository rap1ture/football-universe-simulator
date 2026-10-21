"use strict";
/* ===== SKILL MOVES =====
 * 53 individually trainable moves. Level 0-100 each.
 * cat: FLK flicks · DRB dribbling · FIN finishing · PAS passing · DEF defending · GK goalkeeping
 * attr: linked attribute (affects learning speed + in-match success)
 */
const SKILL_CATS = { FLK: "🎩 Flicks & Showboating", DRB: "🌀 Dribbling Moves", FIN: "🎯 Finishing Moves", PAS: "🎁 Passing Moves", DEF: "🛡️ Defensive Arts", GK: "🧤 Goalkeeper Arts" };
const SKILL_MOVES = [
// —— Flicks & showboating (10)
{id:"rainbow", name:"Rainbow Flick", ico:"🌈", cat:"FLK", attr:"dri"},
{id:"sombrero", name:"Sombrero Flick", ico:"👒", cat:"FLK", attr:"dri"},
{id:"heelflick", name:"Heel Flick", ico:"🦶", cat:"FLK", attr:"dri"},
{id:"okocha", name:"Okocha Touch", ico:"✨", cat:"FLK", attr:"dri"},
{id:"hocus", name:"Hocus Pocus", ico:"🪄", cat:"FLK", attr:"dri"},
{id:"waka", name:"Waka Waka", ico:"💃", cat:"FLK", attr:"dri"},
{id:"heel2heel", name:"Heel-to-Heel Flick", ico:"👟", cat:"FLK", attr:"dri"},
{id:"ballhop", name:"Ball Hop", ico:"🐇", cat:"FLK", attr:"dri"},
{id:"neckcatch", name:"Neck Catch Tease", ico:"🦒", cat:"FLK", attr:"dri"},
{id:"jugglerun", name:"Juggling Run", ico:"🤹", cat:"FLK", attr:"dri"},
// —— Dribbling (15)
{id:"elastico", name:"Elastico", ico:"🪀", cat:"DRB", attr:"dri"},
{id:"airelastico", name:"Air Elastico", ico:"🌪️", cat:"DRB", attr:"dri"},
{id:"roulette", name:"Zidane Roulette", ico:"🎡", cat:"DRB", attr:"dri"},
{id:"cruyff", name:"Cruyff Turn", ico:"🔄", cat:"DRB", attr:"dri"},
{id:"mcgeady", name:"McGeady Spin", ico:"🌀", cat:"DRB", attr:"dri"},
{id:"croqueta", name:"La Croqueta", ico:"🥐", cat:"DRB", attr:"dri"},
{id:"vdrag", name:"V-Drag", ico:"✔️", cat:"DRB", attr:"dri"},
{id:"chop", name:"Ronaldo Chop", ico:"🪓", cat:"DRB", attr:"dri"},
{id:"dragback", name:"Drag Back", ico:"↩️", cat:"DRB", attr:"dri"},
{id:"bodyfeint", name:"Body Feint", ico:"🕺", cat:"DRB", attr:"dri"},
{id:"stepover", name:"Double Stepover", ico:"👣", cat:"DRB", attr:"pac"},
{id:"ballroll", name:"Ball Roll Chop", ico:"🎳", cat:"DRB", attr:"dri"},
{id:"fakeshot", name:"Fake Shot Exit", ico:"🎭", cat:"DRB", attr:"dri"},
{id:"nutmeg", name:"Nutmeg", ico:"🥜", cat:"DRB", attr:"dri"},
{id:"berba", name:"Berba Spin", ico:"🎠", cat:"DRB", attr:"dri"},
// —— Finishing (12)
{id:"bicycle", name:"Bicycle Kick", ico:"🚲", cat:"FIN", attr:"sho"},
{id:"scorpion", name:"Scorpion Kick", ico:"🦂", cat:"FIN", attr:"sho"},
{id:"knuckle", name:"Knuckleball Strike", ico:"⚡", cat:"FIN", attr:"sho"},
{id:"trivela", name:"Trivela Finish", ico:"🌙", cat:"FIN", attr:"sho"},
{id:"backheelfin", name:"Backheel Finish", ico:"🔙", cat:"FIN", attr:"sho"},
{id:"volley", name:"First-Time Volley", ico:"💥", cat:"FIN", attr:"sho"},
{id:"panenka", name:"Panenka", ico:"🥄", cat:"FIN", attr:"sho"},
{id:"chipfin", name:"Delicate Chip", ico:"🍟", cat:"FIN", attr:"sho"},
{id:"curler", name:"Top-Bins Curler", ico:"🎯", cat:"FIN", attr:"sho"},
{id:"nolookfin", name:"No-Look Finish", ico:"🙈", cat:"FIN", attr:"sho"},
{id:"toepoke", name:"Toe-Poke Rocket", ico:"🚀", cat:"FIN", attr:"sho"},
{id:"powerheader", name:"Power Header", ico:"🗿", cat:"FIN", attr:"phy"},
// —— Passing (8)
{id:"rabona", name:"Rabona Cross", ico:"🦩", cat:"PAS", attr:"pas"},
{id:"nolookpass", name:"No-Look Pass", ico:"😎", cat:"PAS", attr:"pas"},
{id:"trivelapass", name:"Trivela Pass", ico:"🥖", cat:"PAS", attr:"pas"},
{id:"backheelpass", name:"Backheel Assist", ico:"🎩", cat:"PAS", attr:"pas"},
{id:"scoop", name:"Scooped Through Ball", ico:"🥄", cat:"PAS", attr:"pas"},
{id:"longping", name:"60-Yard Ping", ico:"📡", cat:"PAS", attr:"pas"},
{id:"outsidecross", name:"Whipped Outside Cross", ico:"🌀", cat:"PAS", attr:"pas"},
{id:"flickpass", name:"First-Touch Flick Pass", ico:"🏓", cat:"PAS", attr:"pas"},
// —— Defending (4)
{id:"perfectslide", name:"Perfect Slide Tackle", ico:"🛝", cat:"DEF", attr:"def"},
{id:"shoulder", name:"Shoulder Barge", ico:"🐂", cat:"DEF", attr:"phy"},
{id:"lastblock", name:"Last-Ditch Block", ico:"🧱", cat:"DEF", attr:"def"},
{id:"readsteal", name:"Interception Read", ico:"🧠", cat:"DEF", attr:"def"},
// —— Goalkeeping (4)
{id:"scorpsave", name:"Scorpion Save", ico:"🦂", cat:"GK", attr:"dri"},
{id:"sweeper", name:"Sweeper-Keeper Rush", ico:"🏃", cat:"GK", attr:"pac"},
{id:"quicklaunch", name:"Lightning Launch", ico:"🎯", cat:"GK", attr:"pas"},
{id:"spidersave", name:"Spider Save", ico:"🕷️", cat:"GK", attr:"dri"},
]; // 53 total
const skillById = id => SKILL_MOVES.find(s => s.id === id);

/* which skill categories fit which moment group */
const SKILL_GRP_MAP = { ATT: ["FLK", "DRB", "FIN"], MID: ["DRB", "PAS", "FLK"], DEF: ["DEF"], GK: ["GK"], ANY: ["FIN", "FLK"] };

function skillLevel(state, id) { return (state.skills && state.skills[id]) || 0; }

/* pick a trained skill (level ≥ 8) usable in a moment of this group */
function pickSkillFor(state, grp) {
  const cats = SKILL_GRP_MAP[grp] || [];
  const cands = SKILL_MOVES.filter(s => cats.includes(s.cat) && skillLevel(state, s.id) >= 8);
  if (!cands.length) return null;
  // weight by level so your best moves show up most
  const total = cands.reduce((a, s) => a + skillLevel(state, s.id), 0);
  let r = Math.random() * total;
  for (const s of cands) { r -= skillLevel(state, s.id); if (r <= 0) return s; }
  return cands[cands.length - 1];
}

/* build the extra "use your skill move" option for a moment */
function buildSkillOption(state, skill) {
  const lvl = Math.round(skillLevel(state, skill.id));
  const flair = { foll: Math.round(800 + state.player.rep * 120), love: 1.5 };
  let ok, ko;
  if (skill.cat === "FIN") {
    ok = { g: 1, dr: 0.35, flair, txt: `${skill.ico} ${skill.name.toUpperCase()}!!! An outrageous finish — that's on every highlight reel tonight!` };
    ko = { dr: -0.35, txt: `The ${skill.name} doesn't come off — so close to glory.` };
  } else if (skill.cat === "PAS") {
    ok = { a: 1, dr: 0.3, flair, txt: `${skill.ico} ${skill.name}! An assist dripping in sauce!` };
    ko = { dr: -0.3, txt: `The ${skill.name} is cut out. Ambitious.` };
  } else if (skill.cat === "DEF") {
    ok = { dr: 0.55, flair, txt: `${skill.ico} ${skill.name}! Defending turned into art!` };
    ko = { dr: -0.35, txt: `The ${skill.name} misses — danger continues.` };
  } else if (skill.cat === "GK") {
    ok = { dr: 0.7, flair, txt: `${skill.ico} ${skill.name.toUpperCase()}! The photographers got THE shot!` };
    ko = { og: 1, dr: -0.35, txt: `You went for the ${skill.name}... and it's in the net.` };
  } else { // FLK / DRB — pure flair, big crowd energy
    ok = { dr: 0.5, flair: { foll: flair.foll * 1.5, love: 2.5 }, txt: `${skill.ico} ${skill.name.toUpperCase()}! The stadium GASPS — the defender needs therapy!` };
    ko = { dr: -0.3, txt: `The ${skill.name} gets read — the crowd groans.` };
  }
  return { t: `${skill.ico} ${skill.name} (Lv ${lvl})`, attr: skill.attr, base: 0, skill: skill.id, ok, ko };
}

/* success chance for a skill option */
function skillChance(state, opt) {
  const lvl = skillLevel(state, opt.skill);
  const attrVal = state.player.attrs[skillById(opt.skill).attr];
  return Math.round(clamp(16 + lvl * 0.6 + (attrVal - 60) * 0.28 + (state.player.form - 6) * 2 + DIFFS[state.diff].moment * 0.5, 5, 92));
}

/* using a skill in a match trains it a little */
function skillUseXp(state, id, success) {
  if (!state.skills[id]) state.skills[id] = 0;
  state.skills[id] = clamp(state.skills[id] + (success ? 0.9 : 0.35), 0, 100);
  state.skillUses = (state.skillUses || 0) + 1;
  if (success && state.skillUses >= 50) unlock(state, "showboat");
}

/* extra achievements (additive-safe) */
ACHIEVEMENTS.push(
  { id: "showboat", ico: "🎪", name: "Showboat", desc: "Pull off 50 skill moves in matches" },
  { id: "skill_master", ico: "🧙", name: "Skill Master", desc: "Train any skill move to level 100" },
  { id: "skill_five", ico: "🎨", name: "Street Baller", desc: "Train 5 skills to level 50+" },
);

/* ===== 15 EXTRA MATCH MOMENTS (variety pack) ===== */
MOMENTS.push(
{grp:"ATT", txt:"The keeper is WAY off his line — you spot it from near halfway!", opts:[
  {t:"Shoot from halfway", attr:"sho", base:18, ok:{g:1,dr:0.6,txt:"FROM HALFWAY!!! One of the goals of the century!"}, ko:{dr:-0.2,txt:"Drifts wide. Worth the dream."}},
  {t:"Drive forward with the ball", attr:"pac", base:55, ok:{g:1,dr:0.15,txt:"You carry it 40 yards and finish calmly!"}, ko:{dr:-0.25,txt:"Recovering defenders swallow you up."}},
  {t:"Keep it simple", attr:"pas", base:75, ok:{dr:0.15,txt:"Possession kept. The moment passes."}, ko:{dr:-0.1,txt:"Sloppy touch anyway."}}]},
{grp:"ATT", txt:"The keeper SPILLS it — rebound scramble in the six-yard box!", opts:[
  {t:"Pounce first", attr:"pac", base:52, ok:{g:1,dr:0,txt:"Sharpest in the box! Poacher's goal!"}, ko:{dr:-0.25,txt:"A defender hacks it off your toe."}},
  {t:"Smash it through the crowd", attr:"sho", base:45, ok:{g:1,dr:0.1,txt:"Through a forest of legs — IN!"}, ko:{dr:-0.3,txt:"Blocked on the line!"}},
  {t:"Head it goalward", attr:"phy", base:42, ok:{g:1,dr:0.1,txt:"Brave header in the chaos — GOAL!"}, ko:{dr:-0.25,txt:"You eat an elbow for nothing.", }}]},
{grp:"ATT", txt:"Their centre-back dawdles on the ball, right outside his own box...", opts:[
  {t:"Press like a demon", attr:"pac", base:48, ok:{g:1,dr:0.3,txt:"ROBBED HIM! You steal it and score — his manager is furious!"}, ko:{dr:-0.15,txt:"He clears it last second."}},
  {t:"Cut the passing lane", attr:"def", base:62, ok:{dr:0.25,txt:"He panics and boots it out. Pressure win."}, ko:{dr:-0.1,txt:"He plays around you."}},
  {t:"Fake press, bait the pass", attr:"dri", base:40, ok:{a:1,dr:0.3,txt:"He falls for it! You intercept and square for a tap-in!"}, ko:{dr:-0.2,txt:"He saw it coming."}}]},
{grp:"MID", txt:"Corner half-cleared — the ball drops to you 25 yards out...", opts:[
  {t:"Volley it first time", attr:"sho", base:26, ok:{g:1,dr:0.45,txt:"OH MY WORD! A dipping volley — the net bulges!"}, ko:{dr:-0.2,txt:"Skewed into the stands."}},
  {t:"Chest it down, pick a pass", attr:"pas", base:58, ok:{a:1,dr:0.15,txt:"Recycled beautifully — the second wave scores!"}, ko:{dr:-0.2,txt:"Counter launched against you."}},
  {t:"Win the second ball battle", attr:"phy", base:55, ok:{dr:0.3,txt:"You crunch through and keep the attack alive."}, ko:{card:"y",dr:-0.25,txt:"Late. Booked."}}]},
{grp:"MID", txt:"Referee plays advantage as you burst through midfield, ankle stinging...", opts:[
  {t:"Power through the pain", attr:"phy", base:50, ok:{a:1,dr:0.3,txt:"Warrior stuff! You stay up and create a goal!"}, ko:{dr:-0.3,txt:"Your legs give out. Chance dead.", inj:5}},
  {t:"Release it early", attr:"pas", base:65, ok:{dr:0.25,txt:"Smart early ball keeps the move flowing."}, ko:{dr:-0.15,txt:"Pass is behind him."}},
  {t:"Go down, take the free kick", attr:"dri", base:80, ok:{dr:0.1,txt:"Sensible. Free kick in a good spot."}, ko:{card:"y",dr:-0.4,txt:"The ref says you dived! Booked!"}}]},
{grp:"MID", txt:"Your winger is FREE — but the safe pass is backwards and the coach hates risk...", opts:[
  {t:"Hit the killer ball anyway", attr:"pas", base:46, ok:{a:1,dr:0.25,txt:"Vision! The risky ball splits four players — assist!"}, ko:{dr:-0.3,txt:"Intercepted. The coach throws his water bottle."}},
  {t:"Play it safe backwards", attr:"pas", base:80, ok:{dr:0.1,txt:"Sideways FC. The coach nods. The fans yawn."}, ko:{dr:-0.15,txt:"Even the safe ball goes astray. Oof."}},
  {t:"Carry it yourself", attr:"dri", base:44, ok:{dr:0.4,txt:"You beat two and win a corner. Initiative!"}, ko:{dr:-0.25,txt:"Crowded out."}}]},
{grp:"DEF", txt:"A 60-yard diagonal bomb sails toward their giant target man...", opts:[
  {t:"Attack it in the air", attr:"phy", base:48, ok:{dr:0.4,txt:"You out-jump the mountain! Colossal header clear!"}, ko:{og:1,dr:-0.4,txt:"He flicks it on... and they score."}},
  {t:"Drop and read the knockdown", attr:"def", base:60, ok:{dr:0.3,txt:"You sweep up the second ball. Chess, not checkers."}, ko:{dr:-0.25,txt:"The knockdown falls badly for you."}},
  {t:"Step out for offside", attr:"pac", base:44, ok:{dr:0.35,txt:"Flag up! The trap works to perfection."}, ko:{og:1,dr:-0.5,txt:"Mistimed! He's through alone... goal."}}]},
{grp:"DEF", txt:"Your keeper rolls it to you with their striker sprinting to press!", opts:[
  {t:"Calm turn away from pressure", attr:"dri", base:52, ok:{dr:0.35,txt:"Silky escape! The press is broken and the crowd purrs."}, ko:{og:1,dr:-0.6,txt:"ROBBED ON YOUR OWN BOX! Disaster goal."}},
  {t:"One-touch clip forward", attr:"pas", base:58, ok:{dr:0.3,txt:"Pressure? What pressure. Line broken."}, ko:{dr:-0.2,txt:"Straight to their midfield."}},
  {t:"Boot it into Row Z", attr:"phy", base:85, ok:{dr:0.05,txt:"No risks. The purists weep, the fans applaud."}, ko:{dr:-0.1,txt:"Shanked out for a throw deep in your half."}}]},
{grp:"DEF", txt:"2-on-1 counter — two attackers bearing down, you're all that's left!", opts:[
  {t:"Delay, delay, delay", attr:"def", base:52, ok:{dr:0.45,txt:"Masterclass! You slow them until help arrives!"}, ko:{og:1,dr:-0.4,txt:"The pass goes across and it's in."}},
  {t:"Gamble on the interception", attr:"pac", base:40, ok:{dr:0.55,txt:"You read the pass PERFECTLY! Stolen — counter the other way!"}, ko:{og:1,dr:-0.5,txt:"They play through you. Too easy."}},
  {t:"Force the weaker player to shoot", attr:"def", base:58, ok:{dr:0.3,txt:"He snatches at it — wide! Smart defending."}, ko:{og:1,dr:-0.35,txt:"Turns out he's not that weak."}}]},
{grp:"GK", txt:"Awful backpass and their striker is CHARGING at you!", opts:[
  {t:"Take a calm touch and pass around him", attr:"pas", base:44, ok:{dr:0.5,txt:"Ice in your veins! You play through the press like Beckenbauer."}, ko:{og:1,dr:-0.7,txt:"He blocks it into the net. Nightmare fuel."}},
  {t:"Lump it clear immediately", attr:"phy", base:75, ok:{dr:0.15,txt:"Cleared. Heart rate returning to normal."}, ko:{dr:-0.3,txt:"Charged down — corner. Almost catastrophe."}},
  {t:"Dribble around him", attr:"dri", base:30, ok:{dr:0.7,txt:"YOU DID NOT JUST DO THAT. The clip breaks the internet."}, ko:{og:1,dr:-0.9,txt:"He steals it and passes into the empty net. Why. WHY."}}]},
{grp:"GK", txt:"A wicked out-swinging cross floats into your six-yard box, bodies everywhere...", opts:[
  {t:"Come and CLAIM it", attr:"sho", base:48, ok:{dr:0.45,txt:"Through the traffic — clean catch! Total command."}, ko:{og:1,dr:-0.5,txt:"You drop it under pressure... bundled in."}},
  {t:"Punch it into orbit", attr:"phy", base:62, ok:{dr:0.3,txt:"BOOM. Cleared to safety with authority."}, ko:{dr:-0.3,txt:"Weak punch — chaos continues, corner conceded."}},
  {t:"Stay on your line, trust the defence", attr:"def", base:55, ok:{dr:0.2,txt:"Your centre-back heads it away. Fine judgement."}, ko:{dr:-0.25,txt:"Free header — off the bar! Lucky."}}]},
{grp:"ANY", noSkill:true, txt:"A mass confrontation erupts after a nasty tackle on your teammate!", opts:[
  {t:"Pull players apart, be the peacemaker", attr:"phy", base:70, ok:{dr:0.25,txt:"You calm the chaos. Leadership. The ref thanks you."}, ko:{card:"y",dr:-0.2,txt:"You get shoved and shove back — booked in the mess."}},
  {t:"Get in their captain's face", attr:"phy", base:40, ok:{dr:0.2,txt:"You win the mind games — their captain loses focus all night."}, ko:{card:"y",dr:-0.35,txt:"Yellow card for the theatrics."}},
  {t:"Stay out of it completely", attr:"def", base:88, ok:{dr:0.05,txt:"Not your circus. You sip water while chaos reigns."}, ko:{dr:-0.05,txt:"Pundits call you 'detached'. Whatever."}}]},
{grp:"ANY", noSkill:true, txt:"Your teammate is having an absolute nightmare and the fans are on his back...", opts:[
  {t:"Talk to him, lift him up", attr:"pas", base:60, ok:{dr:0.3,txt:"He grows two feet taller — and sets up the next goal! Captain material."}, ko:{dr:-0.1,txt:"He's too deep in his own head tonight."}},
  {t:"Demand the ball more yourself", attr:"dri", base:48, ok:{dr:0.4,txt:"You take over the game so he doesn't have to. Star behaviour."}, ko:{dr:-0.25,txt:"You overdo it and force things."}},
  {t:"Tell the bench he needs subbing", attr:"def", base:55, ok:{dr:0.15,txt:"Harsh but right — his replacement changes the game."}, ko:{dr:-0.2,txt:"He heard you. Awkward dressing room."}}]},
{grp:"ANY", noSkill:true, txt:"The manager screams new instructions... you're sure they're wrong.", opts:[
  {t:"Follow orders exactly", attr:"def", base:70, ok:{dr:0.2,txt:"The plan actually works. He knows things."}, ko:{dr:-0.2,txt:"The plan fails, but at least you're not blamed."}},
  {t:"Quietly do your own thing", attr:"dri", base:42, ok:{dr:0.5,txt:"Your instincts win the game! He claims it was the plan all along."}, ko:{dr:-0.4,txt:"Caught out of position — and he SAW it."}},
  {t:"Shout back your idea", attr:"phy", base:35, ok:{dr:0.35,txt:"He actually listens! Tactical tweak, instant improvement."}, ko:{dr:-0.3,txt:"'WHO is the manager here?!' Awkward."}}]},
{grp:"ATT", txt:"Cross whipped in at awkward chest height with a defender breathing on you...", opts:[
  {t:"Improvise a volley", attr:"sho", base:34, ok:{g:1,dr:0.35,txt:"Acrobatic! Somehow it flies in — instinct finishing!"}, ko:{dr:-0.25,txt:"Swing and a miss. The defender smirks."}},
  {t:"Chest it down first", attr:"dri", base:52, ok:{g:1,dr:0.1,txt:"Cushioned, set, finished. Textbook."}, ko:{dr:-0.2,txt:"Heavy touch, chance gone."}},
  {t:"Flick it on to the back post", attr:"pas", base:48, ok:{a:1,dr:0.15,txt:"Clever flick — back-post tap-in! Assist!"}, ko:{dr:-0.15,txt:"Flicked into gloves."}}]}
);

/* ===== VARIETY PACK 2: 18 more match moments (48 total) ===== */
MOMENTS.push(
{grp:"ATT", txt:"Their keeper charges out recklessly and misses the ball completely — it's loose near the byline!", opts:[
  {t:"Shoot at the empty net from the angle", attr:"sho", base:55, ok:{g:1,dr:0.2,txt:"From an impossible angle into the empty net!"}, ko:{dr:-0.25,txt:"A defender slides in and hooks it off the line!"}},
  {t:"Square it for a tap-in", attr:"pas", base:60, ok:{a:1,dr:0.1,txt:"Unselfish and perfect — easiest assist of your life."}, ko:{dr:-0.2,txt:"The pass is behind him. Agony."}},
  {t:"Take it round and walk it in", attr:"dri", base:48, ok:{g:1,dr:0.2,txt:"You stroll it home like a training drill."}, ko:{dr:-0.3,txt:"Too casual — a recovering defender robs you."}}]},
{grp:"ATT", txt:"The big centre-back keeps fouling you. One more and he is off...", opts:[
  {t:"Run straight at him again", attr:"dri", base:48, ok:{dr:0.45,txt:"He lunges — SECOND YELLOW! You got him sent off!"}, ko:{dr:-0.25,txt:"This time he times it perfectly. Clean as a whistle."}},
  {t:"Drag him wide and torment him", attr:"pac", base:55, ok:{a:1,dr:0.2,txt:"He cannot live with you out wide — your cross is turned in!"}, ko:{dr:-0.15,txt:"He holds his ground. Respect."}},
  {t:"Switch sides, attack the other CB", attr:"pas", base:65, ok:{dr:0.2,txt:"Smart rotation confuses their whole back line."}, ko:{dr:-0.1,txt:"The other one is somehow worse to play against."}}]},
{grp:"ATT", txt:"The cutback arrives — but two defenders are converging FAST...", opts:[
  {t:"First-time side-foot", attr:"sho", base:50, ok:{g:1,dr:0.1,txt:"Swept home before they could blink!"}, ko:{dr:-0.25,txt:"Rushed it — dragged wide."}},
  {t:"Take a touch, ride the tackles", attr:"dri", base:40, ok:{g:1,dr:0.25,txt:"You dance between BOTH tackles and finish. Filthy."}, ko:{dr:-0.35,txt:"Crunched. The ball squirts away."}},
  {t:"Dummy it for the runner behind", attr:"pas", base:45, ok:{a:1,dr:0.25,txt:"The dummy fools EVERYONE — your teammate buries it!"}, ko:{dr:-0.2,txt:"No one was behind you. Awkward."}}]},
{grp:"ATT", txt:"You are clean through but a defender is chasing — you can hear his breathing...", opts:[
  {t:"Knock it long and sprint", attr:"pac", base:52, ok:{g:1,dr:0.15,txt:"Pure gas! He is nowhere — you slot it calmly!"}, ko:{dr:-0.25,txt:"He is faster than he looks. Recovered."}},
  {t:"Check back and wrong-foot him", attr:"dri", base:48, ok:{g:1,dr:0.2,txt:"The check-back sends him to the hot dog stand — GOAL!"}, ko:{dr:-0.3,txt:"You slowed down and let the whole defence recover."}},
  {t:"Shield and win the free kick", attr:"phy", base:62, ok:{dr:0.2,txt:"Fouled. Free kick in a dangerous spot."}, ko:{dr:-0.15,txt:"He nicks it off you cleanly."}}]},
{grp:"ATT", txt:"Defenders keep backing off, terrified of your runs. Space opens 22 yards out...", opts:[
  {t:"Punish them — shoot", attr:"sho", base:38, ok:{g:1,dr:0.25,txt:"They gave you a yard and you took a mile. TOP CORNER!"}, ko:{dr:-0.2,txt:"Comfortable for the keeper."}},
  {t:"Draw them in, then release", attr:"pas", base:55, ok:{a:1,dr:0.2,txt:"You baited three defenders and freed the winger — assist!"}, ko:{dr:-0.15,txt:"They did not bite."}},
  {t:"Keep driving at the box", attr:"dri", base:45, ok:{dr:0.35,txt:"You win a corner and three defenders need a breather."}, ko:{dr:-0.2,txt:"Eventually they swarm you."}}]},
{grp:"MID", txt:"Their keeper launches EVERYTHING long. Another bomb is dropping...", opts:[
  {t:"Attack the second ball early", attr:"def", base:58, ok:{dr:0.3,txt:"You read the knockdown before it happens. Control regained."}, ko:{dr:-0.2,txt:"Their midfielder gets there first."}},
  {t:"Body up their target man", attr:"phy", base:48, ok:{dr:0.35,txt:"You out-muscle a man twice your size. The crowd notices."}, ko:{card:"y",dr:-0.3,txt:"Wrestled him a bit too obviously. Booked."}},
  {t:"Drop off and intercept the flick", attr:"pas", base:52, ok:{a:1,dr:0.25,txt:"Intercepted — and your first-time ball releases the counter for a GOAL!"}, ko:{dr:-0.15,txt:"The flick goes the other way."}}]},
{grp:"MID", txt:"Your press forces their defender into a horrible backpass — race the keeper!", opts:[
  {t:"Sprint and slide to intercept", attr:"pac", base:44, ok:{g:1,dr:0.3,txt:"You get there FIRST and poke it past the keeper! Pressing masterclass!"}, ko:{dr:-0.2,txt:"The keeper hoofs it off your toes."}},
  {t:"Curve your run to block the clearance", attr:"def", base:55, ok:{dr:0.3,txt:"The clearance cannons off you for a corner. Chaos created."}, ko:{dr:-0.15,txt:"He clears through the gap."}},
  {t:"Anticipate the panic pass", attr:"pas", base:50, ok:{a:1,dr:0.2,txt:"You read the panic ball and set up a glorious chance!"}, ko:{dr:-0.15,txt:"He found the safe option."}}]},
{grp:"MID", txt:"The game has gone flat. The crowd is restless. Someone needs to MAKE something happen...", opts:[
  {t:"Demand the ball and drive", attr:"dri", base:46, ok:{dr:0.4,txt:"You grab the game by the collar. The tempo transforms!"}, ko:{dr:-0.25,txt:"Dispossessed — and the away fans jeer."}},
  {t:"Play a 40-yard switch nobody saw", attr:"pas", base:50, ok:{a:1,dr:0.3,txt:"The switch splits the pitch open — assist!"}, ko:{dr:-0.2,txt:"Straight into touch. The groan is audible."}},
  {t:"Shoot from absurd range", attr:"sho", base:22, ok:{g:1,dr:0.6,txt:"OH THAT IS RIDICULOUS! FROM 35 YARDS!"}, ko:{dr:-0.2,txt:"Row Z. But at least the crowd woke up."}}]},
{grp:"MID", txt:"Their overlap keeps flooding your half-space. It is happening again RIGHT NOW...", opts:[
  {t:"Track the runner all the way", attr:"pac", base:56, ok:{dr:0.3,txt:"You shut the overlap down completely. Coach applauds."}, ko:{dr:-0.25,txt:"He is away — dangerous cross concedes a corner."}},
  {t:"Intercept the pass into the channel", attr:"def", base:48, ok:{dr:0.4,txt:"Read it like a book. Counter ON."}, ko:{og:1,dr:-0.4,txt:"Missed it — they carve you open and score."}},
  {t:"Warn your full-back and cover inside", attr:"pas", base:65, ok:{dr:0.2,txt:"Communication! The trap swallows their winger."}, ko:{dr:-0.15,txt:"He did not hear you over the crowd."}}]},
{grp:"DEF", txt:"Their striker drops deep to isolate you 1v1 near halfway — the crowd smells danger...", opts:[
  {t:"Get touch-tight, no turn allowed", attr:"phy", base:55, ok:{dr:0.35,txt:"He cannot breathe, let alone turn. Neutralized."}, ko:{dr:-0.3,txt:"He rolls you and drives at goal."}},
  {t:"Drop off and show him wide", attr:"def", base:60, ok:{dr:0.3,txt:"Textbook angles. The danger dissolves."}, ko:{dr:-0.2,txt:"He turns and slides in the runner."}},
  {t:"Gamble — nick it as it arrives", attr:"pac", base:42, ok:{a:1,dr:0.4,txt:"STOLEN! Your long ball releases the counter — assist!"}, ko:{og:1,dr:-0.5,txt:"Missed it. He is through alone... goal."}}]},
{grp:"DEF", txt:"The line steps for offside — but YOU are the deepest man. Split-second call...", opts:[
  {t:"Step with the line", attr:"def", base:52, ok:{dr:0.35,txt:"FLAG UP! The trap snaps shut perfectly."}, ko:{og:1,dr:-0.5,txt:"You stepped late — he is onside and scores."}},
  {t:"Drop and sweep behind", attr:"pac", base:50, ok:{dr:0.35,txt:"You sweep up the through ball like a libero."}, ko:{dr:-0.25,txt:"Caught in no man's land — corner conceded."}},
  {t:"Scream for the keeper to sweep", attr:"pas", base:45, ok:{dr:0.25,txt:"Your keeper races out and clears! Teamwork."}, ko:{og:1,dr:-0.45,txt:"Miscommunication... they walk it in."}}]},
{grp:"DEF", txt:"Sheets of rain. A through ball skids toward your box — a slide here is all or nothing...", opts:[
  {t:"Full slide through the water", attr:"def", base:46, ok:{dr:0.45,txt:"AQUAPLANE TACKLE! You surf through and win everything!"}, ko:{og:1,card:"y",dr:-0.5,txt:"You slide past everything. Goal AND a booking."}},
  {t:"Stay on your feet, usher it out", attr:"pac", base:56, ok:{dr:0.3,txt:"Patience in the chaos. Goal kick."}, ko:{dr:-0.25,txt:"The skid beats you — heart-stopping scramble."}},
  {t:"Let the keeper claim it", attr:"phy", base:50, ok:{dr:0.2,txt:"You screen the striker and your keeper gathers."}, ko:{dr:-0.3,txt:"The ball holds up in the water — chaos!"}}]},
{grp:"DEF", txt:"85 minutes on your legs. Their fresh substitute is RAPID and running straight at you...", opts:[
  {t:"Use your head — show him the touchline", attr:"def", base:55, ok:{dr:0.35,txt:"Experience 1, Pace 0. He runs out of pitch."}, ko:{dr:-0.3,txt:"He burns past on the inside. Not the outside. The inside."}},
  {t:"Foul him early, take the lecture", attr:"phy", base:70, ok:{card:"y",dr:-0.05,txt:"Cynical, early, effective. Booked but unbroken."}, ko:{card:"r",dr:-1.1,txt:"The ref calls it dangerous... RED. Disaster."}},
  {t:"Match him stride for stride", attr:"pac", base:38, ok:{dr:0.5,txt:"WHERE did that sprint come from?! You win it at full stretch!"}, ko:{og:1,dr:-0.4,txt:"The legs say no. He scores."}}]},
{grp:"GK", txt:"Free kick from 30 yards. Their specialist is eyeing your goal. Wall or no wall?", opts:[
  {t:"Full wall, cover your corner", attr:"def", base:56, ok:{dr:0.35,txt:"Straight into your wall. As planned."}, ko:{og:1,dr:-0.35,txt:"Up and over the wall... in off the bar."}},
  {t:"No wall — see everything", attr:"dri", base:40, ok:{dr:0.55,txt:"No wall?! You see it all the way and CATCH it. Galaxy brain."}, ko:{og:1,dr:-0.5,txt:"The pundits will destroy you for this."}},
  {t:"Two-man wall, gamble on placement", attr:"sho", base:48, ok:{dr:0.4,txt:"He goes for the gap — you read it. Saved!"}, ko:{og:1,dr:-0.4,txt:"Placed exactly where your third wall man would have been."}}]},
{grp:"GK", txt:"Your centre-back SLIPS! Their striker is in alone from 40 yards out...", opts:[
  {t:"Sprint out and clear OUTSIDE the box", attr:"pac", base:42, ok:{dr:0.6,txt:"SWEEPER KEEPER HEROICS! Cleared 35 yards from goal!"}, ko:{card:"r",dr:-1.2,txt:"You handle it outside the box. RED CARD."}},
  {t:"Retreat and make yourself big", attr:"def", base:48, ok:{dr:0.5,txt:"You force the panic shot — straight at you!"}, ko:{og:1,dr:-0.35,txt:"He picks his spot from 12 yards."}},
  {t:"Charge, then STOP to freeze him", attr:"dri", base:38, ok:{dr:0.6,txt:"The stutter freezes his brain — he scuffs it wide!"}, ko:{og:1,dr:-0.4,txt:"He waits you out and dinks it."}}]},
{grp:"GK", txt:"Cross after cross after cross. Another one hangs in the wind over your six-yard box...", opts:[
  {t:"Claim through the traffic", attr:"sho", base:50, ok:{dr:0.4,txt:"Yours. All night it has been yours. Command performance."}, ko:{og:1,dr:-0.45,txt:"The wind holds it up — you flap at air."}},
  {t:"Punch with both fists", attr:"phy", base:60, ok:{dr:0.3,txt:"CRUNCH. Cleared to the halfway line."}, ko:{dr:-0.25,txt:"Weak punch straight to their volley — over, thankfully."}},
  {t:"Catch and throw the counter in one motion", attr:"pas", base:42, ok:{a:1,dr:0.5,txt:"Caught, thrown, GOAL in nine seconds! Assist for the keeper!"}, ko:{dr:-0.2,txt:"The quick throw gets cut out. Ambitious."}}]},
{grp:"ANY", noSkill:true, txt:"Your captain limps off in agony... and hands the armband to YOU.", opts:[
  {t:"Wear it like you were born for it", attr:"phy", base:50, ok:{dr:0.45,txt:"You organize, you demand, you LEAD. The team grows around you."}, ko:{dr:-0.2,txt:"The weight of it flattens your own game."}},
  {t:"Lead quietly — let your play talk", attr:"dri", base:55, ok:{dr:0.35,txt:"No shouting. Just standards. It spreads."}, ko:{dr:-0.15,txt:"The team needed a voice tonight."}},
  {t:"Rally the team with a huddle", attr:"pas", base:52, ok:{dr:0.35,txt:"Thirty seconds of words. Ninety minutes of fight."}, ko:{dr:-0.1,txt:"The huddle was awkward. The intent was pure."}}]},
{grp:"ANY", txt:"Injury time corner. Your goalkeeper is UP for it. Absolutely everything on this...", opts:[
  {t:"Rise above the chaos", attr:"phy", base:36, ok:{g:1,dr:0.5,txt:"PANDEMONIUM! You score in a box containing eleven defenders and your own goalkeeper!"}, ko:{dr:-0.15,txt:"Headed off the line. So close to legend."}},
  {t:"Lurk for the scraps", attr:"sho", base:33, ok:{g:1,dr:0.45,txt:"It falls to you in the mess — SCENES! LIMBS! BEDLAM!"}, ko:{dr:-0.15,txt:"The scramble ends with a whistle."}},
  {t:"Guard the counter — someone has to", attr:"pac", base:75, ok:{dr:0.2,txt:"They break — but you are there. Last-gasp professionalism."}, ko:{dr:-0.2,txt:"They clear it long and the whistle blows."}}]}
);
