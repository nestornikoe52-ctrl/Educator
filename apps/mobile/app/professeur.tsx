import { NIVEAUX, type CopieEleve } from "@education-togo/shared";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { corrigerCopie, lireCopies } from "../src/api";
import { lireJeton } from "../src/session";
import { colors } from "../src/theme";

export default function ProfesseurScreen() {
  const router = useRouter();
  const [copies, setCopies] = useState<CopieEleve[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [jeton, setJeton] = useState<string | null>(null);

  useEffect(() => {
    lireJeton().then((token) => {
      if (!token) {
        router.replace("/connexion");
        return;
      }
      setJeton(token);
      lireCopies(token)
        .then(setCopies)
        .catch((error: unknown) => {
          setErreur(error instanceof Error ? error.message : "Les copies n’ont pas pu être lues.");
        });
    });
  }, [router]);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: "Copies" }} />
      <Text style={styles.lead}>Les réponses ouvertes des élèves, les plus récentes en premier.</Text>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      {copies && copies.length === 0 ? (
        <Text style={styles.texte}>Aucune réponse d’exercice pour le moment.</Text>
      ) : null}
      {copies?.map((copie) => {
        const classe = NIVEAUX.find((niveau) => niveau.code === copie.eleve.classe);
        return (
          <View key={copie.id} style={styles.carte}>
            <Text style={styles.eleve}>
              {copie.eleve.nom}
              {classe ? ` · ${classe.libelle}` : ""}
            </Text>
            <Text style={styles.titre}>{copie.chapitre.titre}</Text>
            <Text style={styles.muted}>
              {copie.chapitre.niveau.code} · {copie.chapitre.matiere.nom}
            </Text>
            <Text style={styles.texte}>{copie.question}</Text>
            <Text style={styles.reponse}>{copie.reponse}</Text>
            <Text style={styles.muted}>Piste : {copie.piste ?? "Aucune piste."}</Text>
            <Text style={styles.muted}>Critère : {copie.critere}</Text>
            <Text style={styles.texte}>
              {copie.revue
                ? copie.correct
                  ? "Marquée juste. L’élève voit ce résultat."
                  : "Marquée à retravailler. L’élève voit ce résultat."
                : "Pas encore rendue à l’élève."}
            </Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.bouton}
                onPress={() => {
                  if (!jeton) {
                    return;
                  }
                  void corrigerCopie(copie.id, true, jeton).then((suivante) => {
                    setCopies((liste) => liste?.map((item) => (item.id === suivante.id ? suivante : item)) ?? null);
                  });
                }}
              >
                <Text style={styles.boutonTexte}>Juste</Text>
              </Pressable>
              <Pressable
                style={styles.bouton}
                onPress={() => {
                  if (!jeton) {
                    return;
                  }
                  void corrigerCopie(copie.id, false, jeton).then((suivante) => {
                    setCopies((liste) => liste?.map((item) => (item.id === suivante.id ? suivante : item)) ?? null);
                  });
                }}
              >
                <Text style={styles.boutonTexte}>À retravailler</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12 },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  texte: { color: colors.ink, fontSize: 16, lineHeight: 24 },
  eleve: { color: colors.green, fontWeight: "700" },
  titre: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  reponse: {
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: 14,
    padding: 12,
    lineHeight: 22,
  },
  erreur: { color: "#8d2b1f" },
  actions: { flexDirection: "row", gap: 8 },
  bouton: {
    backgroundColor: colors.greenDeep,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  boutonTexte: { color: colors.card, fontWeight: "700" },
  carte: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.card,
    gap: 8,
  },
});
