const base = "http://localhost:3001/api";
const login = await fetch(`${base}/auth/connexion`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "kodjo.mensah@example.com", motDePasse: "revisions" }),
});
const auth = await login.json();
if (!login.ok) {
  console.log(JSON.stringify({ etape: "connexion", status: login.status, message: auth.message }));
  process.exit(1);
}
const chapitreId = "259b71c8-58bf-4bae-8d7e-9d03c73c5a20";
const partieReponse = await fetch(`${base}/chapitres/${chapitreId}/exercices`, {
  method: "POST",
  headers: { Authorization: `Bearer ${auth.jeton}` },
});
const partie = await partieReponse.json();
if (!partieReponse.ok) {
  console.log(JSON.stringify({ etape: "partie", status: partieReponse.status, message: partie.message }));
  process.exit(1);
}
const correctionReponse = await fetch(`${base}/exercices/${partie.sessionId}/reponses`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.jeton}` },
  body: JSON.stringify({
    exerciceId: partie.questions[0].id,
    reponse:
      "Je réutilise un sac et je dépose les piles dans un point de collecte. Ne pas jeter les piles dans la nature protège le sol, parce qu’elles contiennent des substances nocives.",
  }),
});
const correction = await correctionReponse.json();
console.log(
  JSON.stringify({
    status: correctionReponse.status,
    correct: correction.correct,
    feedback: correction.feedback,
    piste: correction.piste,
    score: correction.score,
    total: correction.total,
    message: correction.message,
  }),
);
