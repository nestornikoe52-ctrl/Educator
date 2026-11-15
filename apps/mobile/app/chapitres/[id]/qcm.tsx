import type { CorrectionQcm, PartieQcm, QuestionHorsLigne } from "@education-togo/shared";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { commencerQcm, repondreQcm, terminerQcm } from "../../../src/api";
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
  return "Relis le résumé du chapitre, puis recommence.";
}

export default function QcmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [jeton, setJeton] = useState<string | null>(null);
  const [partie, setPartie] = useState<PartieQcm | null>(null);
  const [index, setIndex] = useState(0);
  const [correction, setCorrection] = useState<CorrectionQcm | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const horsLigneRef = useRef(false);
  const corrigeeRef = useRef<Map<string, QuestionHorsLigne>>(new Map());
  const localesRef = useRef<{ exerciceId: string; reponse: string }[]>([]);
  const question = partie?.questions[index];

  useEffect(() => {
    void lireJeton().then(setJeton);
  }, []);

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
      setPartie(await commencerQcm(id, jeton));
    } catch (error: unknown) {
      const pack = await lirePack(id);
      if (!pack || pack.qcm.length === 0) {
        setErreur(error instanceof Error ? error.message : "Le QCM n’a pas pu démarrer.");
        return;
      }
      const locales = questionsLocales(pack.qcm);
      corrigeeRef.current = locales.corrigee;
      horsLigneRef.current = true;
      setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
    }
  }

  async function envoyer(reponse: string) {
    if (!jeton || !partie || !question || envoi || correction) {
      return;
    }
    setEnvoi(true);
    if (horsLigneRef.current) {
      const note = noterLocalement(corrigeeRef.current, question.id, reponse);
      if (!note) {
        setEnvoi(false);
        return;
      }
      localesRef.current.push({ exerciceId: question.id, reponse });
      const score = localesRef.current.filter((item) =>
        noterLocalement(corrigeeRef.current, item.exerciceId, item.reponse)?.correct,
      ).length;
      setCorrection({
        ...note,
        score,
        total: partie.questions.length,
        terminee: localesRef.current.length >= partie.questions.length,
      });
      setEnvoi(false);
      return;
    }
    try {
      setCorrection(await repondreQcm(partie.sessionId, question.id, reponse, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "La réponse n’a pas été enregistrée.");
    } finally {
      setEnvoi(false);
    }
  }

  function continuer() {
    if (!correction || !partie || !jeton) {
      return;
    }
    if (correction.terminee || index + 1 >= partie.questions.length) {
      setBilan({ score: correction.score, total: correction.total });
      if (horsLigneRef.current) {
        void ajouterPartie({
          cleClient: partie.sessionId,
          chapitreId: id,
          type: "qcm",
          reponses: localesRef.current,
        }).then(() => synchroniserFile(jeton));
        return;
      }
      void terminerQcm(partie.sessionId, jeton).catch(() => undefined);
      return;
    }
    setCorrection(null);
    setIndex((valeur) => valeur + 1);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: "QCM" }} />
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
            <Text style={styles.boutonTexte}>Recommencer</Text>
          </Pressable>
        </View>
      ) : null}
      {question && !bilan ? (
        <View>
          <Text style={styles.meta}>
            Question {index + 1} / {partie?.questions.length}
          </Text>
          <Text style={styles.question}>{question.question}</Text>
          {question.choixPossibles.map((choix) => {
            const bonne = correction?.bonneReponse === choix;
            return (
              <Pressable
                key={choix}
                disabled={Boolean(correction) || envoi}
                onPress={() => void envoyer(choix)}
                style={[styles.choix, bonne && correction ? styles.bonne : null]}
              >
                <Text style={bonne && correction ? styles.bonneTexte : styles.choixTexte}>{choix}</Text>
              </Pressable>
            );
          })}
          {correction ? (
            <View style={styles.carte}>
              <Text style={styles.texte}>
                {correction.correct ? "Bonne réponse." : "Pas cette fois."} {correction.explication}
              </Text>
              <Pressable style={styles.bouton} onPress={continuer}>
                <Text style={styles.boutonTexte}>
                  {correction.terminee ? "Voir le score" : "Question suivante"}
                </Text>
              </Pressable>
            </View>
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
