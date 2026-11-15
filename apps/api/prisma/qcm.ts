import type { MatiereCode, NiveauCode } from "@education-togo/shared";

export interface QuestionQcmCatalogue {
  niveau: NiveauCode;
  matiere: MatiereCode;
  chapitreOrdre: number;
  question: string;
  choix: readonly [string, string, string, string];
  bonneReponse: string;
  explication: string;
}

function q(
  niveau: NiveauCode,
  matiere: MatiereCode,
  chapitreOrdre: number,
  question: string,
  choix: readonly [string, string, string, string],
  bonneIndex: 0 | 1 | 2 | 3,
  explication: string,
): QuestionQcmCatalogue {
  return {
    niveau,
    matiere,
    chapitreOrdre,
    question,
    choix,
    bonneReponse: choix[bonneIndex],
    explication,
  };
}

export const QUESTIONS_QCM: QuestionQcmCatalogue[] = [
  q("5e", "SVT", 1, "Où jeter une bouteille en verre pour qu’elle soit réutilisée ?", ["Dans la nature", "Dans un point de tri", "Dans le caniveau", "Dans le feu"], 1, "Le verre se recycle s’il est déposé au bon endroit, pas brûlé ni abandonné."),
  q("5e", "SVT", 1, "Quel geste réduit les déchets à la maison ?", ["Réutiliser un sac", "Brûler les ordures chaque soir", "Jeter les restes dans la rue", "Enterrer les piles"], 0, "Réutiliser un objet évite d’en fabriquer un nouveau et diminue les déchets."),
  q("5e", "SVT", 2, "Un herbivore dans une chaîne alimentaire est…", ["Un producteur", "Un consommateur", "Un décomposeur", "Un minéral"], 1, "Il consomme des végétaux. Il ne fabrique pas la matière de départ."),
  q("5e", "SVT", 2, "Que deviennent les feuilles mortes grâce aux décomposeurs ?", ["Du plastique", "De la matière minérale", "Du verre", "Du fer"], 1, "Les décomposeurs transforment la matière morte, qui pourra nourrir le sol."),
  q("5e", "SVT", 3, "Un animal d’élevage a besoin avant tout de…", ["Nourriture, eau et abri", "Un écran", "De l’essence", "Du sel seul"], 0, "Sans nourriture, eau et protection, l’animal ne reste pas en bonne santé."),
  q("5e", "SVT", 3, "La vaccination du troupeau sert à…", ["Prévenir des maladies", "Remplacer l’abreuvement", "Supprimer le pâturage", "Augmenter les feux"], 0, "Le vaccin protège les animaux avant qu’une maladie ne se répande."),
  q("5e", "SVT", 4, "Les aliments de construction servent surtout à…", ["Bâtir et réparer le corps", "Remplacer l’eau", "Éteindre la soif seulement", "Colorer les repas"], 0, "Viande, poisson, œufs et légumineuses apportent des protéines."),
  q("5e", "SVT", 4, "Boire de l’eau potable chaque jour permet de…", ["Hydrater l’organisme", "Remplacer tous les repas", "Éviter tout lavage des mains", "Supprimer les légumes"], 0, "L’eau est indispensable. Elle ne remplace pas un repas équilibré."),
  q("5e", "SVT", 5, "Les œufs d’ascaris se trouvent souvent…", ["Sur des mains ou des aliments sales", "Dans l’air des montagnes seulement", "Dans le sel de cuisine", "Dans la lumière du soleil"], 0, "L’hygiène des mains et le lavage des aliments limitent la contamination."),
  q("5e", "SVT", 5, "Après un passage aux toilettes, il faut…", ["Se laver les mains", "Éviter toute eau", "Manger tout de suite sans geste", "Partager une serviette souillée"], 0, "Ce lavage coupe le trajet des microbes et des œufs de parasites."),
  q("5e", "SVT", 6, "Le VIH ne se transmet pas par…", ["Une poignée de main", "Le sang", "Un rapport non protégé", "La mère à l’enfant"], 0, "Le contact ordinaire, comme une poignée de main, ne transmet pas le virus."),
  q("5e", "SVT", 6, "Le dépistage d’une IST sert à…", ["Savoir et se soigner tôt", "Remplacer le préservatif à coup sûr", "Éviter de boire de l’eau", "Guérir sans aucun traitement"], 0, "Connaître son état permet un traitement et protège les partenaires."),
  q("5e", "SVT", 7, "La sève brute circule surtout…", ["Des racines vers les feuilles", "Des fruits vers les racines seulement", "De l’air vers le sol sans racine", "Des épines vers le ciel"], 0, "L’eau et les sels montent des racines vers les feuilles."),
  q("5e", "SVT", 7, "Une plante arrosée seulement sur les fleurs, racines au sec…", ["Manque d’eau", "Fait plus de photosynthèse", "Devient un animal", "N’a plus besoin de lumière"], 0, "C’est la racine qui absorbe l’eau du sol."),
  q("5e", "SVT", 8, "Sans lumière, une plante verte…", ["Ne peut pas faire la photosynthèse", "Produit plus de dioxygène", "Grandit plus vite", "N’a plus besoin d’eau"], 0, "La lumière est nécessaire pour fabriquer la matière."),
  q("5e", "SVT", 8, "Le dioxyde de carbone utilisé par la feuille vient…", ["De l’air", "Du plastique", "Du sel", "Des piles"], 0, "La feuille prélève le dioxyde de carbone de l’air."),
  q("5e", "SVT", 9, "La fécondation réunit…", ["Deux gamètes", "Deux racines", "Deux feuilles", "Deux sols"], 0, "Le gamète mâle et le gamète femelle forment une cellule-œuf."),
  q("5e", "SVT", 9, "Chez les animaux, l’œuf fécondé peut donner…", ["Un nouvel individu", "Un minéral", "Un déchet solide", "Un circuit électrique"], 0, "Après la fécondation, l’œuf se développe en un nouvel être vivant."),
  q("5e", "SVT", 10, "Une grossesse demande un suivi parce que…", ["La santé de la fille et du bébé est en jeu", "Elle remplace les cours", "Elle protège de toutes les maladies", "Elle accélère les examens"], 0, "Un suivi médical réduit les risques, surtout quand la grossesse est précoce."),
  q("5e", "SVT", 10, "L’abstinence signifie…", ["Ne pas avoir de rapport sexuel", "Partager une lame", "Sauter le lavage des mains", "Refuser l’eau potable"], 0, "Sans rapport sexuel, il n’y a pas de grossesse ni de transmission sexuelle."),
  q("5e", "SVT", 11, "Planter un fragment de tige de manioc donne…", ["Un nouveau plant", "Une graine de maïs", "Un œuf", "Un champignon uniquement"], 0, "C’est une multiplication végétative : le fragment reprend sans fécondation."),
  q("5e", "SVT", 11, "La graine, elle, vient d’une reproduction…", ["Sexuée", "Sans aucune fleur possible", "Uniquement par bouture", "Réservée aux champignons"], 0, "La graine se forme après la fécondation dans la fleur."),
  q("5e", "SVT", 12, "L’humus du sol provient surtout…", ["De la décomposition des êtres vivants", "Du verre pilé", "Du plastique brûlé", "Du sel de mer seul"], 0, "Feuilles, racines et organismes morts deviennent de la matière organique."),
  q("5e", "SVT", 12, "Dans le sol, on trouve aussi…", ["De l’air et de l’eau", "Seulement du fer", "Seulement du verre", "Aucun être vivant"], 0, "Les racines respirent et absorbent grâce à l’air et à l’eau du sol."),
  q("5e", "SVT", 13, "Planter des arbres sur une pente aide à…", ["Retenir le sol", "Accélérer l’érosion", "Supprimer la pluie", "Brûler l’humus"], 0, "Les racines maintiennent la terre et ralentissent le ruissellement."),
  q("5e", "SVT", 13, "Un sol nu sous une forte pluie…", ["Perd sa couche fertile", "Devient aussitôt plus riche", "Arrête l’eau pour toujours", "Se change en roche utile"], 0, "L’eau emporte les particules quand rien ne couvre le sol."),
  q("5e", "SVT", 14, "Associer les cultures au climat de la région sert à…", ["Mieux réussir la récolte", "Ignorer le sol", "Supprimer l’arrosage à jamais", "Éviter toute graine"], 0, "Chaque plante a des besoins d’eau, de chaleur et de sol."),
  q("5e", "SVT", 14, "Laisser le sol se reposer ou l’enrichir permet de…", ["Éviter de l’épuiser", "Le transformer en plastique", "Supprimer les racines", "Arrêter les saisons"], 0, "Un sol épuisé donne de moins bonnes récoltes."),
  q("5e", "MATHEMATIQUES", 1, "Les faces latérales d’un prisme droit sont…", ["Des rectangles", "Des cercles", "Des sphères", "Des points"], 0, "Elles relient les deux bases et sont des rectangles dans un prisme droit."),
  q("5e", "MATHEMATIQUES", 1, "Si l’aire de la base est 12 cm² et la hauteur 5 cm, le volume est…", ["60 cm³", "17 cm³", "7 cm³", "2,4 cm³"], 0, "Volume = aire de la base × hauteur, donc 12 × 5 = 60."),
  q("5e", "PCT", 1, "Une pile dans un circuit fournit…", ["L’énergie électrique", "De l’eau", "Du verre", "De la terre"], 0, "La pile est le générateur : elle permet au courant de circuler dans un circuit fermé."),
  q("5e", "PCT", 1, "Une lampe branchée dans un circuit ouvert…", ["Reste éteinte", "Brille plus fort", "Remplace la pile", "Ferme le circuit toute seule"], 0, "Le courant ne passe pas tant que la boucle est coupée."),
];
