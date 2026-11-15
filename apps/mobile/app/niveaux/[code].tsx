import { MATIERES, NIVEAUX } from "@education-togo/shared";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, subjectColor } from "../../src/theme";

export default function NiveauScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const niveau = NIVEAUX.find((item) => item.code === code);

  if (!niveau) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Ce niveau n’existe pas.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: niveau.libelle }} />
      <Text style={styles.lead}>Choisis une matière pour voir les chapitres.</Text>
      {MATIERES.map((matiere) => (
        <Link
          key={matiere.code}
          href={`/niveaux/${niveau.code}/${matiere.code}`}
          style={[styles.card, { borderLeftColor: subjectColor[matiere.code] }]}
        >
          <Text style={styles.kicker}>{matiere.court}</Text>
          <Text style={styles.titre}>{matiere.nom}</Text>
          <Text style={styles.muted}>{matiere.description}</Text>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12 },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 22, marginBottom: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    borderLeftWidth: 4,
    padding: 16,
    gap: 6,
  },
  kicker: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  titre: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
