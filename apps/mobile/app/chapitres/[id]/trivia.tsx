import type { CorrectionTrivia, PartieTrivia, QuestionHorsLigne } from "@education-togo/shared";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { commencerTrivia, repondreTrivia, terminerTrivia } from "../../../src/api";
import { ajouterPartie, lirePack, noterLocalement, questionsLocales, synchroniserFile } from "../../../src/horsLigne";
import { lireJeton } from "../../../src/session";
import { colors } from "../../../src/theme";

function phrase(score: number, total: number) {
  if (total > 0 && score === total) {
    return "Sans faute.";
  }
  if (total > 0 && score / total >= 0.6) {
    return "Bien joué.";
  }
  return "Relis le résumé du chapitre, puis rejoue.";
}

export default function TriviaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [jeton, setJeton] = useState<string | null>(null);
  const [partie, setPartie] = useState<PartieTrivia | null>(null);
  const [index, setIndex] = useState(0);
  const [reste, setReste] = useState(0);
  const [correction, setCorrection] = useState<CorrectionTrivia | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const envoiRef = useRef(false);
  const echeanceRef = useRef<number | null>(null);
  const horsLigneRef = useRef(false);
  const corrigeeRef = useRef<Map<string, QuestionHorsLigne>>(new Map());
  const localesRef = useRef<{ exerciceId: string; reponse: string }[]>([]);
  const question = partie?.questions[index];

  useEffect(() => {
    void lireJeton().then(setJeton);
  }, []);

  useEffect(() => {
    if (!question || correction || bilan) {
      return;
    }
    echeanceRef.current = Date.now() + question.dureeSecondes * 1000;
    setReste(question.dureeSecondes);
    const minuteur = setInterval(() => {
      const echeance = echeanceRef.current ?? Date.now();
      setReste(Math.max(0, Math.ceil((echeance - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(minuteur);
  }, [question, correction, bilan]);

  useEffect(() => {
    if (!question || correction || bilan || reste > 0 || envoiRef.current || !jeton || !partie) {
      return;
    }
    const echeance = echeanceRef.current;
    if (echeance === null || Date.now() < echeance) {
      return;
    }
    void envoyer("");
  }, [reste, question, correction, bilan, jeton, partie]);

  async function lancer() {
    if (!jeton || !id) {
      return;
    }
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setIndex(0);
    setPartie(null);
    horsLigneRef.current = false;
    localesRef.current = [];
    try {
      setPartie(await commencerTrivia(id, jeton));
    } catch (error: unknown) {
      const pack = await lirePack(id);
      if (!pack || pack.trivia.length === 0) {
        setErreur(error instanceof Error ? error.message : "Le trivia n’a pas pu démarrer.");
        return;
      }
      const locales = questionsLocales(pack.trivia);
      corrigeeRef.current = locales.corrigee;
      horsLigneRef.current = true;
      setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
    }
  }

  async function envoyer(reponse: string) {
    if (!jeton || !partie || !question || envoiRef.current || correction) {
      return;
    }
    envoiRef.current = true;
    if (horsLigneRef.current) {
      const note = noterLocalement(corrigeeRef.current, question.id, reponse);
      if (!note) {
        envoiRef.current = false;
        return;
      }
      localesRef.current.push({ exerciceId: question.id, reponse });
      const score = localesRef.current.filter((item) =>
        noterLocalement(corrigeeRef.current, item.exerciceId, item.reponse)?.correct,
      ).length;
      const resultat = {
        ...note,
        score,
        total: partie.questions.length,
        terminee: localesRef.current.length >= partie.questions.length,
      };
      setCorrection(resultat);
      setTimeout(() => {
        envoiRef.current = false;
        setCorrection(null);
        if (resultat.terminee) {
          setBilan({ score: resultat.score, total: resultat.total });
          void ajouterPartie({
            cleClient: partie.sessionId,
            chapitreId: id,
            type: "trivia",
            reponses: localesRef.current,
          }).then(() => synchroniserFile(jeton));
          return;
        }
        setIndex((valeur) => valeur + 1);
      }, 1400);
      return;
    }
    try {
      const resultat = await repondreTrivia(partie.sessionId, question.id, reponse, jeton);
      setCorrection(resultat);
      setTimeout(() => {
        envoiRef.current = false;
        setCorrection(null);
        if (resultat.terminee || index + 1 >= partie.questions.length) {
          setBilan({ score: resultat.score, total: resultat.total });
          void terminerTrivia(partie.sessionId, jeton).catch(() => undefined);
          return;
        }
        setIndex((valeur) => valeur + 1);
      }, 1400);
    } catch (error: unknown) {
      envoiRef.current = false;
      setErreur(error instanceof Error ? error.message : "La réponse n’a pas été enregistrée.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: "Trivia" }} />
      {!jeton ? <Text style={styles.texte}>Connecte-toi pour garder ton score.</Text> : null}
      {jeton && !partie && !bilan ? (
        <Pressable style={styles.bouton} onPress={() => void lancer()}>
          <Text style={styles.boutonTexte}>Commencer</Text>
        </Pressable>
      ) : null}
      {bilan ? (
        <View style={styles.carte}>
          <Text style={styles.score}>
            {bilan.score}/{bilan.total}
          </Text>
          <Text style={styles.texte}>{phrase(bilan.score, bilan.total)}</Text>
          <Pressable style={styles.bouton} onPress={() => void lancer()}>
            <Text style={styles.boutonTexte}>Rejouer</Text>
          </Pressable>
        </View>
      ) : null}
      {question && !bilan ? (
        <View>
          <Text style={styles.meta}>
            Question {index + 1} / {partie?.questions.length} · {reste} s
          </Text>
          <Text style={styles.question}>{question.question}</Text>
          {question.choixPossibles.map((choix) => {
            const bonne = correction?.bonneReponse === choix;
            return (
              <Pressable
                key={choix}
                disabled={Boolean(correction)}
                onPress={() => void envoyer(choix)}
                style={[styles.choix, bonne && correction ? styles.bonne : null]}
              >
                <Text style={bonne && correction ? styles.bonneTexte : styles.choixTexte}>{choix}</Text>
              </Pressable>
            );
          })}
          {correction ? (
            <Text style={styles.texte}>
              {correction.correct ? "Bonne réponse." : "Pas cette fois."} {correction.explication}
            </Text>
          ) : null}
        </View>
      ) : null}
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12 },
  meta: { color: colors.muted, marginBottom: 8 },
  question: { color: colors.ink, fontSize: 26, fontWeight: "600", marginBottom: 12 },
  choix: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    backgroundColor: colors.card,
  },
  choixTexte: { color: colors.ink, fontSize: 16 },
  bonne: { backgroundColor: colors.green, borderColor: colors.green },
  bonneTexte: { color: colors.card, fontSize: 16 },
  texte: { color: colors.ink, fontSize: 16, lineHeight: 24 },
  score: { color: colors.ink, fontSize: 42, fontWeight: "600" },
  carte: { gap: 12 },
  bouton: {
    alignSelf: "flex-start",
    backgroundColor: colors.greenDeep,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  boutonTexte: { color: colors.card, fontWeight: "600" },
  erreur: { color: "#8d2b1f" },
});
