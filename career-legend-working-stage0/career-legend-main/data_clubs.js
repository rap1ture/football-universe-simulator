"use strict";
/* ===== CLUB DATABASE =====
 * teams: [name, rating]
 * tier: division level in that country. up/down: promotion/relegation counts.
 * conf: 'eu' | 'sa' | 'na'   np: name pool for generated players
 */
const LEAGUES = [
{ id:"ENG1", name:"Premier League", country:"England", cc:"ENG", tier:1, conf:"eu", np:"english", down:3, cup:"FA Cup", cup2:"League Cup", slots:{cl:4, el:2, co:1}, teams:[
["Arsenal",86],["Aston Villa",81],["Bournemouth",78],["Brentford",77],["Brighton",79],["Burnley",74],["Chelsea",84],["Crystal Palace",78],["Everton",77],["Fulham",77],["Leeds United",75],["Liverpool",87],["Manchester City",87],["Manchester United",80],["Newcastle United",82],["Nottingham Forest",78],["Sunderland",74],["Tottenham Hotspur",81],["West Ham United",77],["Wolves",76]]},
{ id:"ENG2", name:"Championship", country:"England", cc:"ENG", tier:2, conf:"eu", np:"english", up:3, down:3, playoff:[3,6], cup:"FA Cup", cup2:"League Cup", teams:[
["Birmingham City",70],["Blackburn Rovers",68],["Bristol City",69],["Charlton Athletic",66],["Coventry City",71],["Derby County",67],["Hull City",68],["Ipswich Town",73],["Leicester City",74],["Middlesbrough",71],["Millwall",68],["Norwich City",70],["Oxford United",65],["Portsmouth",67],["Preston North End",68],["QPR",67],["Sheffield United",72],["Sheffield Wednesday",65],["Southampton",73],["Stoke City",69],["Swansea City",68],["Watford",69],["West Bromwich Albion",71],["Wrexham",66]]},
{ id:"ENG3", name:"League One", country:"England", cc:"ENG", tier:3, conf:"eu", np:"english", up:3, down:4, playoff:[3,6], cup:"FA Cup", cup2:"League Cup", teams:[
["Barnsley",62],["Blackpool",61],["Bolton Wanderers",62],["Bradford City",60],["Burton Albion",58],["Cardiff City",64],["Doncaster Rovers",59],["Exeter City",58],["Huddersfield Town",63],["Leyton Orient",60],["Lincoln City",60],["Luton Town",64],["Mansfield Town",58],["Northampton Town",57],["Peterborough United",61],["Plymouth Argyle",63],["Port Vale",58],["Reading",61],["Rotherham United",61],["Stevenage",59],["Stockport County",62],["Wigan Athletic",61],["AFC Wimbledon",57],["Wycombe Wanderers",60]]},

{ id:"ESP1", name:"La Liga", country:"Spain", cc:"ESP", tier:1, conf:"eu", np:"spanish", down:3, cup:"Copa del Rey", slots:{cl:4, el:2, co:1}, teams:[
["Alavés",75],["Athletic Club",81],["Atlético Madrid",84],["Barcelona",88],["Real Betis",79],["Celta Vigo",77],["Elche",74],["Espanyol",76],["Getafe",76],["Girona",76],["Levante",73],["Mallorca",76],["Osasuna",76],["Real Oviedo",73],["Rayo Vallecano",76],["Real Madrid",88],["Real Sociedad",78],["Sevilla",77],["Valencia",77],["Villarreal",80]]},
{ id:"ESP2", name:"La Liga 2", country:"Spain", cc:"ESP", tier:2, conf:"eu", np:"spanish", up:3, down:4, playoff:[3,6], cup:"Copa del Rey", teams:[
["Albacete",66],["Almería",69],["FC Andorra",65],["Burgos",65],["Cádiz",68],["Castellón",65],["AD Ceuta",63],["Córdoba",66],["Cultural Leonesa",63],["Deportivo La Coruña",69],["Eibar",67],["Granada",68],["Huesca",66],["Las Palmas",69],["Leganés",68],["Málaga",67],["Mirandés",65],["Racing Santander",68],["Real Zaragoza",66],["Sporting Gijón",67],["Real Valladolid",68],["Real Sociedad B",62]]},
{ id:"ESP3", name:"Primera Federación", country:"Spain", cc:"ESP", tier:3, conf:"eu", np:"spanish", up:2, down:4, playoff:[3,6], cup:"Copa del Rey", teams:[
["Real Murcia",58],["Hércules",57],["Recreativo de Huelva",56],["Ponferradina",58],["Cartagena",59],["Tenerife",60],["UD Ibiza",58],["Alcorcón",56],["Fuenlabrada",55],["Marbella",54],["Antequera",54],["Algeciras",55],["Atlético Sanluqueño",53],["Tarazona",52],["Sestao River",53],["Nàstic Tarragona",57],["Sabadell",56],["Cacereño",52],["Real Unión",53],["Ourense CF",53]]},

{ id:"ITA1", name:"Serie A", country:"Italy", cc:"ITA", tier:1, conf:"eu", np:"italian", down:3, cup:"Coppa Italia", slots:{cl:4, el:2, co:1}, teams:[
["Atalanta",80],["Bologna",79],["Cagliari",74],["Como",77],["Cremonese",72],["Fiorentina",77],["Genoa",75],["Inter",86],["Juventus",83],["Lazio",78],["Lecce",73],["AC Milan",83],["Napoli",85],["Parma",74],["Pisa",72],["Roma",81],["Sassuolo",74],["Torino",75],["Udinese",75],["Hellas Verona",73]]},
{ id:"ITA2", name:"Serie B", country:"Italy", cc:"ITA", tier:2, conf:"eu", np:"italian", up:3, down:3, playoff:[3,6], cup:"Coppa Italia", teams:[
["Avellino",63],["Bari",65],["Carrarese",62],["Catanzaro",65],["Cesena",65],["Empoli",68],["Frosinone",66],["Juve Stabia",64],["Mantova",62],["Modena",65],["Monza",69],["Padova",63],["Palermo",68],["Pescara",62],["Reggiana",63],["Sampdoria",67],["Spezia",66],["Südtirol",63],["Venezia",68],["Virtus Entella",61]]},
{ id:"ITA3", name:"Serie C", country:"Italy", cc:"ITA", tier:3, conf:"eu", np:"italian", up:3, down:3, playoff:[3,6], cup:"Coppa Italia", teams:[
["Ternana",58],["Perugia",58],["Ascoli",58],["Vicenza",60],["Salernitana",61],["Catania",60],["Benevento",60],["Crotone",58],["Trapani",57],["Cosenza",58],["Ravenna",55],["Triestina",55],["Novara",55],["Pro Vercelli",54],["Arezzo",56],["Pontedera",53],["Foggia",55],["Cavese",52],["Brescia",57],["Pineto",52]]},

{ id:"GER1", name:"Bundesliga", country:"Germany", cc:"GER", tier:1, conf:"eu", np:"german", down:3, cup:"DFB-Pokal", slots:{cl:4, el:2, co:1}, teams:[
["Augsburg",75],["Bayern München",88],["Bayer Leverkusen",82],["Werder Bremen",76],["Borussia Dortmund",83],["Eintracht Frankfurt",80],["Freiburg",78],["Hamburger SV",74],["Heidenheim",72],["Hoffenheim",76],["1. FC Köln",74],["RB Leipzig",81],["Mainz 05",76],["Borussia Mönchengladbach",76],["St. Pauli",73],["VfB Stuttgart",80],["Union Berlin",75],["Wolfsburg",76]]},
{ id:"GER2", name:"2. Bundesliga", country:"Germany", cc:"GER", tier:2, conf:"eu", np:"german", up:3, down:3, playoff:[3,3], cup:"DFB-Pokal", teams:[
["Arminia Bielefeld",66],["VfL Bochum",68],["Eintracht Braunschweig",64],["Darmstadt 98",67],["Dynamo Dresden",65],["Fortuna Düsseldorf",68],["Elversberg",67],["Greuther Fürth",65],["Hannover 96",69],["Hertha BSC",70],["Kaiserslautern",68],["Karlsruher SC",67],["1. FC Magdeburg",67],["Preußen Münster",63],["1. FC Nürnberg",67],["Paderborn",68],["Schalke 04",70],["Holstein Kiel",69]]},
{ id:"GER3", name:"3. Liga", country:"Germany", cc:"GER", tier:3, conf:"eu", np:"german", up:3, down:4, cup:"DFB-Pokal", teams:[
["1860 München",61],["Alemannia Aachen",58],["Erzgebirge Aue",58],["Energie Cottbus",59],["MSV Duisburg",60],["Rot-Weiss Essen",60],["Hansa Rostock",61],["Ingolstadt",60],["Waldhof Mannheim",58],["VfL Osnabrück",60],["Jahn Regensburg",58],["1. FC Saarbrücken",61],["SC Verl",58],["Viktoria Köln",58],["Wehen Wiesbaden",58],["SSV Ulm",59],["Schweinfurt 05",55],["TSV Havelse",54],["Unterhaching",56],["Hallescher FC",57]]},

{ id:"FRA1", name:"Ligue 1", country:"France", cc:"FRA", tier:1, conf:"eu", np:"french", down:3, cup:"Coupe de France", slots:{cl:4, el:2, co:1}, teams:[
["Angers",71],["Auxerre",72],["Brest",74],["Le Havre",71],["Lens",77],["Lille",78],["Lorient",71],["Lyon",78],["Marseille",81],["Metz",70],["Monaco",81],["Nantes",72],["Nice",76],["Paris FC",72],["Paris Saint-Germain",88],["Rennes",76],["Strasbourg",76],["Toulouse",74]]},
{ id:"FRA2", name:"Ligue 2", country:"France", cc:"FRA", tier:2, conf:"eu", np:"french", up:3, down:3, playoff:[3,5], cup:"Coupe de France", teams:[
["Amiens",63],["Annecy",63],["Bastia",62],["Boulogne",60],["Clermont Foot",63],["Dunkerque",64],["Grenoble",64],["Guingamp",65],["Laval",63],["Le Mans",62],["Montpellier",67],["Nancy",62],["Pau FC",63],["Red Star",63],["Reims",68],["Rodez",62],["Saint-Étienne",70],["Troyes",66]]},
{ id:"FRA3", name:"Championnat National", country:"France", cc:"FRA", tier:3, conf:"eu", np:"french", up:2, down:4, cup:"Coupe de France", teams:[
["Orléans",55],["Valenciennes",56],["Sochaux",58],["Dijon",57],["Concarneau",56],["Quevilly-Rouen",56],["Versailles",55],["Châteauroux",54],["Fleury 91",53],["Villefranche",54],["Le Puy Foot",53],["Nîmes",56],["Caen",60],["Aubagne",52],["Rouen",55],["Bourg-en-Bresse",54],["Cholet",54],["Paris 13 Atletico",52]]},

{ id:"NED1", name:"Eredivisie", country:"Netherlands", cc:"NED", tier:1, conf:"eu", np:"dutch", down:2, cup:"KNVB Beker", slots:{cl:2, el:2, co:1}, teams:[
["Ajax",79],["AZ Alkmaar",77],["Feyenoord",79],["PSV",81],["Twente",74],["Utrecht",74],["Excelsior",66],["Fortuna Sittard",68],["Go Ahead Eagles",70],["Groningen",70],["Heerenveen",69],["Heracles",67],["NAC Breda",68],["NEC Nijmegen",71],["PEC Zwolle",68],["Sparta Rotterdam",69],["Telstar",63],["Volendam",65]]},
{ id:"POR1", name:"Liga Portugal", country:"Portugal", cc:"POR", tier:1, conf:"eu", np:"portuguese", down:2, cup:"Taça de Portugal", slots:{cl:2, el:2, co:1}, teams:[
["Benfica",81],["Porto",81],["Sporting CP",82],["Braga",77],["Vitória de Guimarães",73],["Arouca",68],["AVS",65],["Casa Pia",67],["Estoril",68],["Estrela da Amadora",65],["Famalicão",70],["Gil Vicente",68],["Moreirense",68],["Nacional",66],["Rio Ave",68],["Santa Clara",68],["Tondela",64],["Alverca",64]]},

{ id:"ARG1", name:"Primera División", country:"Argentina", cc:"ARG", tier:1, conf:"sa", np:"latam", down:2, cup:"Copa Argentina", slots:{lib:4, sud:4}, teams:[
["River Plate",78],["Boca Juniors",77],["Racing Club",76],["Independiente",73],["San Lorenzo",72],["Vélez Sarsfield",74],["Estudiantes",74],["Gimnasia La Plata",70],["Newell's Old Boys",70],["Rosario Central",74],["Talleres",72],["Belgrano",71],["Instituto",70],["Argentinos Juniors",73],["Huracán",71],["Lanús",73],["Banfield",69],["Tigre",69],["Platense",70],["Defensa y Justicia",71],["Godoy Cruz",69],["Unión",70],["Atlético Tucumán",69],["Central Córdoba",70],["Barracas Central",68],["Sarmiento",67],["Independiente Rivadavia",69],["Deportivo Riestra",67]]},
{ id:"ARG2", name:"Primera Nacional", country:"Argentina", cc:"ARG", tier:2, conf:"sa", np:"latam", up:2, down:2, playoff:[2,5], cup:"Copa Argentina", teams:[
["Ferro Carril Oeste",62],["Chacarita Juniors",63],["Quilmes",61],["Atlanta",61],["All Boys",61],["Nueva Chicago",60],["Colón",65],["Gimnasia de Mendoza",62],["Deportivo Morón",60],["Estudiantes de Caseros",59],["Temperley",60],["San Martín de Tucumán",63],["Almirante Brown",60],["Defensores de Belgrano",59],["Deportivo Madryn",60],["Agropecuario",59],["Mitre",58],["Chaco For Ever",58],["Patronato",62],["Arsenal de Sarandí",60]]},

{ id:"BRA1", name:"Brasileirão Série A", country:"Brazil", cc:"BRA", tier:1, conf:"sa", np:"brazilian", down:4, cup:"Copa do Brasil", slots:{lib:4, sud:4}, teams:[
["Atlético Mineiro",77],["Bahia",76],["Botafogo",78],["Ceará",72],["Corinthians",77],["Cruzeiro",78],["Flamengo",82],["Fluminense",76],["Fortaleza",74],["Grêmio",75],["Internacional",76],["Juventude",70],["Mirassol",73],["Palmeiras",82],["Red Bull Bragantino",74],["Santos",74],["São Paulo",77],["Sport Recife",70],["Vasco da Gama",73],["Vitória",71]]},
{ id:"BRA2", name:"Brasileirão Série B", country:"Brazil", cc:"BRA", tier:2, conf:"sa", np:"brazilian", up:4, down:4, cup:"Copa do Brasil", teams:[
["América Mineiro",66],["Athletic Club MG",63],["Athletico Paranaense",70],["Atlético Goianiense",66],["Avaí",65],["Botafogo-SP",63],["Chapecoense",66],["Coritiba",68],["CRB",65],["Criciúma",66],["Cuiabá",67],["Ferroviária",62],["Goiás",68],["Novorizontino",66],["Operário",63],["Paysandu",63],["Remo",65],["Vila Nova",65],["Volta Redonda",62],["Amazonas",63]]},

{ id:"USA1", name:"MLS", country:"United States", cc:"USA", tier:1, conf:"na", np:"american", noRel:true, playoffTop:8, cup:"US Open Cup", teams:[
["Atlanta United",73],["Austin FC",72],["Charlotte FC",73],["Chicago Fire",72],["FC Cincinnati",75],["Colorado Rapids",71],["Columbus Crew",75],["D.C. United",69],["FC Dallas",71],["Houston Dynamo",70],["Inter Miami",78],["LA Galaxy",73],["LAFC",76],["Minnesota United",73],["CF Montréal",69],["Nashville SC",73],["New England Revolution",70],["New York City FC",74],["New York Red Bulls",72],["Orlando City",74],["Philadelphia Union",75],["Portland Timbers",72],["Real Salt Lake",71],["San Diego FC",74],["San Jose Earthquakes",70],["Seattle Sounders",75],["Sporting Kansas City",69],["St. Louis City",71],["Toronto FC",69],["Vancouver Whitecaps",74]]},
];

const findLeague = id => LEAGUES.find(l => l.id === id);
const leaguesOfCountry = cc => LEAGUES.filter(l => l.cc === cc);
/* find a club by name across a state's league world (returns {league, idx, team}) */
function findClubIn(leagues, name) {
  for (const lg of leagues) {
    const i = lg.teams.findIndex(t => t.n === name);
    if (i >= 0) return { league: lg, idx: i, team: lg.teams[i] };
  }
  return null;
}
