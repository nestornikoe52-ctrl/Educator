import { ACTIVITES, MATIERES, NIVEAUX, PARCOURS } from "@education-togo/shared";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, subjectColor } from "../src/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <View style={styles.mark}>
            <Text style={styles.markText}>ET</Text>
          </View>
          <View>
            <Text style={styles.brand}>Éducation Togo</Text>
            <Text style={styles.kicker}>Collège · APC</Text>
          </View>
          <View style={styles.links}>
            <Link href="/connexion" style={styles.aboutLink}>
              Connexion
            </Link>
            <Link href="/a-propos" style={styles.aboutLink}>
              À propos
            </Link>
          </View>
        </View>

        <Text style={styles.eyebrow}>6e · 5e · 4e · 3e</Text>
        <Text style={styles.title}>Le collège, chapitre par chapitre.</Text>
        <Text style={styles.lead}>
          Résumés de cours, exercices, QCM et trivia pour réviser les Mathématiques, la PCT
          et la SVT selon l&apos;Approche Par Compétences du Togo.
        </Text>

        {MATIERES.map((matiere) => (
          <View
            key={matiere.code}
            style={[styles.card, { borderLeftColor: subjectColor[matiere.code] }]}
          >
            <Text style={styles.cardKicker}>{matiere.court}</Text>
            <Text style={styles.cardTitle}>{matiere.nom}</Text>
            <Text style={styles.cardBody}>{matiere.description}</Text>
          </View>
        ))}

        <View style={styles.levels}>
          {NIVEAUX.map((niveau) => (
            <Link key={niveau.code} href={`/niveaux/${niveau.code}`} style={styles.level}>
              <Text style={styles.levelText}>
                {niveau.libelle} · {niveau.code}
              </Text>
            </Link>
          ))}
        </View>

        <Text style={styles.path}>
          {PARCOURS.map((etape, index) => `${index + 1}. ${etape}`).join("   ")}
        </Text>
        <Text style={styles.activities}>
          {ACTIVITES.map((activite) => activite.nom).join("  ·  ")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  top: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.greenDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: { color: colors.gold, fontWeight: "700" },
  brand: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  kicker: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  links: { marginLeft: "auto", flexDirection: "row", gap: 12 },
  aboutLink: { color: colors.green, fontWeight: "600" },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: { color: colors.ink, fontSize: 36, lineHeight: 40, fontWeight: "600" },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    borderLeftWidth: 4,
    padding: 16,
    gap: 6,
  },
  cardKicker: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  cardTitle: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  cardBody: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  levels: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  level: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  levelText: { color: colors.ink, fontSize: 13 },
  path: { color: colors.ink, fontSize: 14, lineHeight: 22 },
  activities: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
