import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { connecter } from "../src/api";
import { ecrireJeton } from "../src/session";
import { colors } from "../src/theme";

export default function ConnexionScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre() {
    setErreur(null);
    setEnvoi(true);
    try {
      const reponse = await connecter({ email, motDePasse });
      await ecrireJeton(reponse.jeton);
      router.replace(reponse.utilisateur.role === "professeur" ? "/professeur" : "/profil");
    } catch (error) {
      setErreur(error instanceof Error ? error.message : "La requête a échoué.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.lead}>Reprends tes révisions avec l’email de ton compte.</Text>
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
        placeholder="Mot de passe"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      <Pressable onPress={soumettre} disabled={envoi} style={styles.bouton}>
        <Text style={styles.boutonTexte}>{envoi ? "Envoi…" : "Entrer"}</Text>
      </Pressable>
      <Link href="/inscription" style={styles.lien}>
        Créer un compte
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 12 },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 22, marginBottom: 8 },
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
  erreur: { color: "#8d2b1f", backgroundColor: "#f8e8e4", padding: 12, borderRadius: 14 },
  bouton: {
    backgroundColor: colors.greenDeep,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  boutonTexte: { color: colors.card, fontWeight: "700" },
  lien: { color: colors.green, fontWeight: "600", marginTop: 8 },
});
