import type { LeconProgression } from "./progressions";

export const FORMATS = [
  { id: "qcm", label: "QCM" },
  { id: "vrai_faux", label: "Vrai/Faux" },
  { id: "association", label: "Association" },
  { id: "texte_a_trous", label: "Texte à trous" },
  { id: "traditionnel", label: "Exercice traditionnel" },
  { id: "situation_integration", label: "Situation d'intégration avec consignes" },
] as const;

export const TYPES_DOCUMENT = [
  { id: "exercice_application", label: "Exercice d'application" },
  { id: "devoir", label: "Devoir" },
  { id: "interrogation", label: "Interrogation" },
  { id: "evaluation", label: "Évaluation" },
  { id: "revision", label: "Sujet de révision" },
  { id: "maison", label: "Exercice de maison" },
] as const;

export type FormatExercice = (typeof FORMATS)[number]["id"];
export type TypeDocument = (typeof TYPES_DOCUMENT)[number]["id"];
export type Difficulte = "facile" | "moyen" | "difficile";

export type QuestionGeneree = { texte: string; points: number };

export type ExerciceGenere = {
  numero: number;
  type: FormatExercice;
  enonce: string;
  questions: QuestionGeneree[];
  corrige: string | null;
};

export type SujetGenere = {
  titre: string;
  consignes: string;
  exercices: ExerciceGenere[];
};

export type DemandeGeneration = {
  lecons: LeconProgression[];
  typeDocument: TypeDocument;
  nombre: number;
  difficulte: Difficulte;
  duree: string;
  bareme: number;
  formats: FormatExercice[];
  avecCorrige: boolean;
  graine?: number;
};

export type MoteurGeneration = (prompt: string) => Promise<string>;

const LIEUX = [
  "marché de Lomé",
  "marché de Kara",
  "champ de maïs à Tsévié",
  "collège de Kpalimé",
  "port de Lomé",
  "concession de Sokodé",
  "route de Dapaong",
  "lagune d'Aného",
];

const PRENOMS = ["Kodjo", "Afi", "Kossi", "Ama", "Yao", "Akoua", "Komlan", "Essi"];

function norm(texte: string) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function parts(total: number, nombre: number) {
  const base = Math.floor(total / nombre);
  const reste = total % nombre;
  return Array.from({ length: nombre }, (_, index) => base + (index < reste ? 1 : 0));
}

function libelleDocument(type: TypeDocument) {
  return TYPES_DOCUMENT.find((item) => item.id === type)?.label ?? "Sujet";
}

function libelleFormat(format: FormatExercice) {
  return FORMATS.find((item) => item.id === format)?.label ?? format;
}

export function promptInterne(demande: DemandeGeneration) {
  const lecon = demande.lecons.map((item) => item.lecon).join(" ; ");
  const theme = [...new Set(demande.lecons.map((item) => item.theme))].join(" ; ");
  const sousTitres = demande.lecons.flatMap((item) => item.sous_titres).join(" ; ");
  const matiere = demande.lecons[0]?.matiere ?? "";
  const classe = demande.lecons[0]?.classe ?? "";
  const avecCorrige = demande.avecCorrige
    ? "avec corrigé détaillé et barème"
    : "sans corrigé";
  return [
    `Tu es un professeur de ${matiere} au Togo, niveau ${classe}, programme APC.`,
    `Leçon : ${lecon} (thème : ${theme}). Contenus autorisés : ${sousTitres}.`,
    `Génère ${demande.nombre} exercice(s) de type ${demande.formats.map(libelleFormat).join(", ")}, difficulté ${demande.difficulte}, durée ${demande.duree}, barème /${demande.bareme}.`,
    `Règles : rester dans le contenu de la leçon et le niveau ${classe} ; contexte togolais ;`,
    `énoncés clairs et numérotés ; barème par question ; ${avecCorrige}.`,
    "Format de sortie : JSON {titre, consignes, exercices[{numero, type, enonce, questions[{texte, points}], corrige}]}.",
  ].join("\n");
}

function lireSujet(brut: string): SujetGenere | null {
  const debut = brut.indexOf("{");
  const fin = brut.lastIndexOf("}");
  if (debut < 0 || fin <= debut) return null;
  try {
    const valeur = JSON.parse(brut.slice(debut, fin + 1)) as SujetGenere;
    if (!valeur || typeof valeur.titre !== "string" || !Array.isArray(valeur.exercices)) return null;
    return valeur;
  } catch {
    return null;
  }
}

function contenu(lecon: LeconProgression, index: number) {
  return lecon.sous_titres[index % lecon.sous_titres.length];
}

function lieu(graine: number) {
  return LIEUX[Math.abs(graine) % LIEUX.length];
}

function prenom(graine: number) {
  return PRENOMS[Math.abs(graine) % PRENOMS.length];
}

function problemeMath(lecon: LeconProgression, sousTitre: string, difficulte: Difficulte, graine: number) {
  const texte = norm(`${lecon.lecon} ${sousTitre}`);
  if (texte.includes("fraction")) {
    const variantes =
      difficulte === "facile"
        ? [
            ["\\dfrac{1}{2}+\\dfrac{1}{4}", "\\dfrac{3}{4}", "\\dfrac{2}{4}+\\dfrac{1}{4}"],
            ["\\dfrac{1}{3}+\\dfrac{1}{3}", "\\dfrac{2}{3}", "\\dfrac{1}{3}+\\dfrac{1}{3}"],
          ]
        : difficulte === "moyen"
          ? [
              ["\\dfrac{3}{4}+\\dfrac{2}{5}", "\\dfrac{23}{20}", "\\dfrac{15}{20}+\\dfrac{8}{20}"],
              ["\\dfrac{1}{2}+\\dfrac{1}{3}", "\\dfrac{5}{6}", "\\dfrac{3}{6}+\\dfrac{2}{6}"],
              ["\\dfrac{2}{3}+\\dfrac{1}{6}", "\\dfrac{5}{6}", "\\dfrac{4}{6}+\\dfrac{1}{6}"],
            ]
          : [
              ["\\dfrac{5}{6}-\\dfrac{3}{8}", "\\dfrac{11}{24}", "\\dfrac{20}{24}-\\dfrac{9}{24}"],
              ["\\dfrac{7}{4}-\\dfrac{2}{3}", "\\dfrac{13}{12}", "\\dfrac{21}{12}-\\dfrac{8}{12}"],
            ];
    const [calcul, reponse, detail] = variantes[Math.abs(graine) % variantes.length];
    return {
      question: `Calcule $${calcul}$.`,
      reponse: `$${reponse}$`,
      corrige: `$${calcul}=${detail}=${reponse}$.`,
    };
  }
  if (texte.includes("pourcentage") || texte.includes("echelle")) {
    return {
      question:
        "Au marché de Lomé, un sac de riz coûte 800 FCFA. Le vendeur accorde 10 %. Quel prix Afi paie-t-elle ?",
      reponse: "720 FCFA",
      corrige: "Remise : $800\\times\\dfrac{10}{100}=80$ FCFA. Prix payé : $800-80=720$ FCFA.",
    };
  }
  if (texte.includes("puissance")) {
    return {
      question: "Calcule $2^{5}$ et $10^{3}$.",
      reponse: "32 et 1000",
      corrige: "$2^{5}=32$ et $10^{3}=1000$.",
    };
  }
  if (texte.includes("equation") || texte.includes("inequation")) {
    return difficulte === "facile"
      ? { question: "Résous $2x+4=12$.", reponse: "$x=4$", corrige: "$2x=8$, donc $x=4$." }
      : { question: "Résous $3x-5=16$.", reponse: "$x=7$", corrige: "$3x=21$, donc $x=7$." };
  }
  if (texte.includes("thales")) {
    return {
      question:
        "Figure à tracer, en centimètres : A(0,0), B(8,0), C(0,6), M(4,0) sur [AB], N(0,3) sur [AC], (MN) parallèle à (BC). BC mesure 10 cm. Trace la figure puis calcule MN.",
      reponse: "$MN=5$ cm",
      corrige:
        "Thalès : $\\dfrac{AM}{AB}=\\dfrac{MN}{BC}$. $\\dfrac{4}{8}=\\dfrac{MN}{10}$, donc $MN=5$ cm.",
    };
  }
  if (texte.includes("trigonometrie") || texte.includes("triangle rectangle")) {
    return {
      question:
        "Triangle rectangle en A : AB = 3 cm, AC = 4 cm, BC = 5 cm. Place A(0,0), B(3,0), C(0,4). Calcule $\\cos\\widehat{B}$.",
      reponse: "$\\dfrac{3}{5}$",
      corrige: "En B, le côté adjacent à l'angle est AB et l'hypoténuse est BC. $\\cos\\widehat{B}=\\dfrac{3}{5}$.",
    };
  }
  if (texte.includes("racine")) {
    return {
      question: "Calcule $\\sqrt{49}$ et $\\sqrt{144}$.",
      reponse: "7 et 12",
      corrige: "$\\sqrt{49}=7$ et $\\sqrt{144}=12$.",
    };
  }
  if (texte.includes("statistique")) {
    return {
      question: "Notes d'un devoir à Kpalimé : 8, 10, 12, 14. Calcule la moyenne.",
      reponse: "11",
      corrige: "Somme $8+10+12+14=44$. Moyenne $44\\div 4=11$.",
    };
  }
  if (texte.includes("proportion")) {
    return {
      question: "3 kg de maïs coûtent 600 FCFA à Tsévié. Combien coûtent 5 kg ?",
      reponse: "1000 FCFA",
      corrige: "1 kg coûte 200 FCFA. 5 kg coûtent $5\\times 200=1000$ FCFA.",
    };
  }
  return null;
}

function exercicePour(
  format: FormatExercice,
  lecon: LeconProgression,
  points: number,
  difficulte: Difficulte,
  graine: number,
  avecCorrige: boolean,
): Omit<ExerciceGenere, "numero"> {
  const sousTitre = contenu(lecon, graine);
  const place = lieu(graine);
  const eleve = prenom(graine + 3);
  const math = lecon.matiere === "Mathématiques" ? problemeMath(lecon, sousTitre, difficulte, graine) : null;
  const corrige = (texte: string) => (avecCorrige ? texte : null);
  const questionsDe = (textes: string[], detail: string) => {
    const poids = parts(points, textes.length);
    return {
      questions: textes.map((texte, index) => ({ texte, points: poids[index] })),
      corrige: corrige(detail),
    };
  };

  if (format === "qcm") {
    const autres = lecon.sous_titres.filter((item) => item !== sousTitre);
    const leurre = autres[0] ?? `une notion hors programme de ${lecon.classe}`;
    const question = math
      ? `${math.question}\nA. ${math.reponse}\nB. le double de ce résultat\nC. ${leurre}\nD. une réponse hors de la leçon « ${lecon.lecon} »`
      : `Quel contenu appartient exactement à la leçon « ${lecon.lecon} » ?\nA. ${sousTitre}\nB. ${leurre}\nC. une notion hors programme de ${lecon.classe}\nD. un thème d'une autre matière`;
    const detail = math
      ? `Réponse A : ${math.reponse}. ${math.corrige}`
      : `Réponse A. Seul « ${sousTitre} » est un contenu autorisé de cette leçon.`;
    return {
      type: format,
      enonce: `${eleve} révise « ${sousTitre} » (${lecon.theme}) à partir d'une situation du ${place}.`,
      ...questionsDe([question], detail),
    };
  }

  if (format === "vrai_faux") {
    const question = math
      ? `Vrai ou faux : ${math.question}`
      : `Vrai ou faux : en ${lecon.classe}, la leçon « ${lecon.lecon} » demande de traiter « ${sousTitre} ».`;
    const detail = math
      ? `La proposition se juge avec le calcul : ${math.corrige}`
      : "Vrai. L'affirmation reprend un sous-titre de la leçon, sans sortir du programme.";
    return {
      type: format,
      enonce: `Situation observée au ${place}.`,
      ...questionsDe([question], detail),
    };
  }

  if (format === "association") {
    const gauche = lecon.sous_titres.slice(0, 4);
    const droite = gauche.map((_, index) => `tâche ${index + 1} : l'illustrer au ${place}`);
    const paires = gauche.map((item, index) => `${item} — ${droite[index]}`).join(" ; ");
    return {
      type: format,
      enonce: `Relie chaque contenu de « ${lecon.lecon} » à la tâche qui lui correspond.`,
      ...questionsDe(
        [`Colonne A : ${gauche.join(" | ")}\nColonne B : ${droite.join(" | ")}`],
        `Appariements dans l'ordre : ${paires}.`,
      ),
    };
  }

  if (format === "texte_a_trous") {
    return {
      type: format,
      enonce: `${eleve}, au ${place}, rédige un court texte sur « ${lecon.lecon} ».`,
      ...questionsDe(
        [`En ${lecon.classe}, dans le thème « ${lecon.theme} », on étudie ______ .`],
        `Le trou attendu est : ${sousTitre}.`,
      ),
    };
  }

  if (format === "situation_integration") {
    const supports = lecon.sous_titres.slice(0, 3).join(" ; ");
    return {
      type: format,
      enonce: [
        `Contexte : ${eleve} habite près du ${place} et doit mobiliser la leçon « ${lecon.lecon} » (${lecon.theme}).`,
        `Support : les seuls contenus utilisables sont : ${supports}.`,
      ].join("\n"),
      ...questionsDe(
        [
          "1. Décris la situation avec les mots de la leçon.",
          "2. Traite la tâche demandée en t'appuyant sur le support.",
          "3. Propose une conclusion utile dans ce contexte togolais.",
        ],
        [
          "Critères :",
          "1. La description reste dans les sous-titres autorisés.",
          "2. La méthode correspond au niveau de la classe.",
          "3. La conclusion utilise le contexte local et les données du support.",
          math ? math.corrige : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    };
  }

  const calcul = math?.question ?? `Applique « ${sousTitre} » à une situation du ${place}.`;
  const detail = math?.corrige ?? [
    `Piste : rester sur « ${sousTitre} », niveau ${lecon.classe}.`,
    "1. Définir le contenu avec le vocabulaire du cours.",
    "2. L'utiliser dans la situation en FCFA, au champ, au marché ou au collège.",
    "3. Conclure en une phrase.",
  ].join("\n");
  return {
    type: format,
    enonce: `${eleve} travaille « ${sousTitre} », leçon « ${lecon.lecon} ».`,
    ...questionsDe(
      [calcul, `Explique la méthode utilisée, avec le vocabulaire de ${lecon.classe}.`],
      detail,
    ),
  };
}

export function genererLocalement(demande: DemandeGeneration): SujetGenere {
  if (demande.lecons.length === 0) {
    throw new Error("Choisis au moins une leçon.");
  }
  const formats = demande.formats.length > 0 ? demande.formats : (["traditionnel"] as FormatExercice[]);
  const nombre = Math.max(1, demande.nombre);
  const poids = parts(demande.bareme, nombre);
  const graine = demande.graine ?? 1;
  const premiere = demande.lecons[0];
  const exercices = poids.map((points, index) => {
    const lecon = demande.lecons[index % demande.lecons.length];
    const format = formats[index % formats.length];
    return {
      numero: index + 1,
      ...exercicePour(format, lecon, points, demande.difficulte, graine + index * 17, demande.avecCorrige),
    };
  });
  const titre = `${libelleDocument(demande.typeDocument)} — ${premiere.matiere} — ${premiere.classe}`;
  const lecons = demande.lecons.map((item) => item.lecon).join(" ; ");
  return {
    titre,
    consignes: `${libelleDocument(demande.typeDocument)} de ${demande.duree}, sur ${demande.bareme} points. Leçons : ${lecons}. Les réponses restent dans ces contenus et au niveau ${premiere.classe}.`,
    exercices,
  };
}

export async function generateExercises(
  demande: DemandeGeneration,
  modele?: MoteurGeneration,
): Promise<SujetGenere> {
  if (modele) {
    try {
      const sujet = lireSujet(await modele(promptInterne(demande)));
      if (sujet) return sujet;
    } catch {
      // Le moteur de langage est branché ici et peut être remplacé.
    }
  }
  return genererLocalement(demande);
}
