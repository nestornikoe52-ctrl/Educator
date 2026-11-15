import type { MatiereCode, NiveauCode } from "./curriculum";

export interface LeconCatalogue {
  niveau: NiveauCode;
  matiere: MatiereCode;
  titre: string;
  resume: string;
}

function serie(
  niveau: NiveauCode,
  matiere: MatiereCode,
  lecons: readonly (readonly [string, string])[],
): LeconCatalogue[] {
  return lecons.map(([titre, resume]) => ({ niveau, matiere, titre, resume }));
}

const maths6 = serie("6e", "MATHEMATIQUES", [
  ["Nombres entiers naturels", "Lire, comparer et calculer avec les entiers naturels, y compris les grands nombres."],
  ["Fractions", "Comprendre une fraction comme partage et comme quotient, puis comparer des fractions simples."],
  ["Nombres décimaux", "Passer des fractions décimales aux nombres décimaux et poser les opérations."],
  ["Proportionnalité", "Reconnaître une situation de proportionnalité et utiliser un tableau."],
  ["Droites, segments et angles", "Tracer, mesurer et nommer des droites, des segments et des angles."],
  ["Triangles et quadrilatères", "Construire les triangles et les quadrilatères usuels et en citer les propriétés."],
  ["Périmètres et aires", "Calculer le périmètre et l’aire des figures planes usuelles."],
  ["Solides usuels", "Reconnaître le cube et le pavé droit, et passer du solide à son patron."],
]);

const maths5 = serie("5e", "MATHEMATIQUES", [
  ["Prisme droit", "Décrire un prisme droit, en construire un patron et calculer son volume."],
  ["Cylindre droit", "Reconnaître un cylindre droit, tracer un patron et calculer son volume."],
  ["Distance et segments", "Utiliser le milieu, la médiatrice et l’appartenance d’un point à un segment."],
  ["Angles", "Mesurer des angles et reconnaître des angles complémentaires, supplémentaires ou opposés."],
  ["Triangles", "Construire un triangle et justifier sa nature à partir des côtés et des angles."],
  ["Cercle", "Construire un cercle et situer un point à l’intérieur, sur le cercle ou à l’extérieur."],
  ["Polygones", "Reconnaître les polygones usuels et leurs éléments de symétrie."],
  ["Figures symétriques", "Construire le symétrique d’une figure par rapport à une droite ou à un point."],
  ["Repérage d’un point", "Repérer un point sur une droite graduée et sur un quadrillage."],
  ["Division euclidienne", "Écrire le dividende comme quotient fois diviseur, plus le reste."],
  ["Nombres premiers, PGCD et PPCM", "Décomposer un entier et calculer un PGCD ou un PPCM."],
  ["Fractions", "Simplifier, comparer et calculer avec des fractions."],
  ["Nombres décimaux relatifs", "Ordonner des décimaux relatifs et effectuer les quatre opérations."],
  ["Puissances", "Écrire un nombre avec des puissances de 10 et appliquer les règles de calcul."],
  ["Notion d’équation", "Mettre un problème en équation du premier degré et la résoudre."],
  ["Proportionnalité, pourcentage, échelle", "Résoudre un problème de proportionnalité, de pourcentage ou d’échelle."],
]);

const maths4 = serie("4e", "MATHEMATIQUES", [
  ["Symétrie orthogonale et symétrie centrale", "Construire des symétriques et utiliser les propriétés de conservation."],
  ["Calcul sur les expressions algébriques", "Développer, réduire et factoriser des expressions simples."],
  ["Distance et droites", "Utiliser la distance d’un point à une droite et les positions de deux droites."],
  ["Nombres rationnels", "Calculer avec des rationnels et les placer sur une droite graduée."],
  ["Triangles et polygones réguliers", "Utiliser les triangles et construire des polygones réguliers."],
  ["Équations et inéquations", "Résoudre une équation ou une inéquation du premier degré."],
  ["Perspective cavalière", "Représenter un solide en perspective cavalière et lire cette représentation."],
  ["Nombres décimaux et calculs approchés", "Encadrer un nombre et contrôler l’ordre de grandeur d’un résultat."],
  ["Droites et plans de l’espace", "Décrire les positions relatives de droites et de plans."],
  ["Proportionnalité", "Traiter une situation de proportionnalité, y compris avec un coefficient."],
  ["Angles et cercles", "Relier angles au centre, angles inscrits et longueurs dans un cercle."],
  ["Projection", "Projeter un point ou un segment et utiliser les propriétés de la projection."],
  ["Statistiques", "Lire un tableau de données et calculer une moyenne."],
  ["Translation", "Construire l’image d’une figure par une translation."],
  ["Vecteurs et repérage", "Représenter un vecteur et repérer un point dans le plan."],
  ["Sphère", "Reconnaître une sphère, une boule, et en calculer l’aire ou le volume quand les données sont données."],
]);

const maths3 = serie("3e", "MATHEMATIQUES", [
  ["Théorème de Pythagore", "Calculer une longueur dans un triangle rectangle et reconnaître un triangle rectangle."],
  ["Théorème de Thalès", "Calculer une longueur dans une configuration de Thalès."],
  ["Trigonométrie", "Utiliser cosinus, sinus et tangente dans un triangle rectangle."],
  ["Équations et inéquations", "Résoudre des équations produits et des inéquations du premier degré."],
  ["Systèmes d’équations", "Résoudre un système de deux équations à deux inconnues."],
  ["Fonctions linéaires et affines", "Lire et tracer une fonction linéaire ou affine."],
  ["Statistiques", "Interpréter une série et calculer effectifs, fréquences et moyenne."],
  ["Pyramide, cône et sphère", "Calculer un volume de pyramide, de cône ou de sphère."],
]);

const pct6 = serie("6e", "PCT", [
  ["L’eau dans la vie courante", "Distinguer les usages de l’eau et les précautions pour la garder potable."],
  ["L’air qui nous entoure", "Montrer que l’air est de la matière : il occupe un volume et a une masse."],
  ["Les états de la matière", "Reconnaître solide, liquide et gaz, et décrire un changement d’état."],
  ["Mélanges et corps purs", "Séparer un mélange simple et distinguer mélange homogène et hétérogène."],
  ["Mesurer une grandeur", "Mesurer une longueur, une masse ou un volume avec l’unité adaptée."],
]);

const pct5 = serie("5e", "PCT", [
  ["Le circuit électrique simple", "Réaliser un circuit avec pile, lampe et interrupteur, et schématiser."],
  ["Conducteurs et isolants", "Classer des matériaux selon qu’ils laissent passer le courant ou non."],
  ["Sources de lumière", "Distinguer source primaire et objet diffusant, et expliquer la formation d’une ombre."],
  ["La combustion", "Décrire une combustion, ses réactifs et les précautions de sécurité."],
  ["Température et chaleur", "Mesurer une température et relier un échauffement à un transfert d’énergie."],
]);

const pct4 = serie("4e", "PCT", [
  ["L’atome", "Décrire un atome par son noyau et ses électrons, et lire un symbole chimique."],
  ["Molécules et corps purs", "Interpréter une formule chimique simple comme un assemblage d’atomes."],
  ["Transformation chimique", "Reconnaître une transformation chimique et écrire une équation avec des mots."],
  ["Intensité et tension", "Mesurer une intensité et une tension dans un circuit série."],
  ["Les forces", "Représenter une force par un vecteur et citer des exemples du quotidien."],
]);

const pct3 = serie("3e", "PCT", [
  ["Les ions", "Expliquer qu’un ion est un atome qui a gagné ou perdu des électrons."],
  ["Solutions et pH", "Mesurer le pH d’une solution et distinguer acide, neutre et basique."],
  ["Réactions d’oxydoréduction", "Reconnaître une oxydation simple, comme la formation de rouille."],
  ["Mouvement et vitesse", "Décrire un mouvement et calculer une vitesse moyenne."],
  ["Énergie électrique", "Relier puissance, tension et intensité dans un appareil usuel."],
]);

const svt6 = serie("6e", "SVT", [
  ["Les êtres vivants de notre milieu", "Observer et classer des êtres vivants du milieu proche."],
  ["Le milieu de vie", "Relier un être vivant aux caractéristiques de son milieu."],
  ["L’hygiène du corps et du milieu", "Expliquer des gestes d’hygiène qui protègent la santé."],
  ["L’eau et la vie", "Montrer le rôle de l’eau pour les plantes, les animaux et les humains."],
  ["Le sol, support de la vie", "Décrire les constituants visibles d’un sol et son rôle pour les cultures."],
]);

const svt5 = serie("5e", "SVT", [
  ["La pollution par les déchets solides", "Recenser les déchets solides du milieu et proposer des gestes pour réduire leur impact."],
  ["La chaîne alimentaire", "Identifier les maillons d’une chaîne alimentaire et le rôle de cet enchaînement."],
  ["L’élevage des animaux", "Relier le régime alimentaire d’un animal d’élevage au choix d’un élevage adapté à la région."],
  ["Une alimentation équilibrée", "Composer une ration qui apporte construction, énergie et protection."],
  ["L’ascaridiose", "Décrire le cycle de l’ascaris et les moyens d’éviter cette maladie."],
  ["Les IST et le VIH", "Expliquer les modes de transmission des IST, dont le VIH, et les moyens de prévention."],
  ["L’absorption d’eau et de sels minéraux", "Montrer que la plante verte absorbe l’eau et les sels minéraux par ses racines."],
  ["La photosynthèse", "Expliquer que la plante verte produit de la matière organique à la lumière."],
  ["La reproduction sexuée", "Comparer la reproduction sexuée chez les animaux et chez les végétaux."],
  ["Les grossesses précoces", "Expliquer les risques d’une grossesse précoce et les moyens de prévention."],
  ["La reproduction asexuée", "Donner des exemples de multiplication végétative utiles en agriculture, comme le bouturage."],
  ["Le sol et ses caractéristiques", "Décrire les horizons et les constituants d’un sol."],
  ["La dégradation des sols", "Relier l’eau, le vent et les pratiques humaines à la dégradation d’un sol."],
  ["Les sols en agriculture", "Relier le type de sol aux cultures vivrières pratiquées."],
]);

const svt4 = serie("4e", "SVT", [
  ["La digestion", "Suivre le trajet des aliments et le rôle des sucs digestifs."],
  ["La respiration", "Expliquer les échanges gazeux au niveau des poumons."],
  ["La circulation sanguine", "Décrire le trajet du sang et le rôle du cœur."],
  ["L’excrétion", "Expliquer comment l’organisme élimine certains déchets."],
  ["La puberté et la reproduction humaine", "Décrire les transformations de la puberté et la fécondation."],
  ["Les roches et le sous-sol", "Distinguer quelques roches et relier le sous-sol aux ressources."],
]);

const svt3 = serie("3e", "SVT", [
  ["Le système nerveux", "Relier un stimulus, les nerfs et une réponse de l’organisme."],
  ["L’immunité", "Distinguer les barrières de l’organisme et la réponse immunitaire."],
  ["La transmission des caractères", "Expliquer que les caractères se transmettent des parents aux enfants."],
  ["La reproduction humaine", "Décrire le cycle, la fécondation et le début de la grossesse."],
  ["La tectonique", "Relier séismes et volcans à l’activité interne de la Terre."],
  ["Les ressources du Togo", "Relier quelques ressources naturelles du Togo à leur usage et à leur protection."],
]);

export const CHAPITRES: LeconCatalogue[] = [
  ...maths6,
  ...maths5,
  ...maths4,
  ...maths3,
  ...pct6,
  ...pct5,
  ...pct4,
  ...pct3,
  ...svt6,
  ...svt5,
  ...svt4,
  ...svt3,
];
