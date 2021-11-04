const { initializeApp, cert } = require("firebase-admin/app");
const serviceAccount = require("./key.js");

const app = initializeApp({ credential: cert(serviceAccount) });

module.exports = app;