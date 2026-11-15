import { MATIERES, NIVEAUX, type MatiereCode, type NiveauCode } from "@education-togo/shared";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { inscrire } from "../src/api";
import { ecrireJeton } from "../src/session";
import { colors } from "../src/theme";

export default function InscriptionScreen() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [classe, setClasse] = useState<NiveauCode>("6e");
  const [matieres, setMatieres] = useState<MatiereCode[]>(MATIERES.map((matiere) => matiere.code));
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  function basculerMatiere(code: MatiereCode) {
    setMatieres((courantes) =>
      courantes.includes(code) ? courantes.filter((item) => item !== code) : [...courantes, code],
    );
  }

  async function soumettre() {
    setErreur(null);
    setEnvoi(true);
    try {
      const reponse = await inscrire({ nom, email, motDePasse, classe, matieres });
      await ecrireJeton(reponse.jeton);
      router.replace("/profil");
    } catch (error) {
      setErreur(error instanceof Error ? error.message : "La requête a échoué.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.lead}>Nom, classe et matières suivies.</Text>
      <TextInput value={nom} onChangeText={setNom} placeholder="Nom" placeholderTextColor={colors.muted} style={styles.input} />
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <TextInput
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
        placeholder="Mot de passe (8 caractères)"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <View style={styles.row}>
        {NIVEAUX.map((niveau) => (
          <Pressable
            key={niveau.code}
            onPress={() => setClasse(niveau.code)}
            style={[styles.puce, classe === niveau.code && styles.puceActive]}
          >
            <Text style={classe === niveau.code ? styles.puceTexteActive : styles.puceTexte}>
              {niveau.code}
            </Text>
          </Pressable>
        ))}
      </View>
      {MATIERES.map((matiere) => (
        <Pressable key={matiere.code} onPress={() => basculerMatiere(matiere.code)} style={styles.choix}>
          <Text style={styles.choixTexte}>
            {matieres.includes(matiere.code) ? "●" : "○"} {matiere.nom}
          </Text>
        </Pressable>
      ))}
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      <Pressable onPress={soumettre} disabled={envoi} style={styles.bouton}>
        <Text style={styles.boutonTexte}>{envoi ? "Envoi…" : "Créer mon compte"}</Text>
      </Pressable>
      <Link href="/connexion" style={styles.lien}>
        Déjà inscrit
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12, paddingBottom: 40 },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  puce: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  puceActive: { backgroundColor: colors.green, borderColor: colors.green },
  puceTexte: { color: colors.ink },
  puceTexteActive: { color: colors.card, fontWeight: "700" },
  choix: { paddingVertical: 4 },
  choixTexte: { color: colors.ink, fontSize: 16 },
  erreur: { color: "#8d2b1f", backgroundColor: "#f8e8e4", padding: 12, borderRadius: 14 },
  bouton: {
    backgroundColor: colors.greenDeep,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  boutonTexte: { color: colors.card, fontWeight: "700" },
  lien: { color: colors.green, fontWeight: "600" },
});
