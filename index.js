const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = process.env.DB_URI;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const toyCollection = client.db("baby-driver").collection("toys");
    const categoryCollection = client.db("baby-driver").collection("category");

    app.get("/categories", async (req, res) => {
      const data = categoryCollection.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      const data = toyCollection.find().limit(20);
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/toys/:category", async (req, res) => {
      const { category } = req.params;
      const data = toyCollection.find({ toy_category: category });
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/single-toys/:id", async (req, res) => {
      const { id } = req.params;
      const data = await toyCollection.findOne({ _id: new ObjectId(id) });
      const result = data;
      res.send(result);
    });

    app.post("/create-toy", async (req, res) => {
      const newToy = req.body;
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
