import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));

function decouper(lecon) {
  const sansCode = lecon.replace(/^L\d+\s+/, "");
  const apres = sansCode.includes(" : ") ? sansCode.split(" : ").slice(1).join(" : ") : sansCode;
  const morceaux = apres.split(";").map((partie) => partie.trim()).filter(Boolean);
  const fin = [];
  for (const morceau of morceaux) {
    const parenthese = morceau.match(/^(.*?)\(([^)]+)\)\s*$/);
    if (parenthese && parenthese[2].includes(",")) {
      if (parenthese[1].trim()) fin.push(parenthese[1].trim());
      fin.push(...parenthese[2].split(",").map((partie) => partie.trim()));
      continue;
    }
    if (morceau.includes(" / ")) {
      fin.push(...morceau.split(" / ").map((partie) => partie.trim()));
      continue;
    }
    if (morceau.includes(" – ")) {
      fin.push(...morceau.split(" – ").map((partie) => partie.trim()));
      continue;
    }
    fin.push(morceau);
  }
  return fin.length ? fin : [lecon];
}

function suite(matiere, classe, lignes) {
  const lecons = [];
  let periode = [];
  let toutes = [];
  for (const [theme, lecon, volume, semaine, integration] of lignes) {
    if (integration) {
      const terminale = /CTI|Compétence Terminale/i.test(lecon);
      lecons.push({
        matiere,
        classe,
        theme: theme === "Intégration" ? "Intégration – Évaluation – Remédiation" : theme,
        lecon,
        sous_titres: (terminale ? toutes : periode).map((item) => item.lecon),
        volume_horaire: volume,
        semaine,
        type_seance: "integration_evaluation_remediation",
      });
      periode = [];
      continue;
    }
    const item = {
      matiere,
      classe,
      theme,
      lecon,
      sous_titres: decouper(lecon),
      volume_horaire: volume,
      semaine,
      type_seance: "cours",
    };
    lecons.push(item);
    periode.push(item);
    toutes.push(item);
  }
  return lecons;
}

const maths6 = suite("Mathématiques", "6e", [
  ["Configurations du plan", "Droites du plan", 8, 1],
  ["Calcul numérique", "Arithmétique", 10, 2],
  ["Configurations du plan", "Segments", 6, 3],
  ["Calcul numérique", "Nombres décimaux / Programme de calcul", 8, 4],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 5, true],
  ["Configurations du plan", "Angles", 6, 6],
  ["Calcul numérique", "Fractions", 6, 7],
  ["Configurations du plan", "Cercles", 4, 8],
  ["Organisation des données et fonctions", "Situations de proportionnalité", 4, 9],
  ["Configurations du plan", "Triangles", 4, 10],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 11, true],
  ["Organisation des données et fonctions", "Pourcentages et échelles", 4, 12],
  ["Configurations du plan", "Parallélogrammes", 6, 13],
  ["Calcul numérique", "Nombres décimaux relatifs", 8, 14],
  ["Applications du plan", "Figures symétriques par rapport à une droite", 4, 15],
  ["Applications du plan", "Figures symétriques par rapport à un point", 4, 16],
  ["Configurations de l'espace", "Cube, Pavé droit", 6, 17],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 18, true],
]);

const maths5 = suite("Mathématiques", "5e", [
  ["Configurations du plan", "Distance et segments", 8, 1],
  ["Calcul numérique", "Nombres décimaux relatifs", 8, 2],
  ["Configurations du plan", "Angles", 6, 3],
  ["Calcul numérique", "Puissances", 4, 4],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 5, true],
  ["Applications du plan", "Figures symétriques par rapport à une droite, par rapport à un point", 8, 6],
  ["Calcul numérique", "Arithmétique (division euclidienne, nombres premiers, PPCM, PGCD)", 8, 7],
  ["Configurations du plan", "Triangles", 6, 8],
  ["Calcul numérique", "Fractions", 6, 9],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 10, true],
  ["Configurations du plan", "Cercle", 4, 11],
  ["Programmes de calcul, calcul littéral", "Notion d'équation", 6, 12],
  ["Configurations du plan", "Polygones", 6, 13],
  ["Organisation des données et fonctions", "Proportionnalité", 4, 14],
  ["Outils vectoriels, géométrie analytique", "Repérage d'un point sur une droite, sur un quadrillage", 4, 15],
  ["Organisation des données et fonctions", "Pourcentages et échelles", 4, 16],
  ["Configurations de l'espace", "Prisme droit", 4, 17],
  ["Configurations de l'espace", "Cylindre droit", 4, 18],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 2, 19, true],
]);

const maths4 = suite("Mathématiques", "4e", [
  ["Applications du plan", "Symétrie orthogonale, symétrie centrale", 4, 1],
  ["Programme de calcul – calcul littéral", "Calcul sur les expressions algébriques", 6, 2],
  ["Configurations du plan", "Distance et droites", 6, 3],
  ["Calcul numérique", "Nombres rationnels", 6, 4],
  ["Configurations du plan", "Triangles – Polygones réguliers", 8, 5],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 6, true],
  ["Programme de calcul – calcul littéral", "Équations – Inéquations", 8, 7],
  ["Configurations de l'espace", "Perspective cavalière", 4, 8],
  ["Calcul numérique", "Nombres décimaux, calcul approché", 6, 9],
  ["Configurations de l'espace", "Droites et plans de l'espace, positions relatives", 8, 10],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 11, true],
  ["Organisation des données", "Proportionnalité", 4, 12],
  ["Configurations du plan", "Angles – Cercles", 10, 13],
  ["Applications du plan", "Projection", 4, 14],
  ["Organisation des données", "Statistiques", 4, 15],
  ["Applications du plan", "Translations", 4, 16],
  ["Outil vectoriel, géométrie analytique", "Vecteurs – Repérage", 5, 17],
  ["Configurations de l'espace", "Sphère", 3, 18],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 19, true],
]);

const maths3 = suite("Mathématiques", "3e", [
  ["Configurations du plan", "Propriété de Thalès", 8, 1],
  ["Programme de calcul – calcul littéral", "Monômes, polynômes, fractions rationnelles", 6, 2],
  ["Configurations du plan", "Trigonométrie dans le triangle rectangle", 8, 3],
  ["Calcul numérique", "Nombres réels : Racines carrées", 6, 4],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 5, true],
  ["Outil vectoriel, géométrie analytique", "Vecteurs", 5, 6],
  ["Calcul numérique", "Nombres réels : Intervalles, calculs approchés", 6, 7],
  ["Outil vectoriel, géométrie analytique", "Coordonnées et calculs dans un repère", 5, 8],
  ["Programme de calcul – calcul littéral", "Équations – Inéquations dans IR", 6, 9],
  ["Configurations de l'espace", "Pyramide, Cône de révolution", 8, 10],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 11, true],
  ["Programme de calcul – calcul littéral", "Équations – Inéquations dans IR × IR", 6, 12],
  ["Outil vectoriel, géométrie analytique", "Équations de droites", 6, 13],
  ["Organisation des données", "Applications linéaires, applications affines", 5, 14],
  ["Configurations du plan", "Angles inscrits dans un cercle", 4, 15],
  ["Organisation des données", "Statistiques", 4, 16],
  ["Applications du plan", "Symétries orthogonales, symétries centrales, translations", 4, 17],
  ["Applications du plan", "Homothéties", 3, 18],
  ["EC/SI", "Évaluation des compétences : Semaine d'intégration", 4, 19, true],
]);

const pct6 = suite("PCT", "6e", [
  ["Physique : États et propriétés de la matière", "L1 Les états de la matière : états de la matière ; propriétés des solides compacts ou divisés", 2, 1],
  ["Physique : États et propriétés de la matière", "L1 Les états de la matière : propriétés des liquides ; propriétés des gaz", 2, 2],
  ["Physique : États et propriétés de la matière", "L2 Les changements d'état de l'eau : fusion, solidification ; vaporisation, liquéfaction", 2, 3],
  ["Physique : États et propriétés de la matière", "L2 Les changements d'état de l'eau : évaporation et ébullition ; cycle de l'eau", 2, 4],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 5, true],
  ["Chimie : La combustion", "L1 Étude expérimentale de la combustion d'une bougie : étude expérimentale ; mise en évidence des produits de réaction ; combustion, combustible, comburant", 2, 6],
  ["Chimie : La combustion", "L1 Étude expérimentale de la combustion d'une bougie : transformation chimique (réactif, produit, réaction chimique) ; transformation physique", 2, 7],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 8, true],
  ["Physique : États et propriétés de la matière", "L3 Grandeurs physiques : le volume (définition, unités, mesure de liquides et solides, calcul de volumes simples)", 2, 9],
  ["Physique : États et propriétés de la matière", "L3 Grandeurs physiques : la masse (définition, unités, balance, mesure de la masse des solides et liquides)", 2, 10],
  ["Physique : États et propriétés de la matière", "L3 Grandeurs physiques : la température (définition, unité, thermomètre, lecture, température et chaleur)", 2, 11],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 12, true],
  ["Physique : Électricité", "L4 Circuit électrique : éléments d'un circuit ; étude expérimentale d'un circuit simple", 2, 13],
  ["Physique : Électricité", "L4 Circuit électrique : rôle de la pile ; notion de courant électrique ; schématisation ; adaptation lampe/générateur ; association de piles en série", 2, 14],
  ["Physique : Électricité", "L5 Conducteurs et isolants électriques : étude expérimentale, définitions, applications", 2, 15],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 16, true],
  ["Chimie : La combustion", "L2 Combustion des combustibles usuels : combustibles usuels ; étude expérimentale ; triangle du feu", 2, 17],
  ["Chimie : La combustion", "L2 Combustion des combustibles usuels : utilité de la combustion ; dangers de la combustion", 2, 18],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 19, true],
  ["Physique : Électricité", "L6 Circuits série, circuits avec dérivation : circuit série (étude expérimentale, schématisation, définition)", 2, 20],
  ["Physique : Électricité", "L6 Circuits série, circuits avec dérivation : circuit avec dérivation (étude expérimentale, schématisation, définition)", 2, 21],
  ["Physique : Électricité", "L6 Circuits série, circuits avec dérivation : court-circuit d'une lampe (définition, réalisation, schématisation, danger, fusible)", 1, 22],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 22, true],
  ["Chimie : La combustion", "L3 Combustion du soufre : étude expérimentale, produit de réaction, la réaction, équation-bilan", 1, 23],
  ["Chimie : La combustion", "L4 La combustion et l'environnement : pollution de l'air ; action du CO2 et du SO2 sur la santé et l'environnement ; autres polluants ; protection de l'environnement", 2, 24],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 25, true],
]);

const pct5 = suite("PCT", "5e", [
  ["Physique : États et propriétés physiques de la matière", "L1 État solide et état liquide : masse volumique d'un solide", 2, 1],
  ["Physique : États et propriétés physiques de la matière", "L1 État solide et état liquide : masse volumique d'un liquide", 2, 2],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 3, true],
  ["Physique : États et propriétés physiques de la matière", "L2 L'état gazeux : masse volumique de l'air", 2, 4],
  ["Physique : États et propriétés physiques de la matière", "L2 L'état gazeux : propriétés des gaz ; pression dans un gaz", 2, 5],
  ["Physique : États et propriétés physiques de la matière", "L2 L'état gazeux : mesure de la pression ; pression atmosphérique", 2, 6],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 7, true],
  ["Chimie : Discontinuité de la matière", "L1 Molécules et atomes : caractère particulaire de la matière ; molécule ; atome ; formule d'une molécule", 2, 8],
  ["Chimie : Discontinuité de la matière", "L1 Molécules et atomes : corps purs simples et composés ; mélange de corps purs, cas de l'air", 2, 9],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 10, true],
  ["Physique : Électricité", "L3 Intensité du courant électrique : courant électrique ; sens, intensité, mesure", 2, 11],
  ["Physique : Électricité", "L3 Intensité du courant électrique : mesures", 2, 12],
  ["Physique : Électricité", "L4 Tension électrique : la tension, unité, mesure", 2, 13],
  ["Physique : Électricité", "L4 Tension électrique : mesures", 2, 14],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 15, true],
  ["Physique : Électricité", "L5 Circuit série et circuit avec dérivation : circuit série", 2, 16],
  ["Physique : Électricité", "L5 Circuit série et circuit avec dérivation : circuit avec dérivation", 2, 17],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 18, true],
  ["Chimie : Réactions chimiques", "L2 Combustion du carbone : étude expérimentale, produit formé, équation-bilan", 2, 19],
  ["Chimie : Réactions chimiques", "L3 Combustions du fer : combustion vive ; combustion lente (la rouille)", 2, 20],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 21, true],
  ["Chimie : Réactions chimiques", "L4 Combustion du dihydrogène : obtention par action de l'acide chlorhydrique sur le fer ; combustion du dihydrogène", 2, 22],
  ["Chimie : Réactions chimiques", "L5 Action de l'acide chlorhydrique sur le calcaire : expérience, caractérisation du produit, test de reconnaissance du calcaire", 2, 23],
  ["Chimie : Réactions chimiques", "L6 Cycle de réactions chimiques : conservation de l'atome", 2, 24],
  ["Intégration", "Intégration – Évaluation – Remédiation", 2, 25, true],
]);

const pct4 = suite("PCT", "4e", [
  ["Physique : Électricité", "L1 Aimant et bobine : aimant", 2, 1],
  ["Physique : Électricité", "L1 Aimant et bobine : bobine ; électroaimant ; face nord et face sud d'un électroaimant ; interaction aimant-bobine", 4, 2],
  ["Intégration", "Évaluation ; Remédiation", 4, 3, true],
  ["Chimie", "L1 Structure de l'atome : électrisation par frottement (deux sortes d'électricité) ; modèle atomique (noyau, électrons, électroneutralité)", 4, 4],
  ["Chimie", "L2 Structure de l'atome et électricité : interprétation électronique du courant dans un métal ; sens de déplacement des électrons ; sens conventionnel du courant ; cas des isolants", 4, 5],
  ["Intégration", "Évaluation ; Remédiation", 4, 6, true],
  ["Physique : Électricité", "L2 Tension alternative : définition ; production ; courant alternatif et courant continu", 4, 7],
  ["Physique : Électricité", "L2 Courant alternatif : principe des alternateurs ; caractéristiques d'une tension alternative sinusoïdale", 2, 8],
  ["Physique : Électricité", "L3 Tension du secteur", 2, 8],
  ["Physique : Électricité", "L4 Le transformateur", 4, 9],
  ["Intégration", "Évaluation ; Remédiation", 4, 10, true],
  ["Chimie", "L3 Les ions : définition ; anions et cations ; exemples ; ion cuivre Cu2+ (couleur, test de caractérisation)", 4, 11],
  ["Chimie", "L4 Transformation chimique de l'ion cuivre en cuivre et inversement : réaction fer / ion cuivre ; solution d'acide nitrique / cuivre", 4, 12],
  ["Physique : Mécanique", "L5 Poids d'un corps : définition, symbole, unité ; proportionnalité poids/masse", 2, 13],
  ["Physique : Mécanique", "L6 Poussée d'Archimède : définition, mesure, poids apparent", 2, 13],
  ["Physique : Mécanique", "L6 Poussée d'Archimède : facteurs dont dépend la poussée ; expression de la poussée", 4, 14],
  ["Physique : Mécanique", "L6 Poussée d'Archimède : immersion totale et partielle ; densité des liquides ; critère de flottaison ; poussée dans les gaz", 4, 15],
  ["Intégration", "Évaluation ; Remédiation", 4, 16, true],
  ["Chimie", "L5 Transformation électrochimique de l'ion cuivre et du cuivre : étude expérimentale ; interprétation électronique", 2, 17],
  ["Physique : Optique", "L7 Source et récepteur de lumière", 3, 18],
  ["Physique : Optique", "L8 Propagation rectiligne de la lumière : corps transparents, opaques, translucides ; faisceaux, rayon lumineux ; chambre noire", 4, 19],
  ["Physique : Optique", "L8 Propagation rectiligne de la lumière : vitesse de propagation de la lumière ; unités de longueur en astronomie", 2, 20],
  ["Physique : Optique", "L9 Ombres, phases de la lune, éclipses : les ombres", 2, 20],
  ["Physique : Optique", "L9 Ombres, phases de la lune, éclipses : les phases de la lune ; les éclipses", 4, 21],
  ["Intégration", "Évaluation ; Remédiation", 2, 22, true],
  ["Chimie", "L6 Courant électrique dans les électrolytes : double migration des ions", 2, 23],
  ["Physique : Optique", "L10 Réflexion de la lumière : image à travers un miroir plan (expérience des deux bougies) ; caractéristiques de l'image ; lois de réflexion", 4, 24],
  ["Intégration", "Évaluation ; Remédiation", 4, 25, true],
]);

const pct3 = suite("PCT", "3e", [
  ["Physique : Mécanique", "L1 Les forces : poids d'un corps (caractéristiques, centre de gravité, représentation vectorielle)", 2, 1],
  ["Physique : Mécanique", "L1 Les forces : poussée d'Archimède ; caractéristiques d'une force (point d'application, direction, sens, intensité en newton, dynamomètre) ; définition d'une force", 2, 2],
  ["Physique : Mécanique", "L1 Les forces : modes d'action des forces (à distance ou de contact ; action répartie ou localisée)", 2, 2],
  ["Intégration", "Évaluation sommative ; Remédiation", 2, 3, true],
  ["Chimie", "L1 Corps moléculaires : l'eau, décomposition par électrolyse, synthèse, équations-bilan", 2, 3],
  ["Chimie", "L2 Les alcanes : méthane, éthane, propane, butane ; formule brute ; combustion et équations-bilan", 2, 4],
  ["Intégration", "Enrichissement et approfondissement ; Évaluation-Remédiation", 2, 4, true],
  ["Physique : Mécanique", "L2 Équilibre d'un corps soumis à des forces concourantes : solide soumis à deux forces opposées ; solide soumis à trois forces concourantes", 4, 5],
  ["Physique : Mécanique", "L2 Équilibre d'un corps soumis à des forces concourantes : solide posé sur un plan incliné et retenu par une corde, réaction du plan incliné", 2, 6],
  ["Intégration", "Évaluation ; Remédiation", 4, 6, true],
  ["Chimie", "L3 Réaction entre des corps solides : action du carbone sur l'oxyde de cuivre", 2, 7],
  ["Chimie", "L3 Réaction entre des corps solides : action de l'aluminium sur l'oxyde de fer", 4, 8],
  ["Physique : Mécanique", "L3 Énergie mécanique : travail mécanique ; puissance mécanique", 4, 9],
  ["Physique : Mécanique", "L3 Énergie mécanique : énergie (définition, unité) ; énergie cinétique ; énergie potentielle ; conversion et conservation de l'énergie mécanique", 4, 10],
  ["Physique : Mécanique", "L3 Énergie mécanique : exercices d'approfondissement", 4, 11],
  ["Intégration", "Remédiation", 2, 12, true],
  ["Chimie", "L4 Solutions aqueuses : l'eau, solvant des composés ioniques ; caractérisation des ions Cu2+, Fe2+, Fe3+, CO3 2-, SO4 2-, Cl-", 2, 12],
  ["Physique : Électricité", "L4 Conducteurs ohmiques : résistance ; association en série", 4, 13],
  ["Physique : Électricité", "L4 Conducteurs ohmiques : association en dérivation ; utilisation des conducteurs ohmiques", 4, 14],
  ["Physique : Électricité", "L5 Puissance et énergie électrique : puissance en courant continu (expression, unité) ; énergie consommée en courant continu", 4, 15],
  ["Physique : Électricité", "L5 Puissance et énergie électrique : énergie consommée par un appareil électroménager en alternatif, E = Pt ; compteur électrique", 4, 16],
  ["Chimie", "L5 Solutions acides et basiques : solution acide, pH ; solution basique ; pH de quelques solutions diluées", 4, 17],
  ["Intégration", "Évaluation ; Remédiation", 4, 18, true],
  ["Physique : Optique", "L6 Les lentilles : lentilles minces, types, représentation, axe et centre optique, foyers, distance focale, vergence", 2, 19],
  ["Physique : Optique", "L6 Les lentilles : image réelle d'une lentille convergente, construction avec deux rayons particuliers", 2, 19],
  ["Physique : Optique", "L6 Les lentilles : l'œil, accommodation, correction des défauts ; enrichissement", 4, 20],
  ["Intégration", "Évaluation ; Remédiation", 2, 21, true],
  ["Physique : Optique", "L7 Analyse de la lumière blanche : décomposition (irisation, arc-en-ciel) ; spectre continu (visible, infrarouge, ultraviolet) ; applications UV et IR", 2, 21],
  ["Physique : Optique", "L7 Analyse de la lumière blanche : énergie lumineuse ; dangers", 4, 22],
  ["Physique : Formes d'énergie et leurs transformations", "L8 Formes d'énergie : différentes formes d'énergie (exemples, énergies propres, renouvelables) ; production", 4, 23],
  ["Physique : Formes d'énergie et leurs transformations", "L8 Formes d'énergie : stockage, transformation ; enrichissement et approfondissement", 4, 24],
  ["Intégration", "Intégration et évaluation ; Remédiation", 4, 25, true],
]);

const svt6 = suite("SVT", "6e", [
  ["Les êtres vivants et leur environnement", "L1 Organisation d'une sortie de terrain", 1, 1],
  ["Les êtres vivants et leur environnement", "L2 Connaissance du milieu", 3, 2],
  ["Les êtres vivants et leur environnement", "L3 Diversité des modes de déplacement chez les animaux", 4, 3],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 3, 5, true],
  ["L'Homme et sa santé", "L4 Hygiène", 4, 7],
  ["L'Homme et sa santé", "L5 La vaccination", 3, 9],
  ["L'Homme et sa santé", "L6 Méfaits de l'usage des drogues", 3, 10],
  ["L'Homme et sa santé", "L7 Infections sexuellement transmissibles : IST / VIH-SIDA", 3, 13],
  ["L'Homme et sa santé", "L8 Paludisme", 3, 16],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 3, 17, true],
  ["Nutrition et alimentation des êtres vivants", "L9 Diversité et nécessité de l'alimentation chez les animaux", 3, 18],
  ["Nutrition et alimentation des êtres vivants", "L10 Application à l'élevage des animaux", 3, 20],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 20, true],
  ["Reproduction des êtres vivants", "L11 Oviparité chez la poule", 3, 21],
  ["Reproduction des êtres vivants", "L12 Viviparité chez l'homme", 4, 22],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 24, true],
  ["Intégration", "Semaine d'intégration de la Compétence Terminale (CTI)", 3, 25, true],
]);

const svt5 = suite("SVT", "5e", [
  ["Les êtres vivants et leur environnement", "L1 La pollution de l'environnement : les polluants solides", 3, 1],
  ["Les êtres vivants et leur environnement", "L2 La chaîne alimentaire", 3, 3],
  ["Les êtres vivants et leur environnement", "L3 L'élevage des animaux", 2, 5],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 7, true],
  ["L'Homme et sa santé", "L4 Alimentation équilibrée", 3, 8],
  ["L'Homme et sa santé", "L5 Une maladie parasitaire : l'ascaridiose", 2, 10],
  ["L'Homme et sa santé", "L6 Infections sexuellement transmissibles : IST / VIH-SIDA", 2, 11],
  ["Intégration", "Évaluation de la CB et remédiation éventuelle", 2, 11, true],
  ["Nutrition et alimentation des êtres vivants", "L7 L'absorption d'eau et de sels minéraux par les plantes vertes", 3, 12],
  ["Nutrition et alimentation des êtres vivants", "L8 La photosynthèse", 4, 13],
  ["Intégration", "Évaluation de la CB et remédiation éventuelle", 2, 14, true],
  ["Reproduction des êtres vivants", "L9 Reproduction sexuée chez les animaux et les végétaux", 4, 15],
  ["Reproduction des êtres vivants", "L10 Les grossesses précoces et les moyens de prévention", 2, 17],
  ["Reproduction des êtres vivants", "L11 Reproduction asexuée chez les animaux et les végétaux", 3, 18],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 20, true],
  ["La géodynamique et géologie du Togo", "L12 Le sol et ses caractéristiques", 2, 21],
  ["La géodynamique et géologie du Togo", "L13 La dégradation des sols", 2, 22],
  ["La géodynamique et géologie du Togo", "L14 Les sols en agriculture", 2, 23],
  ["Intégration", "Intégration, évaluation de la CB3 et remédiation éventuelle", 2, 24, true],
  ["Intégration", "Semaine d'intégration de la Compétence Terminale (CTI)", 3, 25, true],
]);

const svt4 = suite("SVT", "4e", [
  ["Les êtres vivants et leur environnement", "L1 Pollution de l'environnement : polluants chimiques", 3, 1],
  ["Les êtres vivants et leur environnement", "L2 Les ressources naturelles et leur gestion durable", 3, 2],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 3, true],
  ["L'Homme et sa santé", "L3 La tuberculose", 3, 4],
  ["L'Homme et sa santé", "L4 La Covid-19", 3, 5],
  ["L'Homme et sa santé", "L5 Les IST / VIH-SIDA", 3, 6],
  ["L'Homme et sa santé", "L6 Le paludisme", 3, 7],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 8, true],
  ["Nutrition et alimentation des êtres vivants", "L7 Différents aliments de l'Homme et des animaux", 3, 9],
  ["Nutrition et alimentation des êtres vivants", "L8 Composition chimique des différents aliments", 3, 10],
  ["Intégration", "Intégration, évaluation de la CB et remédiation éventuelle", 2, 11, true],
  ["Reproduction des êtres vivants et hérédité", "L9 Reproduction humaine : organes génitaux de l'homme et de la femme", 3, 12],
  ["Reproduction des êtres vivants et hérédité", "L10 Grossesses précoces et leurs conséquences", 3, 13],
  ["Intégration", "Intégration, évaluation de la CB ; semaine d'intégration de la CTI", 3, 14, true],
  ["La géodynamique et géologie du Togo — Géodynamique externe", "L11 Les différents types de roches", 3, 15],
  ["La géodynamique et géologie du Togo — Géodynamique externe", "L12 Les phénomènes géodynamiques externes", 3, 16],
  ["La géodynamique et géologie du Togo — Géodynamique externe", "L13 Genèse des roches sédimentaires", 3, 17],
  ["La géodynamique et géologie du Togo — Géodynamique interne", "L14 Le volcanisme", 3, 18],
  ["La géodynamique et géologie du Togo — Géodynamique interne", "L15 Genèse des roches magmatiques", 3, 19],
  ["La géodynamique et géologie du Togo — Géodynamique interne", "L16 Genèse des roches métamorphiques", 3, 20],
  ["La géodynamique et géologie du Togo — Géodynamique interne", "L17 Synthèse sur l'étude des roches : cycle géochimique ; intérêt économique des roches", 3, 21],
  ["La géodynamique et géologie du Togo — Tectonique des plaques", "L18 Structure du globe terrestre", 3, 22],
  ["La géodynamique et géologie du Togo — Tectonique des plaques", "L19 Mouvement des plaques tectoniques", 3, 23],
  ["La géodynamique et géologie du Togo — Tectonique des plaques", "L20 Les séismes", 3, 24],
]);

const svt3 = suite("SVT", "3e", [
  ["Géodynamique et géologie du Togo", "L1 Les formations géologiques du Togo", 4, 1],
  ["Géodynamique et géologie du Togo", "L2 Les intérêts économiques des formations géologiques du Togo", 4, 2],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 3, true],
  ["Les êtres vivants et leur environnement", "L3 La pollution de l'environnement : synthèse sur l'eau", 4, 4],
  ["Les êtres vivants et leur environnement", "L4 La commande nerveuse du mouvement", 4, 5],
  ["Les êtres vivants et leur environnement", "L5 L'œil et la vision", 4, 6],
  ["Les êtres vivants et leur environnement", "L6 La peau", 4, 7],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 8, true],
  ["L'Homme et sa santé", "L7 Les micro-organismes pathogènes et non pathogènes (utiles)", 4, 9],
  ["L'Homme et sa santé", "L8 Le paludisme", 4, 10],
  ["L'Homme et sa santé", "L9 L'immunité", 4, 10],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 11, true],
  ["Nutrition et alimentation des êtres vivants", "L10 La digestion", 4, 12],
  ["Nutrition et alimentation des êtres vivants", "L11 La circulation sanguine", 4, 13],
  ["Nutrition et alimentation des êtres vivants", "L12 La respiration", 4, 14],
  ["Nutrition et alimentation des êtres vivants", "L13 L'excrétion", 4, 15],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 16, true],
  ["Reproduction des êtres vivants et hérédité", "L14 La transmission de la vie chez l'Homme : les organes génitaux", 4, 17],
  ["Reproduction des êtres vivants et hérédité", "L15 La transmission de la vie : cycles sexuels, fécondation et grossesse", 4, 18],
  ["Reproduction des êtres vivants et hérédité", "L16 La transmission de la vie : l'accouchement et l'allaitement", 4, 19],
  ["Reproduction des êtres vivants et hérédité", "L17 La transmission de la vie : la maîtrise de la reproduction", 4, 20],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 21, true],
  ["Reproduction des êtres vivants et hérédité", "L18 Les ressemblances et les différences entre les êtres vivants", 4, 22],
  ["Reproduction des êtres vivants et hérédité", "L19 Le support des caractères héréditaires : l'ADN", 4, 23],
  ["Reproduction des êtres vivants et hérédité", "L20 Les maladies héréditaires", 4, 24],
  ["Intégration", "Intégration, évaluation de la CT et remédiation éventuelle", 4, 25, true],
]);

const techno6 = suite("Technologie", "6e", [
  ["Réalisation d'un objet technique", "L1 Objet naturel et objet technique : définitions, exemples ; fonction d'usage (besoin, familles d'objets)", 2, 1],
  ["Réalisation d'un objet technique", "L2 Réalisation du prototype d'une éprouvette graduée ; notion de prototype", 3, 3],
  ["Réalisation d'un objet technique", "L3 L'éprouvette graduée, objet technique : caractères techniques, utilisation", 1, 6],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 7, true],
  ["Les matériaux", "L1 Les principales familles de matériaux (les 5 familles)", 1, 8],
  ["Les matériaux", "L2 Caractéristiques et propriétés des matériaux", 2, 9],
  ["Les matériaux", "L3 Recyclage des matériaux et impact environnemental : impact, valorisation, recyclage, avantages, recyclage au Togo", 3, 11],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 14, true],
  ["Évolution d'un objet technique", "L1 De la balance romaine à la balance électronique", 2, 15],
  ["Évolution d'un objet technique", "L2 Quelques unités de masse dans l'histoire", 1, 17],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 18, true],
  ["Étude d'un composant électrique simple", "Étude d'un interrupteur simple du commerce : démontage ; vérification du fonctionnement ; objet technologique", 3, 19],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 22, true],
  ["Outil informatique", "L'ordinateur et ses périphériques : à quoi sert-il, périphériques ; unité centrale, ordinateur portable", 2, 23],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 25, true],
]);

const techno5 = suite("Technologie", "5e", [
  ["Réalisation d'un objet technique", "L1 Un filtre artisanal pour purifier l'eau : eau potable ; techniques pour obtenir une eau potable ; technique pour obtenir une eau pure ; fabrication d'un filtre artisanal ; visite d'une usine de traitement de l'eau", 5, 1],
  ["Les matériaux", "L2 La protection des matériaux : métaux ferreux (peinture, vernis, protection électrochimique) ; bois (peinture, vernis, produits chimiques) ; matières plastiques contre les rayons solaires (stabilisants, métallisation, enfouissement)", 3, 6],
  ["Les matériaux", "L3 La dilatation thermique : des solides (bilame, joint de dilatation, toitures métalliques, dilatation linéaire et volumique, facteurs) ; des liquides (vase d'expansion, thermomètre à alcool, facteurs) ; des gaz (dangers en vase clos, bombe aérosol, facteurs)", 4, 9],
  ["Évolution d'un objet technique", "L4 Du cadran solaire à la montre connectée : cadran solaire, sablier, bougie, horloge à balancier, à ressort spiral, montre à aiguille, à quartz, numérique, connectée, horloge atomique ; fonctions d'usage (se repérer dans le temps, délimiter, mesurer une durée)", 3, 13],
  ["Le dessin technique", "L5 Introduction au dessin technique : langage de communication (conventions, outils, logiciels DAO) ; origines (fabriquer, vérifier, reproduire à grande échelle) ; outils spécifiques (planche, format standard, crayon, règle, compas, équerres)", 3, 16],
  ["Étude d'un objet technique", "L6 Étude d'un interrupteur va-et-vient du commerce : démontage, analogie et différences avec l'interrupteur simple, symbole ; câblage va-et-vient (utilité, schéma une lampe et deux interrupteurs, fonctionnement) ; remontage et vérification", 3, 19],
  ["Outil informatique", "L7 Les logiciels : logiciel système et application ; logiciels d'application (traitement de texte, tableurs-grapheurs, moteurs de recherche, jeux, multimédia, CAO, FAO) ; logiciels libres et propriétaires ; gratuits et payants", 4, 22],
]);

const techno4 = suite("Technologie", "4e", [
  ["Évolution d'un objet technique", "L1 Les machines simples à travers les âges : fonction d'usage ; évolution dans le temps", 2, 1],
  ["Évolution d'un objet technique", "L2 De la houe au motoculteur, les outils du travail de la terre à travers les âges : les outils ; fonction d'usage et famille d'outils", 2, 3],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 5, true],
  ["Le dessin technique", "Les principales représentations ; traits utilisés ; échelle ; cartouche ; formats de feuilles normalisés ; orientation de la feuille", 3, 6],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 9, true],
  ["Installation électrique domestique", "Schématisation d'une installation électrique domestique simple : circuits domestiques ; choix liés à l'installation ; schématisation", 3, 10],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 13, true],
  ["Étude d'un objet technique", "La génératrice de bicyclette : fonctionnement ; démontage ; remontage ; objet technologique", 3, 14],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 17, true],
  ["Réalisation d'un objet technique", "Un redresseur de courant : action d'une diode et d'un pont de diodes ; condensateur ; régulateur ; réalisation d'un redresseur", 4, 18],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 22, true],
  ["Outil informatique", "La communication sur Internet : Internet ; règles de communication sur Internet", 3, 23],
]);

const techno3 = suite("Technologie", "3e", [
  ["Réalisation d'un objet technique", "Un détecteur utilisant un transistor : chaîne électronique ; étude du transistor ; capteurs et dipôles commandés ; réalisation et test d'un détecteur", 4, 1],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 5, true],
  ["Le dessin technique", "Réaliser le dessin technique d'un objet et le faire reproduire : dessins et schémas pour la fabrication ; autres informations liées à la fabrication", 3, 6],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 9, true],
  ["Étude d'un objet technique", "Le transformateur : observation, caractéristiques d'un transformateur du commerce ; utilisation ; objet technologique", 2, 10],
  ["Installation électrique domestique", "La sécurité électrique des êtres humains et des matériels : observation de l'installation ; dangers du courant ; protection au niveau des prises ; disjoncteur différentiel", 3, 12],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 15, true],
  ["Évolution d'un objet technique", "De la lampe à incandescence à la LED : ampoule d'éclairage ; modes de production de la lumière ; caractéristiques et propriétés de la lumière émise", 3, 16],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 19, true],
  ["L'objet technique et l'énergie", "Les formes d'énergie et leurs transformations dans des objets techniques ; importance de l'énergie électrique", 2, 20],
  ["Intégration", "Intégration – Évaluation – Remédiation", 1, 22, true],
  ["Outil informatique", "L'ordinateur au service de la science : logiciels scientifiques, interfaces, capteurs ; tableur pour vérifier la loi d'Ohm ; vérification de la loi d'Ohm avec matériel d'acquisition et de traitement des données", 3, 23],
]);

const progressions = [
  ...maths6, ...maths5, ...maths4, ...maths3,
  ...pct6, ...pct5, ...pct4, ...pct3,
  ...svt6, ...svt5, ...svt4, ...svt3,
  ...techno6, ...techno5, ...techno4, ...techno3,
];

const sortie = join(ici, "../src/data/progressions.json");
writeFileSync(sortie, `${JSON.stringify(progressions, null, 2)}\n`, "utf8");
const comptes = new Map();
for (const item of progressions) {
  const cle = `${item.matiere} ${item.classe}`;
  comptes.set(cle, (comptes.get(cle) ?? 0) + 1);
}
console.log(`${progressions.length} leçons`);
for (const [cle, nombre] of comptes) console.log(`${cle}: ${nombre}`);
