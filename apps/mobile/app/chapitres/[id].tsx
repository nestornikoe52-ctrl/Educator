import { ACTIVITES, type ChapitrePublie } from "@education-togo/shared";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { lirePackDistant } from "../../src/api";
import { ecrirePack, lirePack } from "../../src/horsLigne";
import { lireJeton } from "../../src/session";
import { colors } from "../../src/theme";

const API_URL = "http://localhost:3001/api";

export default function ChapitreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapitre, setChapitre] = useState<ChapitrePublie | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [pack, setPack] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    fetch(`${API_URL}/chapitres/${id}`)
      .then(async (reponse) => {
        if (!reponse.ok) {
          throw new Error("Ce chapitre n’existe pas.");
        }
        return (await reponse.json()) as ChapitrePublie;
      })
      .then(setChapitre)
      .catch((error: unknown) => {
        setErreur(error instanceof Error ? error.message : "Ce chapitre n’existe pas.");
      });
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    void lirePack(id).then((stocke) => setPack(stocke ? "prêt" : null));
  }, [id]);

  async function telecharger() {
    if (!id) {
      return;
    }
    const jeton = await lireJeton();
    if (!jeton) {
      setPack("Connecte-toi pour télécharger.");
      return;
    }
    try {
      await ecrirePack(await lirePackDistant(id, jeton));
      setPack("QCM et trivia prêts hors ligne.");
    } catch (error: unknown) {
      setPack(error instanceof Error ? error.message : "Le téléchargement a échoué.");
    }
  }

  if (erreur) {
    return (
      <View style={styles.screen}>
        <Text style={styles.erreur}>{erreur}</Text>
      </View>
    );
  }

  if (!chapitre) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement du chapitre…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: chapitre.titre }} />
      <Text style={styles.kicker}>
        {chapitre.niveau.code} · {chapitre.matiere.nom}
      </Text>
      <Text style={styles.titre}>{chapitre.titre}</Text>
      <Text style={styles.resume}>{chapitre.resumeCours}</Text>
      <View style={styles.activites}>
        {ACTIVITES.map((activite) =>
          activite.code === "trivia" || activite.code === "qcm" || activite.code === "exercices" ? (
            <Link
              key={activite.code}
              href={`/chapitres/${chapitre.id}/${activite.code}`}
              style={styles.trivia}
            >
              {activite.nom}
            </Link>
          ) : (
            <Text
              key={activite.code}
              style={activite.code === "resume" ? styles.actif : styles.inactif}
            >
              {activite.nom}
              {activite.code === "resume" ? "" : " · bientôt"}
            </Text>
          ),
        )}
      </View>
      <Pressable style={styles.trivia} onPress={() => void telecharger()}>
        <Text style={{ color: colors.green }}>{pack ? "Mettre à jour hors ligne" : "Télécharger hors ligne"}</Text>
      </Pressable>
      {pack ? <Text style={styles.muted}>{pack}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12 },
  kicker: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  titre: { color: colors.ink, fontSize: 32, fontWeight: "600" },
  resume: { color: colors.ink, fontSize: 16, lineHeight: 24 },
  activites: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  actif: {
    backgroundColor: colors.greenDeep,
    color: colors.card,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trivia: {
    color: colors.green,
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  inactif: {
    color: colors.muted,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  muted: { color: colors.muted },
  erreur: { color: "#8d2b1f" },
});