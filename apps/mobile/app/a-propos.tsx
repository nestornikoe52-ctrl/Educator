import { CREATEUR } from "@education-togo/shared";
import { ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../src/theme";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>À propos</Text>
      <Text style={styles.title}>{CREATEUR.nom}</Text>
      <Text style={styles.role}>{CREATEUR.titre}</Text>
      <Text style={styles.body}>{CREATEUR.presentation}</Text>
      <Text style={styles.body}>
        L&apos;application couvre pour l&apos;instant le collège, de la 6e à la 3e, en
        Mathématiques, PCT et SVT. Le parcours d&apos;un chapitre reste le même : lire le
        résumé, puis s&apos;entraîner avec des exercices, des QCM et un trivia.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12 },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: { color: colors.ink, fontSize: 36, fontWeight: "600" },
  role: { color: colors.muted, fontSize: 16 },
  body: { color: colors.ink, fontSize: 16, lineHeight: 24, marginTop: 8 },
});
