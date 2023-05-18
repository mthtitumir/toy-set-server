const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5500;

//middleware
app.use(cors());
app.use(express.json());

// mongocode


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xx7c7ta.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toysCollection = client.db('toySet').collection('toys');

        // toys data 
        app.post('/toys', async(req, res)=>{
            const toy = req.body;
            const result = await toysCollection.insertOne(toy);
            res.send(result);
        })
        app.get('/toys', async(req, res)=>{
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/toys')
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// mongocode

app.get('/', (req, res) => {
    res.send('Kids are playing!')
})

app.listen(port, () => {
    console.log(`Kids are playing at port ${port}`);
})