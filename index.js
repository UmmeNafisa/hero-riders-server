const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload')

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo0ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('hero-riders');
        const ridersCollection = database.collection('riders')
        const learnerCollection = database.collection('learner')

        app.get('/riders', async (req, res) => {
            const cursor = ridersCollection.find({});
            const riders = await cursor.toArray();
            res.json(riders);
        });
        app.post('/riders', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const contact = req.body.contact;
            const address = req.body.address;
            const age = req.body.age;
            const vehicleType = req.body.vehicleType;
            const vehicleModel = req.body.vehicleModel;
            const vehicleName = req.body.vehicleName;
            const vehicleNamePlate = req.body.vehicleNamePlate;

            const encodedProfilePic = req.files.profileImage.data.toString('base64');
            const profileImageBuffer = Buffer.from(encodedProfilePic, 'base64');
            const encodedNidImage = req.files.nidImage.data.toString('base64');
            const nidImageBuffer = Buffer.from(encodedNidImage, 'base64');
            const encodedLicenseImage = req.files.licenseImage.data.toString('base64');
            const licenseImageBuffer = Buffer.from(encodedLicenseImage, 'base64');
            const rider = {
                name,
                email, contact, address, vehicleType, vehicleModel, vehicleName, vehicleNamePlate, age,
                profileImage: profileImageBuffer,
                nidImage: nidImageBuffer,
                licenseImage: licenseImageBuffer
            }
            const result = await ridersCollection.insertOne(rider);
            res.json(result);
        })

        app.get('/drivingLearner', async (req, res) => {
            const cursor = learnerCollection.find({});
            const learners = await cursor.toArray();
            res.json(learners);
        });
        app.post('/drivingLearner', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const contact = req.body.contact;
            const address = req.body.address;
            const age = req.body.age;
            const vehicleType = req.body.vehicleType;

            const encodedProfilePic = req.files.profileImage.data.toString('base64');
            const profileImageBuffer = Buffer.from(encodedProfilePic, 'base64');
            const encodedNidImage = req.files.nidImage.data.toString('base64');
            const nidImageBuffer = Buffer.from(encodedNidImage, 'base64');

            const learner = {
                name,
                email, contact, address, vehicleType, age,
                profileImage: profileImageBuffer,
                nidImage: nidImageBuffer,
            }
            const result = await learnerCollection.insertOne(learner);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('Hello hero riders!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})


