import { MATIERES, NIVEAUX, type ChapitrePublie } from "@education-togo/shared";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../src/theme";

const API_URL = "http://localhost:3001/api";

export default function ListeChapitresScreen() {
  const { code, matiere: codeMatiere } = useLocalSearchParams<{ code: string; matiere: string }>();
  const niveau = NIVEAUX.find((item) => item.code === code);
  const matiere = MATIERES.find((item) => item.code === codeMatiere);
  const [chapitres, setChapitres] = useState<ChapitrePublie[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!niveau || !matiere) {
      return;
    }
    const parametres = new URLSearchParams({ niveau: niveau.code, matiere: matiere.code });
    fetch(`${API_URL}/chapitres?${parametres.toString()}`)
      .then(async (reponse) => {
        if (!reponse.ok) {
          throw new Error("Les chapitres n’ont pas pu être chargés.");
        }
        return (await reponse.json()) as ChapitrePublie[];
      })
      .then(setChapitres)
      .catch((error: unknown) => {
        setErreur(error instanceof Error ? error.message : "Les chapitres n’ont pas pu être chargés.");
      });
  }, [niveau, matiere]);

  if (!niveau || !matiere) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Cette matière n’existe pas pour ce niveau.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: `${niveau.code} · ${matiere.court}` }} />
      <Text style={styles.titre}>{matiere.nom}</Text>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      {chapitres.map((chapitre) => (
        <Link key={chapitre.id} href={`/chapitres/${chapitre.id}`} style={styles.ligne}>
          <Text style={styles.ordre}>{chapitre.ordre}</Text>
          <Text style={styles.nom}>{chapitre.titre}</Text>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 10 },
  titre: { color: colors.ink, fontSize: 28, fontWeight: "600", marginBottom: 8 },
  ligne: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  ordre: { color: colors.green, fontSize: 18, fontWeight: "700", width: 28 },
  nom: { color: colors.ink, fontSize: 16, flex: 1 },
  muted: { color: colors.muted, fontSize: 16 },
  erreur: { color: "#8d2b1f" },
});
