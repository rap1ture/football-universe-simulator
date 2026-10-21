"use strict";
/* ===== NATIONS ===== [id, name, rating, confed, namePool] */
const NATIONS = [
["ARG","Argentina",92,"CONMEBOL","latam"],["FRA","France",91,"UEFA","french"],["ESP","Spain",91,"UEFA","spanish"],
["ENG","England",89,"UEFA","english"],["BRA","Brazil",88,"CONMEBOL","brazilian"],["POR","Portugal",88,"UEFA","portuguese"],
["NED","Netherlands",86,"UEFA","dutch"],["GER","Germany",86,"UEFA","german"],["ITA","Italy",84,"UEFA","italian"],
["BEL","Belgium",83,"UEFA","french"],["CRO","Croatia",83,"UEFA","slavic"],["URU","Uruguay",83,"CONMEBOL","latam"],
["MAR","Morocco",83,"CAF","arabic"],["COL","Colombia",82,"CONMEBOL","latam"],["NOR","Norway",81,"UEFA","nordic"],
["DEN","Denmark",80,"UEFA","nordic"],["JPN","Japan",80,"AFC","japanese"],["SUI","Switzerland",79,"UEFA","german"],
["AUT","Austria",79,"UEFA","german"],["MEX","Mexico",79,"CONCACAF","latam"],["TUR","Türkiye",78,"UEFA","turkic"],
["USA","United States",78,"CONCACAF","american"],["SEN","Senegal",78,"CAF","african"],["UKR","Ukraine",77,"UEFA","slavic"],
["EGY","Egypt",77,"CAF","arabic"],["ECU","Ecuador",77,"CONMEBOL","latam"],["KOR","South Korea",77,"AFC","korean"],
["POL","Poland",76,"UEFA","slavic"],["SRB","Serbia",76,"UEFA","slavic"],["CIV","Ivory Coast",76,"CAF","african"],
["ALG","Algeria",76,"CAF","arabic"],["NGA","Nigeria",76,"CAF","african"],["CAN","Canada",76,"CONCACAF","american"],
["SWE","Sweden",75,"UEFA","nordic"],["IRN","Iran",75,"AFC","turkic"],["SCO","Scotland",74,"UEFA","english"],
["CZE","Czechia",74,"UEFA","slavic"],["GEO","Georgia",74,"UEFA","slavic"],["CMR","Cameroon",74,"CAF","african"],
["GHA","Ghana",74,"CAF","african"],["PAR","Paraguay",74,"CONMEBOL","latam"],["HUN","Hungary",73,"UEFA","slavic"],
["GRE","Greece",73,"UEFA","slavic"],["TUN","Tunisia",73,"CAF","arabic"],["CHI","Chile",73,"CONMEBOL","latam"],
["AUS","Australia",73,"AFC","english"],["ROU","Romania",72,"UEFA","slavic"],["WAL","Wales",72,"UEFA","english"],
["MLI","Mali",72,"CAF","african"],["PER","Peru",72,"CONMEBOL","latam"],["KSA","Saudi Arabia",72,"AFC","arabic"],
["CRC","Costa Rica",72,"CONCACAF","latam"],["SVK","Slovakia",71,"UEFA","slavic"],["SVN","Slovenia",71,"UEFA","slavic"],
["VEN","Venezuela",71,"CONMEBOL","latam"],["PAN","Panama",71,"CONCACAF","latam"],["IRL","Ireland",70,"UEFA","english"],
["ALB","Albania",70,"UEFA","slavic"],["JAM","Jamaica",69,"CONCACAF","american"],["ISL","Iceland",69,"UEFA","nordic"],
["RSA","South Africa",68,"CAF","african"],["FIN","Finland",68,"UEFA","nordic"],["QAT","Qatar",68,"AFC","arabic"],
["UZB","Uzbekistan",68,"AFC","turkic"],["HON","Honduras",66,"CONCACAF","latam"],["BOL","Bolivia",65,"CONMEBOL","latam"],
["CHN","China",64,"AFC","chinese"],["IND","India",58,"AFC","indian"],
];
const natById = id => NATIONS.find(n => n[0] === id);
const CONFED_CUPS = { UEFA:"European Championship", CONMEBOL:"Copa América", CONCACAF:"Gold Cup", CAF:"Africa Cup of Nations", AFC:"Asian Cup" };

/* ===== NAME POOLS ===== */
const POOLS = {
english:{f:["Jack","Harry","Oliver","Charlie","Callum","Mason","Lewis","Kyle","Reece","Tyler","Ben","Sam","Joe","Liam","Aaron","Conor"],l:["Smith","Taylor","Walker","Robinson","Clarke","Wright","Hughes","Ward","Barnes","Doyle","Murphy","Kelly","Fletcher","Palmer","Gibson","Shaw"]},
spanish:{f:["Álvaro","Pablo","Iker","Sergio","Adrián","Marco","Dani","Javi","Mikel","Unai","Hugo","Iván","Raúl","Rubén","Diego","Óscar"],l:["García","Fernández","López","Martínez","Sánchez","Torres","Navarro","Moreno","Ortega","Vidal","Serrano","Castro","Rubio","Molina","Herrera","Gil"]},
latam:{f:["Mateo","Santiago","Joaquín","Thiago","Franco","Lucas","Nicolás","Agustín","Facundo","Emiliano","Gonzalo","Ramiro","Lautaro","Bruno","Julián","Enzo"],l:["González","Rodríguez","Acuña","Paredes","Romero","Álvarez","Molina","Correa","Palacios","Montiel","Quintero","Suárez","Cabrera","Ríos","Medina","Aguirre"]},
italian:{f:["Lorenzo","Matteo","Alessandro","Federico","Davide","Marco","Simone","Nicolo","Gabriele","Riccardo","Tommaso","Andrea","Luca","Antonio","Pietro","Giacomo"],l:["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Greco","Conti","Gallo","Mancini","Costa","Rizzo","Moretti","Barbieri"]},
german:{f:["Leon","Lukas","Finn","Jonas","Niklas","Felix","Maximilian","Paul","Tim","Jan","Moritz","Fabian","David","Nico","Erik","Julian"],l:["Müller","Schmidt","Schneider","Fischer","Weber","Wagner","Becker","Hoffmann","Schulz","Koch","Richter","Klein","Wolf","Neumann","Braun","Krüger"]},
french:{f:["Lucas","Hugo","Théo","Enzo","Nathan","Mathis","Killian","Axel","Maxime","Antoine","Jules","Louis","Rayan","Yanis","Amine","Noah"],l:["Martin","Bernard","Dubois","Moreau","Laurent","Lefebvre","Roux","Fournier","Girard","Lambert","Mercier","Faure","Blanc","Gauthier","Chevalier","Perrin"]},
dutch:{f:["Daan","Sem","Lars","Thijs","Jesse","Ruben","Sven","Niels","Bram","Koen","Joost","Wout","Teun","Mees","Gijs","Floris"],l:["de Jong","van Dijk","Bakker","Visser","Smit","Meijer","de Boer","Mulder","Bos","Vos","Peters","Hendriks","van Leeuwen","Dekker","Brouwer","Kuipers"]},
portuguese:{f:["João","Diogo","Tiago","Gonçalo","Rúben","André","Bernardo","Rafael","Nuno","Vasco","Duarte","Afonso","Miguel","Tomás","Francisco","Pedro"],l:["Silva","Santos","Ferreira","Pereira","Oliveira","Costa","Rodrigues","Martins","Sousa","Fonseca","Carvalho","Gomes","Lopes","Marques","Almeida","Ribeiro"]},
brazilian:{f:["Gabriel","Matheus","Vinícius","Guilherme","Lucas","Pedro","Rafael","Kaio","Luan","Ítalo","Wesley","Éverton","Caio","Yuri","Alisson","Murilo"],l:["Silva","Santos","Oliveira","Souza","Lima","Pereira","Ferreira","Costa","Ribeiro","Alves","Nascimento","Araújo","Barbosa","Rocha","Dias","Moreira"]},
american:{f:["Tyler","Brandon","Jordan","Austin","Caleb","Chase","Logan","Dylan","Hunter","Cameron","Trevor","Blake","Cole","Devin","Marcus","Bryce"],l:["Johnson","Williams","Brown","Jones","Miller","Davis","Wilson","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Moore","Lee"]},
african:{f:["Mamadou","Ousmane","Ibrahima","Sadio","Cheikh","Moussa","Abdoulaye","Sekou","Kwame","Kofi","Chidi","Emeka","Tunde","Sipho","Thabo","Femi"],l:["Diallo","Traoré","Ndiaye","Koné","Camara","Cissé","Touré","Keita","Mensah","Boateng","Okafor","Adeyemi","Okeke","Dlamini","Mokoena","Sow"]},
arabic:{f:["Mohamed","Ahmed","Youssef","Omar","Karim","Hamza","Amine","Bilal","Tarek","Walid","Sofiane","Nabil","Rachid","Samir","Zakaria","Ismail"],l:["Hassan","Benali","El Amrani","Bouzid","Mansour","Cherif","Haddad","Saidi","Belkacem","Amrabat","Ziyani","Farouk","Gaber","Salem","Kharja","Idrissi"]},
nordic:{f:["Emil","Oskar","Viktor","Anders","Magnus","Erik","Jesper","Rasmus","Mikkel","Johan","Axel","Filip","Henrik","Kasper","Sander","Elias"],l:["Hansen","Johansson","Andersen","Nielsen","Larsen","Olsen","Berg","Lindqvist","Dahl","Halvorsen","Eriksen","Nygaard","Sørensen","Lund","Holm","Bakke"]},
slavic:{f:["Luka","Marko","Nikola","Ivan","Petar","Milan","Andrej","Filip","Jakub","Tomáš","Mateusz","Kacper","Dawid","Bohdan","Giorgi","Levan"],l:["Kovačević","Jovanović","Horvat","Novak","Petrović","Kowalski","Nowak","Zieliński","Shevchenko","Kravets","Dvořák","Svoboda","Varga","Papadopoulos","Kvaratskhelia","Beridze"]},
turkic:{f:["Emre","Mert","Burak","Arda","Cenk","Kaan","Ozan","Yusuf","Ali","Reza","Sardor","Timur","Deniz","Hakan","Umut","Berat"],l:["Yılmaz","Kaya","Demir","Şahin","Çelik","Aydın","Öztürk","Arslan","Doğan","Hosseini","Ahmadi","Karimov","Rustamov","Aliyev","Koç","Erdem"]},
japanese:{f:["Haruto","Yuto","Sota","Riku","Kaito","Ren","Daiki","Takumi","Kenta","Shota","Hiroto","Yuma","Kazuki","Ryo","Itsuki","Minato"],l:["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Yamada","Sasaki","Endo","Kubo","Mitoma"]},
korean:{f:["Min-jun","Seo-jun","Do-yun","Ji-ho","Ha-jun","Ju-won","Si-woo","Ye-jun","Jun-seo","Eun-woo","Tae-yang","Kang-min","Sung-min","Hyun-woo","Dong-hyun","Ji-sung"],l:["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoon","Jang","Lim","Han","Oh","Seo","Shin","Kwon","Hwang"]},
chinese:{f:["Wei","Hao","Jun","Lei","Ming","Tao","Feng","Jian","Bo","Chao","Long","Peng","Xin","Yang","Zhi","Kai"],l:["Wang","Li","Zhang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou","Xu","Sun","Ma","Zhu","Hu","Guo"]},
indian:{f:["Arjun","Rohan","Vikram","Rahul","Aditya","Karan","Sanjay","Ravi","Nikhil","Aman","Dev","Ishaan","Kabir","Vivek","Raj","Sunil"],l:["Sharma","Singh","Patel","Kumar","Chhetri","Reddy","Nair","Das","Bhutia","Verma","Rao","Mehta","Gupta","Joshi","Malik","Pillai"]},
};
function genName(pool) {
  const p = POOLS[pool] || POOLS.english;
  return pick(p.f) + " " + pick(p.l);
}
function natPool(natId) { const n = natById(natId); return n ? n[4] : "english"; }

/* ===== ACADEMIES ===== club must exist in LEAGUES */
const ACADEMIES = [
{name:"La Masia", club:"Barcelona", q:5},
{name:"La Fábrica", club:"Real Madrid", q:5},
{name:"Ajax Youth Academy", club:"Ajax", q:5},
{name:"Carrington Academy", club:"Manchester United", q:5},
{name:"City Football Academy", club:"Manchester City", q:5},
{name:"Cobham Academy", club:"Chelsea", q:5},
{name:"Hale End", club:"Arsenal", q:5},
{name:"FC Bayern Campus", club:"Bayern München", q:5},
{name:"BVB Youth Academy", club:"Borussia Dortmund", q:5},
{name:"PSG Academy", club:"Paris Saint-Germain", q:5},
{name:"Benfica Campus", club:"Benfica", q:5},
{name:"Sporting Academy", club:"Sporting CP", q:5},
{name:"Lezama", club:"Athletic Club", q:4},
{name:"Zubieta", club:"Real Sociedad", q:4},
{name:"OL Academy", club:"Lyon", q:4},
{name:"Rennes Academy", club:"Rennes", q:4},
{name:"Atalanta Academy", club:"Atalanta", q:4},
{name:"Casa do Dragão", club:"Porto", q:4},
{name:"River Plate Academy", club:"River Plate", q:4},
{name:"Boca Juniors Academy", club:"Boca Juniors", q:4},
{name:"Meninos da Vila", club:"Santos", q:4},
{name:"Cotia Academy", club:"São Paulo", q:4},
{name:"Ninho do Urubu", club:"Flamengo", q:4},
{name:"Palmeiras Academy", club:"Palmeiras", q:4},
{name:"Southampton Academy", club:"Southampton", q:3},
{name:"Knappenschmiede", club:"Schalke 04", q:3},
{name:"Empoli Youth", club:"Empoli", q:3},
{name:"FC Dallas Academy", club:"FC Dallas", q:3},
{name:"Union Academy", club:"Philadelphia Union", q:3},
{name:"NYCFC Academy", club:"New York City FC", q:3},
{name:"Vélez Academy", club:"Vélez Sarsfield", q:3},
{name:"Newell's Academy", club:"Newell's Old Boys", q:3},
];

/* ===== WORLD STARS (compete for awards) ===== [name,pos,nat,age,rating,club] */
const STARS_SEED = [
["Kylian Mbappé","ST","FRA",27,92,"Real Madrid"],["Erling Haaland","ST","NOR",26,91,"Manchester City"],
["Jude Bellingham","CAM","ENG",23,90,"Real Madrid"],["Lamine Yamal","W","ESP",19,91,"Barcelona"],
["Vinícius Júnior","W","BRA",26,89,"Real Madrid"],["Rodri","CDM","ESP",30,89,"Manchester City"],
["Florian Wirtz","CAM","GER",23,88,"Liverpool"],["Jamal Musiala","CAM","GER",23,88,"Bayern München"],
["Bukayo Saka","W","ENG",25,87,"Arsenal"],["Cole Palmer","CAM","ENG",24,87,"Chelsea"],
["Pedri","CM","ESP",24,88,"Barcelona"],["Harry Kane","ST","ENG",33,88,"Bayern München"],
["Mohamed Salah","W","EGY",34,87,"Liverpool"],["Ousmane Dembélé","W","FRA",29,88,"Paris Saint-Germain"],
["Raphinha","W","BRA",30,87,"Barcelona"],["Achraf Hakimi","FB","MAR",28,87,"Paris Saint-Germain"],
["Virgil van Dijk","CB","NED",35,86,"Liverpool"],["Declan Rice","CDM","ENG",27,86,"Arsenal"],
["Federico Valverde","CM","URU",28,87,"Real Madrid"],["Aurélien Tchouaméni","CDM","FRA",26,85,"Real Madrid"],
["Vitinha","CM","POR",26,87,"Paris Saint-Germain"],["Nuno Mendes","FB","POR",24,86,"Paris Saint-Germain"],
["Gianluigi Donnarumma","GK","ITA",27,88,"Manchester City"],["Thibaut Courtois","GK","BEL",34,88,"Real Madrid"],
["Alisson Becker","GK","BRA",33,87,"Liverpool"],["Lautaro Martínez","ST","ARG",29,87,"Inter"],
["Julián Álvarez","ST","ARG",26,88,"Atlético Madrid"],["Enzo Fernández","CM","ARG",25,85,"Chelsea"],
["Alexis Mac Allister","CM","ARG",27,86,"Liverpool"],["Victor Osimhen","ST","NGA",27,86,"Galatasaray"],
["Khvicha Kvaratskhelia","W","GEO",25,86,"Paris Saint-Germain"],["Kenan Yıldız","CAM","TUR",21,85,"Juventus"],
["Arda Güler","CAM","TUR",21,86,"Real Madrid"],["Viktor Gyökeres","ST","SWE",28,86,"Arsenal"],
["Alexander Isak","ST","SWE",26,88,"Liverpool"],["Michael Olise","W","FRA",24,87,"Bayern München"],
["Désiré Doué","W","FRA",21,86,"Paris Saint-Germain"],["Estêvão","W","BRA",19,85,"Chelsea"],
["Endrick","ST","BRA",20,83,"Real Madrid"],["Franco Mastantuono","CAM","ARG",19,84,"Real Madrid"],
["Pau Cubarsí","CB","ESP",19,85,"Barcelona"],["Gavi","CM","ESP",22,85,"Barcelona"],
["William Saliba","CB","FRA",25,87,"Arsenal"],["Rúben Dias","CB","POR",29,86,"Manchester City"],
["Antonio Rüdiger","CB","GER",33,84,"Real Madrid"],["Son Heung-min","W","KOR",34,84,"LAFC"],
["Lionel Messi","CAM","ARG",39,85,"Inter Miami"],["Takefusa Kubo","W","JPN",25,84,"Real Sociedad"],
];

/* ===== POSITIONS ===== */
const POSITIONS = ["GK","CB","FB","CDM","CM","CAM","W","ST"];
const POS_INFO = {
GK:{name:"Goalkeeper", ico:"🧤", grp:"GK", w:{pac:.20,sho:.16,pas:.10,dri:.24,def:.20,phy:.10}, gShare:0.00, aShare:0.01},
CB:{name:"Centre-Back", ico:"🛡️", grp:"DEF", w:{pac:.12,sho:.02,pas:.10,dri:.06,def:.44,phy:.26}, gShare:0.05, aShare:0.03},
FB:{name:"Full-Back", ico:"🏃", grp:"DEF", w:{pac:.24,sho:.04,pas:.16,dri:.14,def:.26,phy:.16}, gShare:0.05, aShare:0.13},
CDM:{name:"Defensive Mid", ico:"⚓", grp:"MID", w:{pac:.08,sho:.04,pas:.22,dri:.10,def:.34,phy:.22}, gShare:0.06, aShare:0.10},
CM:{name:"Central Mid", ico:"🎯", grp:"MID", w:{pac:.10,sho:.12,pas:.30,dri:.20,def:.12,phy:.16}, gShare:0.12, aShare:0.18},
CAM:{name:"Attacking Mid", ico:"✨", grp:"ATT", w:{pac:.12,sho:.20,pas:.28,dri:.26,def:.04,phy:.10}, gShare:0.22, aShare:0.26},
W:{name:"Winger", ico:"⚡", grp:"ATT", w:{pac:.26,sho:.20,pas:.16,dri:.26,def:.02,phy:.10}, gShare:0.28, aShare:0.26},
ST:{name:"Striker", ico:"🎯", grp:"ATT", w:{pac:.22,sho:.32,pas:.10,dri:.20,def:.02,phy:.14}, gShare:0.40, aShare:0.15},
};
const ATTR_KEYS = ["pac","sho","pas","dri","def","phy"];
const ATTR_LABELS = {pac:"Pace", sho:"Shooting", pas:"Passing", dri:"Dribbling", def:"Defending", phy:"Physical"};
const GK_LABELS  = {pac:"Diving", sho:"Handling", pas:"Kicking", dri:"Reflexes", def:"Positioning", phy:"Presence"};

/* ===== DIFFICULTIES ===== */
const DIFFS = {
easy:  {label:"Wonderkid",  ico:"🌟", growth:1.15, moment:8,  potMin:86, potMax:99, startBoost:6,  offer:1.3, desc:"Born gifted. Fast growth, generous chances. For a relaxed power-fantasy run."},
normal:{label:"Rising Star",ico:"⚽", growth:1.00, moment:0,  potMin:79, potMax:96, startBoost:0,  offer:1.0, desc:"The balanced experience. Work hard, get rewarded."},
hard:  {label:"Hard Road",  ico:"🔥", growth:0.86, moment:-6, potMin:74, potMax:92, startBoost:-3, offer:0.8, desc:"Slow growth, tough managers, fewer chances. Earn everything."},
legend:{label:"Road to GOAT",ico:"💀", growth:0.72, moment:-11,potMin:70, potMax:90, startBoost:-6, offer:0.6, desc:"Brutal. Most careers end in Serie C. Becoming a legend here means everything."},
};

/* ===== MATCH MOMENTS ===== grp: ATT/MID/DEF/GK/ANY */
const MOMENTS = [
{grp:"ATT", txt:"You're through — ONE-ON-ONE with the keeper!", opts:[
  {t:"Finesse it into the corner", attr:"sho", base:56, ok:{g:1,dr:0,txt:"Cool as ice — bottom corner! GOAL!"}, ko:{dr:-0.35,txt:"The keeper reads it and palms it away."}},
  {t:"Chip the keeper", attr:"dri", base:38, ok:{g:1,dr:0.25,txt:"OUTRAGEOUS! A delicate chip floats in — the crowd goes wild!"}, ko:{dr:-0.45,txt:"Too much on it... it sails over. The fans groan."}},
  {t:"Square it to your teammate", attr:"pas", base:62, ok:{a:1,dr:0,txt:"Unselfish! Your teammate taps it in — assist!"}, ko:{dr:-0.3,txt:"The pass is cut out by a recovering defender."}}]},
{grp:"ATT", txt:"The ball breaks loose at the edge of the box!", opts:[
  {t:"Rip a first-time shot", attr:"sho", base:42, ok:{g:1,dr:0.15,txt:"THUNDERBOLT! Top corner — what a strike!"}, ko:{dr:-0.3,txt:"Blazed over the bar."}},
  {t:"Take a touch and dribble in", attr:"dri", base:48, ok:{g:1,dr:0.1,txt:"You glide past two and slot it home!"}, ko:{dr:-0.35,txt:"Crowded out — possession lost."}},
  {t:"Lay it off and keep the move alive", attr:"pas", base:70, ok:{dr:0.3,txt:"Smart recycle — the move continues and the crowd applauds."}, ko:{dr:-0.2,txt:"Sloppy pass, the attack breaks down."}}]},
{grp:"ATT", txt:"You're free on the flank, full-back backing off...", opts:[
  {t:"Whip in a cross", attr:"pas", base:52, ok:{a:1,dr:0,txt:"Inch-perfect cross — headed home! Assist!"}, ko:{dr:-0.25,txt:"Overhit. Out for a goal kick."}},
  {t:"Cut inside and curl one", attr:"sho", base:40, ok:{g:1,dr:0.2,txt:"Cut in, curled... TOP BINS!"}, ko:{dr:-0.3,txt:"Curled just wide of the far post."}},
  {t:"Take him on to the byline", attr:"dri", base:55, ok:{a:1,dr:0.1,txt:"Burned him! Pull-back is smashed in — assist!"}, ko:{dr:-0.3,txt:"Tackled — the counter goes the other way."}}]},
{grp:"ATT", txt:"COUNTER-ATTACK! You lead a 3-on-2 break!", opts:[
  {t:"Slide the through ball", attr:"pas", base:58, ok:{a:1,dr:0.1,txt:"Perfectly weighted — finished! What a counter!"}, ko:{dr:-0.3,txt:"A defender stretches and intercepts."}},
  {t:"Go it alone", attr:"dri", base:40, ok:{g:1,dr:0.25,txt:"You take on both defenders AND the keeper — sensational solo goal!"}, ko:{dr:-0.45,txt:"Greedy! You run into traffic and lose it."}},
  {t:"Slow it down, keep the ball", attr:"pas", base:75, ok:{dr:0.2,txt:"Tempo controlled. Your manager nods approvingly."}, ko:{dr:-0.15,txt:"Hesitation kills the chance."}}]},
{grp:"ATT", txt:"Free kick, 23 yards out. You place the ball down...", opts:[
  {t:"Go for the top corner", attr:"sho", base:32, ok:{g:1,dr:0.35,txt:"UP AND OVER THE WALL — POSTAGE STAMP! Free-kick masterclass!"}, ko:{dr:-0.2,txt:"Into the wall."}},
  {t:"Clip it to the far post", attr:"pas", base:50, ok:{a:1,dr:0.05,txt:"Flighted beautifully — nodded in at the far post!"}, ko:{dr:-0.15,txt:"Claimed by the keeper."}},
  {t:"Short pass, work the angle", attr:"pas", base:72, ok:{dr:0.15,txt:"Possession kept, pressure builds."}, ko:{dr:-0.1,txt:"The routine fizzles out."}}]},
{grp:"ATT", txt:"PENALTY! You grab the ball. The stadium holds its breath...", opts:[
  {t:"Smash it down the middle", attr:"sho", base:62, ok:{g:1,dr:0.1,txt:"The keeper dives — you roof it down the middle! GOAL!"}, ko:{dr:-0.5,txt:"He stood still and caught it. Nightmare."}},
  {t:"Place it in the corner", attr:"sho", base:68, ok:{g:1,dr:0,txt:"Sent the keeper the wrong way. Ice cold."}, ko:{dr:-0.5,txt:"Saved! The keeper guessed right."}},
  {t:"Panenka.", attr:"dri", base:38, ok:{g:1,dr:0.4,txt:"PANENKA! Absolute disrespect. The internet explodes."}, ko:{dr:-0.7,txt:"He didn't move. Caught like a training drill. Humiliating."}}]},
{grp:"MID", txt:"You find a pocket of space between the lines...", opts:[
  {t:"Turn and drive at the defence", attr:"dri", base:50, ok:{a:1,dr:0.15,txt:"You surge forward and slip in the striker — assist!"}, ko:{dr:-0.25,txt:"Dispossessed from behind."}},
  {t:"Switch play with a raking ball", attr:"pas", base:60, ok:{dr:0.35,txt:"60-yard switch, right onto the winger's laces. Elite vision."}, ko:{dr:-0.2,txt:"Overcooked into touch."}},
  {t:"Shoot from distance", attr:"sho", base:30, ok:{g:1,dr:0.3,txt:"SCREAMER FROM 28 YARDS! That's a worldie!"}, ko:{dr:-0.25,txt:"Row Z."}}]},
{grp:"MID", txt:"Their playmaker is running the game. The bench looks at you.", opts:[
  {t:"Man-mark him out of it", attr:"def", base:55, ok:{dr:0.4,txt:"You put him in your pocket. Their attack goes quiet."}, ko:{dr:-0.3,txt:"He spins you and creates a chance."}},
  {t:"Press aggressively and win it high", attr:"phy", base:48, ok:{a:1,dr:0.2,txt:"You rob him high up and set up a goal!"}, ko:{dr:-0.3,card:"y",txt:"Mistimed lunge — booked."}},
  {t:"Hold your position, stay compact", attr:"def", base:70, ok:{dr:0.2,txt:"Disciplined shift. The gaps never open."}, ko:{dr:-0.15,txt:"He plays around you all night."}}]},
{grp:"DEF", txt:"Their striker is in behind — YOU'RE THE LAST MAN!", opts:[
  {t:"Slide tackle", attr:"def", base:52, ok:{dr:0.45,txt:"PERFECT slide tackle! The crowd roars like it's a goal!"}, ko:{og:1,dr:-0.6,txt:"You miss it — he goes through and scores."}},
  {t:"Jockey and force him wide", attr:"pac", base:60, ok:{dr:0.3,txt:"You show him the corner flag. Danger averted."}, ko:{og:1,dr:-0.5,txt:"He cuts back inside and finishes."}},
  {t:"Take him down. Take the card.", attr:"phy", base:80, ok:{card:"y",dr:-0.1,txt:"Cynical. Booked. But the danger is dead."}, ko:{card:"r",dr:-1.2,txt:"The ref reaches for his pocket... IT'S RED. Off you go."}}]},
{grp:"DEF", txt:"Corner swings in — bodies everywhere!", opts:[
  {t:"Attack the ball and clear it", attr:"phy", base:60, ok:{dr:0.3,txt:"Commanding header away. Like a wall."}, ko:{og:1,dr:-0.4,txt:"You misjudge the flight — their man nods in."}},
  {t:"Track the runner", attr:"def", base:62, ok:{dr:0.25,txt:"Glued to your man. Nothing comes of it."}, ko:{dr:-0.3,txt:"He loses you but heads wide. Heart in mouth."}},
  {t:"Stay for the counter", attr:"pac", base:45, ok:{a:1,dr:0.2,txt:"Cleared long — you race away and square for a goal!"}, ko:{dr:-0.2,txt:"The gamble leaves a gap and the box is chaos."}}]},
{grp:"DEF", txt:"Tricky winger runs at you, stepovers flashing...", opts:[
  {t:"Time a standing tackle", attr:"def", base:55, ok:{dr:0.35,txt:"Won it clean. He stays down theatrically — the ref waves play on."}, ko:{dr:-0.35,txt:"He skips past like you're a cone."}},
  {t:"Show him onto his weak foot", attr:"pac", base:65, ok:{dr:0.25,txt:"Smart defending. His shot is tame."}, ko:{dr:-0.25,txt:"His 'weak' foot is a rocket. Corner conceded."}},
  {t:"Shoulder-to-shoulder muscle", attr:"phy", base:50, ok:{dr:0.3,txt:"Bullied him off it. Textbook strength."}, ko:{card:"y",dr:-0.3,txt:"Free kick and a booking."}}]},
{grp:"GK", txt:"Their striker is clean through on your goal!", opts:[
  {t:"Rush out to smother", attr:"pac", base:48, ok:{dr:0.5,txt:"You're out like lightning — smothered at his feet!"}, ko:{og:1,dr:-0.5,txt:"He dinks it over you. Cruel."}},
  {t:"Stand big, force the mistake", attr:"def", base:55, ok:{dr:0.45,txt:"You spread yourself huge and he panics — wide!"}, ko:{og:1,dr:-0.45,txt:"He picks his spot. No chance."}}]},
{grp:"GK", txt:"A dipping rocket heads for your top corner!", opts:[
  {t:"Full-stretch fingertip dive", attr:"dri", base:50, ok:{dr:0.55,txt:"WHAT A SAVE! Fingertips onto the bar — world class!"}, ko:{og:1,dr:-0.4,txt:"Beyond your reach. Postage stamp."}},
  {t:"Two strong hands", attr:"sho", base:44, ok:{dr:0.45,txt:"Caught it clean. Confidence radiates."}, ko:{og:1,dr:-0.5,txt:"It squirms through your gloves... disaster."}}]},
{grp:"GK", txt:"PENALTY against you. You bounce on your line...", opts:[
  {t:"Dive to your favourite side", attr:"dri", base:38, ok:{dr:0.7,txt:"SAVED! You guessed right and the stadium erupts!"}, ko:{og:1,dr:-0.15,txt:"Wrong way. Can't fault you."}},
  {t:"Read the run-up, react late", attr:"def", base:34, ok:{dr:0.8,txt:"You wait... and CLAW it off the line! Heroic!"}, ko:{og:1,dr:-0.15,txt:"Too quick to react to."}},
  {t:"Mind games — delay, chat, point", attr:"phy", base:30, ok:{dr:0.7,txt:"He's rattled — blazes it over! The dark arts pay off!"}, ko:{og:1,dr:-0.25,card:"y",txt:"Booked for time-wasting, and he scores anyway."}}]},
{grp:"ANY", txt:"Last minute set piece — everyone's forward, including you!", opts:[
  {t:"Attack the near post", attr:"phy", base:38, ok:{g:1,dr:0.4,txt:"YOU RISE HIGHEST! A bullet header in the dying seconds!"}, ko:{dr:-0.15,txt:"Flicked off your head, just wide."}},
  {t:"Lurk on the edge for the second ball", attr:"sho", base:33, ok:{g:1,dr:0.4,txt:"It drops to you... HALF-VOLLEY! SCENES!"}, ko:{dr:-0.15,txt:"The bounce beats you."}},
  {t:"Stay back, guard the counter", attr:"def", base:75, ok:{dr:0.15,txt:"Sensible. The point is safe."}, ko:{dr:-0.1,txt:"Nothing happens."}}]},
];

/* ===== SHOP ===== */
const SHOP_ITEMS = [
{id:"setup", ico:"🎮", name:"Gaming Setup", cost:5e3, desc:"+1 morale/week", fx:{moraleWk:1}},
{id:"watch", ico:"⌚", name:"Luxury Watch", cost:25e3, desc:"+2K followers/week", fx:{folWk:2e3}},
{id:"dog", ico:"🐕", name:"Loyal Dog", cost:3e3, desc:"+1 morale/week", fx:{moraleWk:1}},
{id:"car1", ico:"🚗", name:"Hot Hatch", cost:60e3, desc:"+1 morale/week", fx:{moraleWk:1}},
{id:"car2", ico:"🏎️", name:"Supercar", cost:450e3, desc:"+5K followers/wk, +1 morale", fx:{folWk:5e3, moraleWk:1}},
{id:"car3", ico:"🚀", name:"Hypercar", cost:2.8e6, desc:"+15K followers/wk, +1 morale", fx:{folWk:15e3, moraleWk:1}},
{id:"apt", ico:"🏙️", name:"City Apartment", cost:350e3, desc:"+1 energy/week", fx:{energyWk:1}},
{id:"villa", ico:"🏡", name:"Villa", cost:4e6, desc:"+2 energy/week", fx:{energyWk:2}},
{id:"mansion", ico:"🏰", name:"Mansion", cost:20e6, desc:"+3 energy, +1 morale/week", fx:{energyWk:3, moraleWk:1}},
{id:"yacht", ico:"🛥️", name:"Yacht", cost:9e6, desc:"+2 morale/week, +10K followers/wk", fx:{moraleWk:2, folWk:10e3}},
{id:"jet", ico:"✈️", name:"Private Jet", cost:35e6, desc:"+2 energy, +1 morale/week", fx:{energyWk:2, moraleWk:1}},
{id:"chef", ico:"🥗", name:"Personal Chef", cost:120e3, desc:"+1 energy/week, -10% injuries", fx:{energyWk:1, injMult:0.9}},
{id:"pod", ico:"🧊", name:"Recovery Pod", cost:250e3, desc:"-20% injury risk", fx:{injMult:0.8}},
{id:"physio", ico:"🩺", name:"Private Physio Team", cost:800e3, desc:"-35% injury risk", fx:{injMult:0.65}},
{id:"charity", ico:"🎗️", name:"Charity Foundation", cost:1.5e6, desc:"+5 reputation, +200K followers", fx:{repOnce:5, folOnce:200e3}},
{id:"pitch", ico:"🏟️", name:"Youth Pitches Back Home", cost:5e6, desc:"+8 reputation. A legacy beyond football.", fx:{repOnce:8, legacy:3}},
];

/* ===== SPONSORS ===== */
const SPONSORS = [
{id:"local", rep:15, name:"Local Kit Shop", ico:"🏪", weekly:300, folWk:200, bonus:2e3},
{id:"pantera", rep:32, name:"Pantera Boots", ico:"🐆", weekly:2e3, folWk:2e3, bonus:25e3},
{id:"aero", rep:48, name:"AeroStrike", ico:"🦅", weekly:10e3, folWk:8e3, bonus:250e3},
{id:"vortex", rep:64, name:"Vortex Elite", ico:"🌀", weekly:45e3, folWk:25e3, bonus:1.5e6},
{id:"icon", rep:80, name:"Vortex ICON (signature line)", ico:"👑", weekly:150e3, folWk:80e3, bonus:8e6},
];

/* ===== AGENTS ===== */
const AGENTS = [
{id:"cousin", name:"Your Cousin Dave", ico:"🧢", cut:0, quality:0.85, rep:0, desc:"Free, enthusiastic, clueless. Offers are hit and miss."},
{id:"pro", name:"ProSport Management", ico:"💼", cut:3, quality:1.0, rep:22, desc:"3% of wages. Solid professional network."},
{id:"elite", name:"Elite XI Agency", ico:"🦈", cut:6, quality:1.25, rep:52, desc:"6% of wages. Superagent. Best clubs, best sponsors (+50% sponsor income)."},
];

/* ===== RANDOM LIFE EVENTS ===== */
const LIFE_EVENTS = [
{id:"interview", txt:"A journalist corners you after training: “Are you the future of this club?”", opts:[
 {t:"“I'm just focused on the team.”", fx:{morale:2, rep:1}, r:"Classy answer. The manager approves."},
 {t:"“Honestly? Yes. And more.”", fx:{rep:3, followers:8e3, morale:-1, trust:-4}, r:"Headlines everywhere. The dressing room raises eyebrows."},
 {t:"Refuse to answer", fx:{rep:-1}, r:"“Mysterious talent snubs press.” Meh."}]},
{id:"gaming", txt:"Teammates invite you to an all-night gaming session before matchday.", opts:[
 {t:"Join them — squad bonding!", fx:{morale:4, energy:-12, trust:2}, r:"Great laughs. You're exhausted, but the boys love you."},
 {t:"One hour, then sleep", fx:{morale:2, energy:-3}, r:"Balanced. Very professional."},
 {t:"Decline and do recovery", fx:{energy:6, morale:-2}, r:"Fresh legs, but they call you 'the robot' now."}]},
{id:"viral", txt:"A training-ground trick shot of yours is going viral!", opts:[
 {t:"Post it everywhere", fx:{followers:30e3, rep:2}, r:"The clip explodes. Your DMs are chaos."},
 {t:"Stay humble, let it ride", fx:{followers:8e3, morale:2}, r:"The mystery adds to the aura."}]},
{id:"nutrition", txt:"The club nutritionist offers you a strict personalized meal plan.", opts:[
 {t:"Commit fully", fx:{energy:8, morale:-2}, r:"Bland food, incredible body."},
 {t:"Weekdays only", fx:{energy:3}, r:"A sensible compromise."},
 {t:"“I'm young, I eat what I want.”", fx:{morale:3, energy:-4}, r:"The burgers are delicious. The fitness coach sighs."}]},
{id:"hometown", txt:"Your old grassroots club asks you to visit the kids' training day.", opts:[
 {t:"Show up with signed shirts", fx:{rep:3, morale:4, money:-2e3, followers:5e3}, r:"The kids lose their minds. Wholesome scenes."},
 {t:"Send a video message", fx:{rep:1, morale:1}, r:"Nice touch, less impact."}]},
{id:"barber", txt:"Your barber suggests something... experimental... before the TV match.", opts:[
 {t:"Trust the process", fx:{followers:20e3, morale:3, rep:-1}, r:"The haircut trends worldwide. Pundits are furious. You love it."},
 {t:"Keep it classic", fx:{morale:1}, r:"Sharp and safe."}]},
{id:"media_bait", txt:"A pundit says you're “overrated and lazy” on national TV.", opts:[
 {t:"Reply with stats on social media", fx:{followers:25e3, morale:2, trust:-3}, r:"You cooked him. The club's media officer is stressed."},
 {t:"Let your football talk", fx:{morale:3, trust:3}, r:"Silence is power. Next goal celebration: hand cupped to ear."},
 {t:"Lose sleep over it", fx:{morale:-5}, r:"It gets in your head. Shake it off."}]},
{id:"rondo", txt:"You get megged twice in the rondo and the whole squad is howling.", opts:[
 {t:"Laugh it off", fx:{morale:3, trust:2}, r:"Good vibes. Team chemistry up."},
 {t:"Demand to go again, stay late", fx:{energy:-4, morale:1}, r:"You win the next three rondos. Respect earned."}]},
{id:"family", txt:"Your family flies in to watch you this weekend.", opts:[
 {t:"Spend the day with them", fx:{morale:6, energy:-2}, r:"Home-cooked food and hugs. Recharged in the soul."},
 {t:"Quick dinner, early night", fx:{morale:3, energy:2}, r:"Professional and loving."}]},
{id:"charity_ask", txt:"A local hospital asks you to visit sick kids on your day off.", opts:[
 {t:"Go, and stay all afternoon", fx:{rep:4, morale:5, followers:10e3}, r:"You leave with a full heart and a wall of drawings."},
 {t:"Politely decline — you need rest", fx:{energy:5, morale:-2}, r:"Understandable. Still stings a bit."}]},
{id:"boots", txt:"Your boots split in training. The kit man offers a fresh pair of an unfamiliar brand.", opts:[
 {t:"Try the new brand", fx:{morale:1}, r:"Actually... they're amazing?"},
 {t:"Superstition! Repair the old ones", fx:{morale:2}, r:"Taped up and lucky as ever."}]},
{id:"sleep", txt:"A sports scientist offers to overhaul your sleep schedule.", opts:[
 {t:"Full 10pm lights-out protocol", fx:{energy:8, morale:-1}, r:"You wake up feeling superhuman."},
 {t:"Ignore it", fx:{morale:1}, r:"You do you."}]},
{id:"fan", txt:"A young fan waits 3 hours in the rain for your autograph.", opts:[
 {t:"Autograph, photo, and your jacket", fx:{rep:3, followers:15e3, morale:3, money:-500}, r:"The moment goes viral. Pure class."},
 {t:"Quick signature", fx:{rep:1}, r:"Still made their year."}]},
{id:"language", txt:"Struggling with the local language at your club?", cond:"abroad", opts:[
 {t:"Hire a tutor, grind it", fx:{money:-5e3, trust:5, morale:2}, r:"Your first full interview in the local language wins everyone over."},
 {t:"Get by with football English", fx:{}, r:"Football is a universal language anyway."}]},
{id:"poker", txt:"Big card game on the team bus. Stakes are getting silly.", opts:[
 {t:"Go all in", fx:{moneyPct:0.02, morale:2}, r:"The stakes get silly enough to make the kitman sweat...", gamble:true},
 {t:"Fold and watch", fx:{morale:1}, r:"Entertainment without the risk."}]},
{id:"trainer", txt:"An old-school fitness coach offers brutal extra sessions at dawn.", opts:[
 {t:"Every morning for a month", fx:{energy:-8, xp:"phy", morale:-1}, r:"Agony. But you feel yourself getting stronger. (+Physical)"},
 {t:"Twice a week", fx:{energy:-3, xpHalf:"phy"}, r:"Sustainable gains. (+Physical)"},
 {t:"Hard pass", fx:{energy:2}, r:"5am is not a real time."}]},
{id:"derby_talk", txt:"Rival fans mock you in the street before the big derby.", opts:[
 {t:"Smile and wave", fx:{morale:2}, r:"Unbothered. Elite mentality."},
 {t:"“See you on Saturday.”", fx:{morale:3, rep:1}, r:"The clip gets 2M views. Pressure's on now."}]},
{id:"contract_leak", txt:"Your salary leaks to the press and teammates are gossiping.", cond:"pro", opts:[
 {t:"Address the dressing room directly", fx:{trust:4, morale:1}, r:"Honesty wins. Squad respect grows."},
 {t:"Ignore it", fx:{trust:-2, morale:-1}, r:"It blows over... slowly."}]},
{id:"streamer", txt:"A famous streamer invites you for a charity FIFA stream.", opts:[
 {t:"Accept — content time", fx:{followers:60e3, morale:3, energy:-3}, r:"You lose 5-1 on stream. The clip is legendary anyway."},
 {t:"Decline politely", fx:{energy:2}, r:"Focus mode."}]},
{id:"tattoo", txt:"Thinking about your first big tattoo...", opts:[
 {t:"Full sleeve. Lions. Clocks. Roses.", fx:{followers:12e3, morale:3, money:-3e3}, r:"It's beautiful and slightly excessive. Very footballer."},
 {t:"Small tribute to family", fx:{morale:4, money:-500}, r:"Meaningful ink."},
 {t:"Stay clean", fx:{}, r:"Your grandma is delighted."}]},
];

/* ===== ACHIEVEMENTS ===== */
const ACHIEVEMENTS = [
{id:"debut", ico:"👟", name:"First Steps", desc:"Make your professional debut"},
{id:"teen_debut", ico:"🍼", name:"Prodigy", desc:"Pro debut at 16 or younger"},
{id:"first_goal", ico:"⚽", name:"Off the Mark", desc:"Score your first professional goal"},
{id:"first_assist", ico:"🎁", name:"Provider", desc:"Register your first assist"},
{id:"hattrick", ico:"🎩", name:"Hat-Trick Hero", desc:"Score 3 goals in one match"},
{id:"poker", ico:"🃏", name:"Poker!", desc:"Score 4+ goals in one match"},
{id:"first_trophy", ico:"🏆", name:"Silverware", desc:"Win your first trophy"},
{id:"league_title", ico:"🥇", name:"Champion", desc:"Win a league title"},
{id:"promotion", ico:"🪜", name:"Climbing", desc:"Win promotion with your club"},
{id:"cup_win", ico:"🏅", name:"Cup King", desc:"Win a domestic cup"},
{id:"cl_win", ico:"⭐", name:"Kings of Europe", desc:"Win the Champions League"},
{id:"lib_win", ico:"🌎", name:"La Gloria Eterna", desc:"Win the Copa Libertadores"},
{id:"mls_cup", ico:"🦅", name:"MLS Cup", desc:"Win the MLS Cup"},
{id:"top_scorer", ico:"👑", name:"Golden Boot", desc:"Finish as league top scorer"},
{id:"poty", ico:"🌟", name:"Player of the Year", desc:"Win a league POTY award"},
{id:"golden_boy", ico:"👶", name:"Golden Boy", desc:"Best U21 player in the world"},
{id:"ballon", ico:"🎖️", name:"Ballon d'Or", desc:"Win the Ballon d'Or"},
{id:"ballon3", ico:"💫", name:"Mythical", desc:"Win 3 Ballons d'Or"},
{id:"wc_win", ico:"🌏", name:"World Champion", desc:"Win the World Cup"},
{id:"continental", ico:"🗺️", name:"Continental Glory", desc:"Win a continental title with your nation"},
{id:"caps50", ico:"🦺", name:"National Hero", desc:"Earn 50 senior caps"},
{id:"caps100", ico:"🏛️", name:"Centurion", desc:"Earn 100 senior caps"},
{id:"season30", ico:"🔥", name:"Unstoppable", desc:"Score 30+ goals in a season"},
{id:"goals100", ico:"💯", name:"Century", desc:"100 career goals"},
{id:"goals300", ico:"🚀", name:"Elite Finisher", desc:"300 career goals"},
{id:"goals500", ico:"🐐", name:"All-Timer", desc:"500 career goals"},
{id:"apps600", ico:"🦾", name:"Iron Man", desc:"600 career appearances"},
{id:"transfer100", ico:"💸", name:"Nine Figures", desc:"Move for a €100M+ transfer fee"},
{id:"rich10", ico:"🏦", name:"Set for Life", desc:"Hold €10M+ in the bank"},
{id:"fame10", ico:"📱", name:"Superstar", desc:"Reach 10M followers"},
{id:"fame100", ico:"🌐", name:"Global Icon", desc:"Reach 100M followers"},
{id:"countries3", ico:"🧳", name:"Globetrotter", desc:"Play club football in 3+ countries"},
{id:"oneclub", ico:"❤️", name:"One-Club Loyalty", desc:"Spend 8+ seasons at one club"},
{id:"goat", ico:"🐐", name:"THE GOAT", desc:"Reach legendary legacy status"},
];
