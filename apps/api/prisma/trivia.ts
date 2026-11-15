import type { MatiereCode, NiveauCode } from "@education-togo/shared";

export interface QuestionCatalogue {
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
): QuestionCatalogue {
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

export const QUESTIONS_TRIVIA: QuestionCatalogue[] = [
  q("5e", "SVT", 1, "Quel déchet solide ne doit pas être brûlé ?", ["Un sachet plastique", "Une feuille morte", "Un reste de fruit", "Du papier mouillé"], 0, "Brûler le plastique libère des fumées nocives. On le trie ou on le recycle."),
  q("5e", "SVT", 1, "Que faire des piles usagées ?", ["Les jeter dans la cour", "Les mettre avec les épluchures", "Les déposer dans un point de collecte", "Les enterrer au champ"], 2, "Les piles contiennent des substances qui polluent le sol et l’eau."),
  q("5e", "SVT", 2, "Dans une chaîne alimentaire, qui produit la matière de départ ?", ["Les plantes vertes", "Les lions", "Les champignons", "Les vers de terre"], 0, "Les plantes fabriquent leur matière grâce à la lumière. Elles sont les producteurs."),
  q("5e", "SVT", 2, "Quel être vivant recycle la matière morte ?", ["Un décomposeur", "Un consommateur", "Un producteur", "Un prédateur"], 0, "Champignons et micro-organismes transforment la matière morte."),
  q("5e", "SVT", 3, "Quel animal d’élevage mange surtout de l’herbe ?", ["Le mouton", "La poule", "Le porc", "Le poisson-chat"], 0, "Moutons, chèvres et bœufs sont des herbivores. La poule mange surtout des graines."),
  q("5e", "SVT", 3, "Pourquoi éviter le surpâturage ?", ["Pour garder le sol et l’herbe", "Pour empêcher les animaux de boire", "Pour supprimer les vaccins", "Pour augmenter les feux de brousse"], 0, "Trop d’animaux au même endroit abîment le couvert végétal et le sol."),
  q("5e", "SVT", 4, "Quel aliment apporte surtout de l’énergie ?", ["La pâte de céréales", "L’eau pure", "Le sel", "Le thé sans sucre"], 0, "Céréales et tubercules sont des aliments de force. Ils fournissent l’énergie du travail."),
  q("5e", "SVT", 4, "Quel groupe protège surtout l’organisme ?", ["Les fruits et les légumes", "L’huile seule", "Le sucre seul", "Le sel seul"], 0, "Fruits et légumes sont des aliments de protection."),
  q("5e", "SVT", 5, "L’ascaridiose est une maladie due à…", ["Un ver parasite", "Un manque de sel", "Une fracture", "Un excès de lumière"], 0, "L’ascaris est un ver. On s’en protège par l’hygiène, l’eau propre et des aliments bien lavés."),
  q("5e", "SVT", 5, "Quel geste limite l’ascaridiose ?", ["Se laver les mains avant de manger", "Dormir sans moustiquaire seulement", "Éviter toute activité physique", "Boire l’eau d’une flaque"], 0, "Les œufs du parasite passent souvent par les mains et les aliments souillés."),
  q("5e", "SVT", 6, "Le VIH se transmet surtout par…", ["Les rapports sexuels non protégés", "Une poignée de main", "Un repas partagé", "Une piqûre de moustique"], 0, "Le VIH passe par le sang, les rapports non protégés et de la mère à l’enfant. Pas par le contact ordinaire."),
  q("5e", "SVT", 6, "Quel moyen réduit le risque d’IST ?", ["Le préservatif", "Le partage d’une lame", "L’absence de tout dépistage", "Le refus de se laver les mains seulement"], 0, "Le préservatif protège lors d’un rapport. Le dépistage complète la prévention."),
  q("5e", "SVT", 7, "Par où la plante absorbe-t-elle surtout l’eau ?", ["Par les poils absorbants des racines", "Par les fleurs seulement", "Par les fruits", "Par les épines"], 0, "Les poils absorbants de la racine prélèvent l’eau et les sels minéraux."),
  q("5e", "SVT", 7, "Une plante terrestre dont les racines restent hors de l’eau…", ["Se fane", "Grandit plus vite", "Fabrique plus de graines", "Devient un champignon"], 0, "Sans eau aux racines, la plante ne peut plus se maintenir."),
  q("5e", "SVT", 8, "La photosynthèse a besoin de…", ["Lumière, eau et dioxyde de carbone", "Obscurité totale", "Sel de cuisine seulement", "Absence d’air"], 0, "À la lumière, la plante verte fabrique de la matière et rejette du dioxygène."),
  q("5e", "SVT", 8, "Que rejette la plante verte lors de la photosynthèse ?", ["Du dioxygène", "Du plastique", "Du pétrole", "Du fer"], 0, "Ce rejet contribue à renouveler le dioxygène de l’air."),
  q("5e", "SVT", 9, "La reproduction sexuée des animaux nécessite…", ["Des gamètes mâle et femelle", "Seulement une bouture", "Un sol sans eau", "Une seule feuille"], 0, "Les gamètes se rencontrent lors de la fécondation, puis l’œuf se développe."),
  q("5e", "SVT", 9, "Chez une plante à fleurs, la graine se forme après…", ["La fécondation", "La chute de toutes les racines", "La photosynthèse nocturne seule", "Le bouturage"], 0, "La fleur permet la fécondation. La graine pourra germer."),
  q("5e", "SVT", 10, "Une grossesse précoce présente surtout…", ["Des risques pour la santé de la fille", "Un avantage scolaire", "Une protection contre les IST", "Une croissance plus rapide du squelette"], 0, "Le corps n’est pas prêt. La prévention passe par l’information et la protection."),
  q("5e", "SVT", 10, "Quel comportement évite une grossesse non prévue ?", ["Un rapport protégé ou l’abstinence", "Ignorer le cycle", "Partager une serviette", "Sauter le petit-déjeuner"], 0, "Sans rapport sexuel, ou avec une protection adaptée, le risque de grossesse baisse."),
  q("5e", "SVT", 11, "Le bouturage du manioc est une reproduction…", ["Asexuée", "Sexuée", "Uniquement animale", "Impossible en agriculture"], 0, "Un fragment de tige donne un nouveau plant, sans graine."),
  q("5e", "SVT", 11, "Quel exemple est une multiplication végétative ?", ["Le rejet du bananier", "La graine de maïs", "L’œuf de poule", "Le pollen"], 0, "Le bananier se multiplie par drageonnage, sans fécondation."),
  q("5e", "SVT", 12, "Le sol est composé notamment de…", ["Matière minérale et matière organique", "Seulement de plastique", "Seulement d’eau de pluie", "Uniquement de roche nue"], 0, "On y trouve des particules minérales, des débris vivants, de l’air et de l’eau."),
  q("5e", "SVT", 12, "À quoi sert le sol pour une culture ?", ["Il porte la plante et lui fournit eau et sels", "Il remplace la lumière", "Il empêche toute racine", "Il produit le dioxygène à la place des feuilles"], 0, "Les racines s’y ancrent et y puisent ce dont la plante a besoin."),
  q("5e", "SVT", 13, "Quelle action humaine dégrade le sol ?", ["Le déboisement", "La jachère raisonnée", "Le paillage", "La plantation d’arbres"], 0, "Sans couvert végétal, la pluie et le vent emportent la terre."),
  q("5e", "SVT", 13, "Le ruissellement violent peut…", ["Emporter la couche fertile", "Créer de l’humus immédiatement", "Arrêter l’érosion", "Remplacer les engrais"], 0, "L’eau qui file en surface arrache les particules du sol."),
  q("5e", "SVT", 14, "Quelle culture vivrière est courante au Togo ?", ["Le maïs", "Le blé de montagne uniquement", "Le riz de mangrove seulement", "La vigne de climat froid"], 0, "Maïs, sorgho, arachide ou soja se cultivent selon le sol et la région."),
  q("5e", "SVT", 14, "Pourquoi relier la culture au type de sol ?", ["Toutes les plantes n’y poussent pas aussi bien", "Le sol n’a aucun effet", "Pour éviter d’arroser à jamais", "Pour supprimer les saisons"], 0, "Un sol adapté donne de meilleures récoltes et s’épuise moins vite."),
  q("5e", "MATHEMATIQUES", 1, "Un prisme droit a des bases…", ["Parallèles et superposables", "Toujours rondes", "Sans aucune arête", "Réduites à un point"], 0, "Les deux bases d’un prisme droit sont des polygones identiques, reliés par des faces rectangulaires."),
  q("5e", "MATHEMATIQUES", 1, "Le volume d’un prisme droit se calcule avec…", ["Aire de la base × hauteur", "Périmètre seul", "Diagonale × 2", "Nombre de sommets"], 0, "On multiplie l’aire de la base par la hauteur du prisme."),
  q("5e", "PCT", 1, "Pour qu’une lampe brille, le circuit doit être…", ["Fermé", "Ouvert", "Sans pile", "Coupé au milieu"], 0, "Le courant circule seulement si le circuit forme une boucle fermée."),
  q("5e", "PCT", 1, "L’interrupteur ouvert…", ["Empêche la lampe de briller", "Augmente toujours la tension de la pile", "Remplace la pile", "Crée de la lumière sans fil"], 0, "Ouvert, il coupe la boucle. La lampe reste éteinte."),
];
