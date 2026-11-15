import type { CorrectionExercice, PartieExercices } from "@education-togo/shared";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { commencerExercices, repondreExercice, terminerExercices } from "../../../src/api";
import { lireJeton } from "../../../src/session";
import { colors } from "../../../src/theme";

export default function ExercicesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [jeton, setJeton] = useState<string | null>(null);
  const [partie, setPartie] = useState<PartieExercices | null>(null);
  const [index, setIndex] = useState(0);
  const [texte, setTexte] = useState("");
  const [correction, setCorrection] = useState<CorrectionExercice | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
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
    setTexte("");
    setIndex(0);
    setPartie(null);
    try {
      setPartie(await commencerExercices(id, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "Les exercices n’ont pas pu démarrer.");
    }
  }

  async function envoyer() {
    if (!jeton || !partie || !question || envoi || correction) {
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      setCorrection(await repondreExercice(partie.sessionId, question.id, texte, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "La correction n’a pas été enregistrée.");
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
      void terminerExercices(partie.sessionId, jeton).catch(() => undefined);
      return;
    }
    setCorrection(null);
    setTexte("");
    setIndex((valeur) => valeur + 1);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: "Exercices" }} />
      {!jeton ? <Text style={styles.texte}>Connecte-toi pour garder tes réponses.</Text> : null}
      {jeton && !partie && !bilan ? (
        <Pressable style={styles.bouton} onPress={() => void lancer()}>
          <Text style={styles.boutonTexte}>Commencer</Text>
        </Pressable>
      ) : null}
      {bilan ? (
        <View style={styles.carte}>
          <Text style={styles.score}>
            {bilan.score} réponse{bilan.score > 1 ? "s" : ""}
          </Text>
          <Text style={styles.texte}>Tes réponses sont enregistrées. Le professeur pourra les lire.</Text>
          <Pressable style={styles.bouton} onPress={() => void lancer()}>
            <Text style={styles.boutonTexte}>Recommencer</Text>
          </Pressable>
        </View>
      ) : null}
      {question && !bilan ? (
        <View>
          <Text style={styles.meta}>
            Exercice {index + 1} / {partie?.questions.length}
          </Text>
          <Text style={styles.question}>{question.question}</Text>
          <TextInput
            value={texte}
            onChangeText={setTexte}
            editable={!correction && !envoi}
            multiline
            placeholder="Écris ta réponse."
            placeholderTextColor={colors.muted}
            style={styles.champ}
          />
          {correction ? (
            <View style={styles.carte}>
              <Text style={styles.texte}>Réponse enregistrée. {correction.feedback}</Text>
              {correction.piste ? <Text style={styles.texte}>Piste : {correction.piste}</Text> : null}
              <Pressable style={styles.bouton} onPress={continuer}>
                <Text style={styles.boutonTexte}>
                  {correction.terminee ? "Terminer" : "Exercice suivant"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.bouton}
              disabled={envoi || texte.trim().length < 2}
              onPress={() => void envoyer()}
            >
              <Text style={styles.boutonTexte}>{envoi ? "Enregistrement…" : "Envoyer"}</Text>
            </Pressable>
          )}
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
  champ: {
    minHeight: 120,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    color: colors.ink,
    backgroundColor: colors.card,
    textAlignVertical: "top",
    marginBottom: 12,
  },
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
