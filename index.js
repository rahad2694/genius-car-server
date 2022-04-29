const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


const corsConfig = {
    origin: true,
    credentials: true,
  }
  app.use(cors(corsConfig))
  app.options('*', cors(corsConfig))
//MiddleWares
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Running Genius Server');
});
app.get('/hero', (req, res) => {
    res.send('Hero meets Heroku');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxttl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('orderCollection');
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        app.post('/service', async(req,res)=>{
            const newItem = req.body;
            const result = await serviceCollection.insertOne(newItem);
            res.send(result);
        })
        app.delete('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        //Order collection api
        app.post('/order',async(req,res)=>{
            const Order = req.body;
            const result = await orderCollection.insertOne(Order);
            res.send(result);
        })

        app.get('/order',async (req,res)=>{
            const email = req.query.email;
            const query = {email : email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
    }
    finally {
        // console.log('I am from finally');
    }
};
run().catch(console.dir);


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Genius Car DB Connected');
//   // perform actions on the collection object
//   client.close();
// });


app.listen(port, () => {
    console.log('Running Genius Server');
    console.log('Listening to port:', port);
})