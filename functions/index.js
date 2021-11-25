// @ts-check
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors")

const corsHandler = cors({ origin: true });

exports.createStudent = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return
  }

  const name = req.body.name ?? undefined;
  const email = req.body.email ?? undefined;
  const password = req.body.password ?? undefined;

  console.log("validate email")

  if (!email || !password || !name) {
    res.status(400).send("Missing name, email or password");
    return;
  }

  console.log("email vlaidated")

  admin.auth().createUser({
    displayName: name,
    email,
    password,
    emailVerified: true
  }).then(user => {
    console.log("user created")

    admin.auth().setCustomUserClaims(user.uid, {
      role: "student"
    }).then(() => {
      console.log("role set")
      res.sendStatus(200);
    }).catch(() => {
      console.log("role set fail")
      res.status(400).send("Error setting user claims");
    });
  }).catch(() => {
    console.log("user create fail")
    res.status(400).send("Error creating user");
  });
})

exports.createInstructor = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return
  }

  const name = req.body.name ?? undefined;
  const email = req.body.email ?? undefined;
  const password = req.body.password ?? undefined;

  console.log("validate email")

  if (!email || !password || !name) {
    res.status(400).send("Missing name email or password");
    return;
  }

  console.log("email vlaidated")

  admin.auth().createUser({
    displayName: name,
    email,
    password,
    emailVerified: true
  }).then(user => {
    console.log("user created")

    admin.auth().setCustomUserClaims(user.uid, {
      role: "instructor"
    }).then(() => {
      console.log("role set")
      res.sendStatus(200);
    }).catch(() => {
      console.log("role set fail")
      res.status(400).send("Error setting user claims");
    });
  }).catch(() => {
    console.log("user create fail")
    res.status(400).send("Error creating user");
  });
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
