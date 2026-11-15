import {
  MATIERES,
  NIVEAUX,
  type ResultatOuvert,
  type ScoreHistorique,
  type TypeSession,
  type Utilisateur,
} from "@education-togo/shared";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { lireHistorique, lireMesCopies, lireProfil } from "../src/api";
import { effacerJeton, lireJeton } from "../src/session";
import { colors } from "../src/theme";

const ACTIVITE: Record<TypeSession, string> = {
  exercices: "Exercices",
  qcm: "QCM",
  trivia: "Trivia",
};

export default function ProfilScreen() {
  const router = useRouter();
  const [profil, setProfil] = useState<Utilisateur | null>(null);
  const [scores, setScores] = useState<ScoreHistorique[]>([]);
  const [copies, setCopies] = useState<ResultatOuvert[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    lireJeton().then((jeton) => {
      if (!jeton) {
        router.replace("/connexion");
        return;
      }
      Promise.all([lireProfil(jeton), lireHistorique(jeton), lireMesCopies(jeton)])
        .then(([eleve, historique, resultats]) => {
          setProfil(eleve);
          setScores(historique);
          setCopies(resultats);
        })
        .catch(() => {
          void effacerJeton();
          setErreur("Ta session a expiré. Reconnecte-toi.");
        });
    });
  }, [router]);

  if (erreur) {
    return (
      <View style={styles.screen}>
        <Text style={styles.erreur}>{erreur}</Text>
      </View>
    );
  }

  if (!profil) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement du profil…</Text>
      </View>
    );
  }

  const classe = NIVEAUX.find((niveau) => niveau.code === profil.classe);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.nom}>{profil.nom}</Text>
      <Text style={styles.muted}>{profil.email}</Text>
      <Text style={styles.label}>{profil.role === "professeur" ? "Rôle" : "Classe"}</Text>
      <Text style={styles.valeur}>
        {profil.role === "professeur"
          ? "Professeur"
          : classe
            ? `${classe.libelle} · ${classe.code}`
            : profil.classe}
      </Text>
      {profil.role === "professeur" ? (
        <Link href="/professeur" style={styles.valeur}>
          Lire les copies
        </Link>
      ) : null}
      <Text style={styles.label}>Matières suivies</Text>
      {profil.matieres.map((code) => (
        <Text key={code} style={styles.valeur}>
          {MATIERES.find((matiere) => matiere.code === code)?.nom ?? code}
        </Text>
      ))}
      {profil.role === "eleve" ? <Text style={styles.label}>Résultats du professeur</Text> : null}
      {profil.role === "eleve" && copies.length === 0 ? (
        <Text style={styles.valeur}>Tes exercices corrigés apparaîtront ici.</Text>
      ) : null}
      {profil.role === "eleve"
        ? copies.map((copie) => (
            <View key={copie.id} style={styles.carte}>
              <Text style={styles.activite}>
                {copie.chapitre.niveau.code} · {copie.chapitre.matiere.nom}
              </Text>
              <Text style={styles.valeur}>{copie.chapitre.titre}</Text>
              <Text style={styles.muted}>{copie.question}</Text>
              <Text style={styles.valeur}>
                {copie.revue ? (copie.correct ? "Juste." : "À retravailler.") : "En attente du professeur."}
              </Text>
            </View>
          ))
        : null}
      <Text style={styles.label}>Scores</Text>
      {scores.length === 0 ? (
        <Text style={styles.valeur}>Tes parties terminées apparaîtront ici.</Text>
      ) : (
        scores.map((partie) => (
          <Link key={partie.id} href={`/chapitres/${partie.chapitre.id}`} style={styles.carte}>
            <Text style={styles.activite}>{ACTIVITE[partie.type]}</Text>
            <Text style={styles.valeur}>{partie.chapitre.titre}</Text>
            <Text style={styles.muted}>
              {partie.type === "exercices"
                ? `${partie.score} réponse${partie.score > 1 ? "s" : ""}`
                : `${partie.score}/${partie.total}`}{" "}
              · {partie.chapitre.niveau.code}
            </Text>
          </Link>
        ))
      )}
      <Pressable
        style={styles.bouton}
        onPress={async () => {
          await effacerJeton();
          router.replace("/");
        }}
      >
        <Text style={styles.boutonTexte}>Sortir</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 8 },
  nom: { color: colors.ink, fontSize: 32, fontWeight: "600" },
  muted: { color: colors.muted, fontSize: 16 },
  label: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  valeur: { color: colors.ink, fontSize: 16 },
  erreur: { color: "#8d2b1f" },
  bouton: {
    marginTop: 24,
    alignSelf: "flex-start",
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  boutonTexte: { color: colors.ink, fontWeight: "600" },
  carte: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.card,
    marginTop: 8,
  },
  activite: { color: colors.green, fontWeight: "700", fontSize: 12 },
});