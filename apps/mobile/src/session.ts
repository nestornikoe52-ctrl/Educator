import AsyncStorage from "@react-native-async-storage/async-storage";

const CLE_JETON = "education-togo-jeton";

export function lireJeton() {
  return AsyncStorage.getItem(CLE_JETON);
}

export function ecrireJeton(jeton: string) {
  return AsyncStorage.setItem(CLE_JETON, jeton);
}

export function effacerJeton() {
  return AsyncStorage.removeItem(CLE_JETON);
}
