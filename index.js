const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skciu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('good-travel');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders')

        // GET Services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST Service API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // POST Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })

        // GET MyOrders API
        app.get('/orders/:userId', async (req, res) => {
            const query = {userId: req.params.userId};
            const cursor = ordersCollection.find(query);
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        })

        // DELETE Order API
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

        //UPDATE Order API
        app.patch('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = {_id:ObjectId(id)};
            const updateDoc = {
                $set: {data}
            }
            const result = await ordersCollection.updateOne(query, updateDoc);
            res.send(result)
        })
    } finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running Good Travel')
})

app.listen(port, () => {
    console.log('listening to port:', port);
})