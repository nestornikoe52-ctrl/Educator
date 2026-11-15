import type { MatiereCode, NiveauCode } from "@education-togo/shared";

export interface ExerciceCatalogue {
  niveau: NiveauCode;
  matiere: MatiereCode;
  chapitreOrdre: number;
  question: string;
  critere: string;
  piste: string;
}

export const EXERCICES_OUVERTS: ExerciceCatalogue[] = [
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 1,
    question:
      "Cite deux gestes qui réduisent les déchets solides autour de chez toi. Explique pourquoi l’un d’eux protège le milieu.",
    critere:
      "Deux gestes concrets, par exemple trier, réutiliser, ne pas brûler le plastique, déposer les piles en collecte, ne pas jeter dans la rue. L’élève relie un geste à un effet sur le sol, l’eau ou l’air.",
    piste: "Réutiliser un sac et porter les piles à un point de collecte. Ne pas brûler le plastique évite des fumées nocives.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 1,
    question: "Pourquoi est-il dangereux de brûler des sachets en plastique ?",
    critere: "L’élève dit que la fumée est nocive pour la santé ou pollue l’air. Une formulation simple suffit.",
    piste: "Brûler le plastique libère des fumées qui polluent l’air et peuvent rendre malade.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 2,
    question: "Décris une chaîne alimentaire avec un producteur, un consommateur et un décomposeur.",
    critere:
      "Une plante verte comme producteur, un animal qui la mange, puis un champignon ou un micro-organisme qui recycle la matière morte.",
    piste: "L’herbe produit la matière, la chèvre la mange, les champignons décomposent les restes.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 3,
    question: "Donne deux besoins d’un animal d’élevage et une conséquence du surpâturage.",
    critere: "Nourriture, eau ou abri, et l’idée que trop d’animaux au même endroit abîment l’herbe ou le sol.",
    piste: "Le mouton a besoin d’herbe et d’eau. Trop d’animaux sur le même pâturage laissent le sol à nu.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 4,
    question: "Compose un repas simple avec un aliment de force, un aliment de construction et un aliment de protection.",
    critere: "Céréale ou tubercule, protéine (poisson, œuf, légumineuse ou viande), fruit ou légume. L’eau peut être citée en plus.",
    piste: "Pâte de maïs, poisson et mangue. La pâte donne l’énergie, le poisson construit le corps, le fruit protège.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 5,
    question: "Explique deux gestes qui limitent l’ascaridiose.",
    critere: "Hygiène des mains et aliments ou eau propres. L’élève relie ces gestes aux œufs du ver.",
    piste: "Se laver les mains avant de manger et laver les fruits. Les œufs du parasite passent souvent par les mains sales.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 6,
    question: "Cite un mode de transmission du VIH et un moyen de s’en protéger.",
    critere: "Sang, rapport non protégé ou mère-enfant, et préservatif, non-partage des lames ou dépistage. Pas la poignée de main.",
    piste: "Le VIH peut passer par un rapport non protégé. Le préservatif réduit ce risque.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 7,
    question: "Par où une plante terrestre absorbe-t-elle l’eau, et que se passe-t-il si cette partie reste au sec ?",
    critere: "Les racines ou les poils absorbants. Sans eau, la plante se fane.",
    piste: "L’eau entre par les poils absorbants des racines. Si les racines restent au sec, la plante se fane.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 8,
    question: "De quoi une plante verte a-t-elle besoin pour la photosynthèse, et que rejette-t-elle ?",
    critere: "Lumière, eau et dioxyde de carbone. Elle rejette du dioxygène.",
    piste: "Il lui faut de la lumière, de l’eau et du dioxyde de carbone. Elle rejette du dioxygène.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 9,
    question: "Qu’est-ce qui se réunit lors de la fécondation, et qu’est-ce que cela permet ?",
    critere: "Un gamète mâle et un gamète femelle. Cela forme un œuf qui peut donner un nouvel individu ou une graine.",
    piste: "Les deux gamètes se rencontrent. L’œuf peut se développer en un nouvel être vivant.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 10,
    question: "Pourquoi une grossesse précoce présente-t-elle un risque, et cite un moyen de l’éviter ?",
    critere: "Le corps n’est pas prêt ou la santé de la fille est en jeu. Abstinence ou rapport protégé.",
    piste: "Le corps d’une collégienne n’est pas prêt. L’abstinence, ou un rapport protégé plus tard, évite une grossesse non prévue.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 11,
    question: "Explique pourquoi le bouturage du manioc est une reproduction asexuée.",
    critere: "Un fragment de tige donne un nouveau plant sans graine ni fécondation.",
    piste: "On plante un morceau de tige. Le nouveau plant se forme sans fleur ni graine.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 12,
    question: "Nomme deux constituants du sol et dis à quoi le sol sert pour une culture.",
    critere: "Matière minérale, humus, air ou eau. Le sol porte la plante et lui fournit l’eau et les sels.",
    piste: "Le sol contient des particules minérales et de l’humus. Les racines s’y ancrent et y trouvent l’eau.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 13,
    question: "Décris une action qui dégrade le sol et une action qui le protège.",
    critere: "Déboisement, feu ou sol laissé nu d’un côté. Arbres, paillage ou couvert végétal de l’autre.",
    piste: "Couper tous les arbres laisse la pluie emporter la terre. Planter des arbres retient le sol.",
  },
  {
    niveau: "5e",
    matiere: "SVT",
    chapitreOrdre: 14,
    question: "Pourquoi ne cultive-t-on pas la même plante sur tous les sols du Togo ?",
    critere: "Les plantes n’ont pas les mêmes besoins de sol, d’eau ou de climat. Un exemple local est un plus.",
    piste: "Le maïs, le sorgho ou l’arachide réussissent selon le sol et la pluie de la région.",
  },
  {
    niveau: "5e",
    matiere: "MATHEMATIQUES",
    chapitreOrdre: 1,
    question:
      "Un prisme droit a une base de 12 cm² et une hauteur de 5 cm. Calcule son volume et rappelle la formule utilisée.",
    critere: "Volume = aire de la base × hauteur. Le calcul donne 60 cm³, avec l’unité.",
    piste: "V = aire de la base × hauteur = 12 × 5 = 60 cm³.",
  },
  {
    niveau: "5e",
    matiere: "PCT",
    chapitreOrdre: 1,
    question: "Une lampe ne brille pas. Le circuit contient une pile et un interrupteur ouvert. Explique pourquoi.",
    critere: "Le circuit est ouvert, donc le courant ne circule pas. Fermer l’interrupteur rétablirait la boucle.",
    piste: "L’interrupteur ouvert coupe la boucle. Sans circuit fermé, le courant ne passe pas et la lampe reste éteinte.",
  },
];
