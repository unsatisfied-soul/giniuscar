const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6wi6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/',(req,res)=> {
    console.log('its fin')
    res.send('loaded')
})
async function run (){
    try{
        await client.connect()
        const database = client.db('carMechanic').collection('services')
        
        //post api
        app.post('/services', async(req,res)=> {
            const service = req.body;
            const result = await database.insertOne(service)
            console.log('hit the post api')
            res.send(result)
        })

        //find all 
        app.get('/services',async(req,res)=> {
            const cursor = database.find({})
            const services = await cursor.toArray(cursor)
            res.send(services)
        })
    }finally {
        // await client.close()
    }
    
}
run().catch(console.dir)

app.listen(port, ()=> {
    console.log(port, 'localhost')
})