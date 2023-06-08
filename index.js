const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyrxehg.mongodb.net/?retryWrites=true&w=majority`;

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
	const usersCollection = client.db('PhotographySchool').collection('users')
    const classesCollection = client.db('PhotographySchool').collection('classes')
    const bookingsCollection = client.db('PhotographySchool').collection('bookings')


	//save user email

	app.put('/users/:email', async(req,res)=>{
		const email = req.params.email
		const user = req.body
		const query = {email: email}
		const options = {upsert: true}
		const updateDoc = {
			$set: user
		}
		const result = usersCollection.updateOne(query, updateDoc, options)
		console.log(result);
		res.send(result)
	})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('summer-camp-school-Server is running..')
})

app.listen(port, () => {
  console.log(`summer-camp-school-server is running on port ${port}`)
})