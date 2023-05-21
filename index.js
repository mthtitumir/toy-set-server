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
        // client.connect();
        const toysCollection = client.db('toySet').collection('toys');
        const blogCollection = client.db('toySet').collection('blogs');
        const reviewCollection = client.db('toySet').collection('reviews');

        // reviews data
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // blogs data
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        })
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // toys data 
        app.post('/toys', async (req, res) => {
            const toy = req.body;
            const result = await toysCollection.insertOne(toy);
            res.send(result);
        })

        app.get('/toys', async (req, res) => {
            // console.log(req.query);
            let query = {};
            let sort = {};
            if (req.query?.seller_email) {
                query = { seller_email: req.query.seller_email }
            }
            if (req.query?.subcategory) {
                query = { subcategory: req.query.subcategory }
            }
            if (req.query?.sort === 'ascending') {
                sort.price = 1;
            }
            if (req.query?.sort === 'descending') {
                sort.price = -1;
            }
            console.log(sort);
            const result = await toysCollection.find(query).sort(sort).limit(20).toArray();
            res.send(result);
        })
        app.get('/toys/:id', async (req, res) => {
            const result = await toysCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result)
        })
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/toys/update-toy/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const option = {
                upsert: true,
            }
            const query = { _id: new ObjectId(id) };
            const toyData = {
                $set: {
                    id: body.id,
                    img: body.img,
                    name: body.name,
                    seller: body.seller,
                    seller_email: body.seller_email,
                    subcategory: body.subcategory,
                    price: body.price,
                    rating: body.rating,
                    quantity: body.quantity,
                    description: body.description,
                }
            }
            const result = await toysCollection.updateOne(
                query,
                toyData,
                option
            )
            res.send(result);
        })


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