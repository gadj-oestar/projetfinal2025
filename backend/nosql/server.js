import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 3000;

// Connexion MongoDB locale
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "recetteBuddy";

app.use(express.json());

// Route d’accueil
app.get("/", (req, res) => {
  res.send("✅ MongoDB NoSQL est connecté !");
});

// Route pour insérer un exemple de recette
app.get("/add-sample", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const recipes = db.collection("recipes");

  const result = await recipes.insertOne({
    title: "Pâtes carbonara",
    ingredients: ["pâtes", "œufs", "lardons", "parmesan"],
  });

  res.json({ message: "Recette insérée", id: result.insertedId });
});

// Route pour lister toutes les recettes
app.get("/recipes", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const recipes = db.collection("recipes");

  const allRecipes = await recipes.find().toArray();
  res.json(allRecipes);
});

app.listen(port, () => {
  console.log(`🚀 Serveur NoSQL lancé sur http://127.0.0.1:${port}`);
});
