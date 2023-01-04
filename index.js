const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.zlsdgw4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const familyCarCollection = client.db("CarHut").collection("familyCar");
    const cheapCarCollection = client.db("CarHut").collection("CheapCar");
    const userBuyList = client.db("CarHut").collection("userBuyingCarList");
    const allPost = client.db("CarHut").collection("allPost");
    const luxuriouspCarCollection = client
      .db("CarHut")
      .collection("luxuriousCar");
    // User Collection
    const userCollection = client.db("CarHut").collection("users");

    // Family Category
    app.get("/family", async (req, res) => {
      const query = { typ: "family" };
      const familyCar = await allPost.find(query).toArray();
      res.send(familyCar);
    });

    // Cheap Category
    app.get("/cheap", async (req, res) => {
      const query = { typ: "cheap" };
      const cheapCar = await allPost.find(query).toArray();
      res.send(cheapCar);
    });

    app.get("/buying", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { buyerEmail: email };
      const userList = await userBuyList.find(query).toArray();
      res.send(userList);
    });

    app.post("/buying", async (req, res) => {
      const buyList = req.body;

      const result = await userBuyList.insertOne(buyList);
      res.send(result);
    });

    app.get("/luxurious", async (req, res) => {
      const query = { typ: "luxurious" };
      const luxuriousCar = await allPost.find(query).toArray();
      res.send(luxuriousCar);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/addpost", async (req, res) => {
      const addPost = req.body;

      const result = await allPost.insertOne(addPost);
      res.send(result);
    });

    app.get("/addpost", async (req, res) => {
      const query = {};
      const result = await allPost.find(query).toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });

    app.patch(`/users/admin/:email`, async (req, res) => {
      const email = req.params.email;
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role == "admin" });
    });

    app.put("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      // const filter = { _id: ObjectId(id) };
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      // const user = await usersCollection.findOne(query);
      // if (user?.role !== "admin") {
      //   return res.status(401).send({ message: "not admin" });
      // }

      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // user Delete
    app.delete("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    // Buying List
  } finally {
  }
}

run().catch();

app.get("/", async (req, res) => {
  res.send("Car-Hut Running");
});

app.listen(port);
