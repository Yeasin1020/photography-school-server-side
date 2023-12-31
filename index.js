const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


	const usersCollection = client.db('PhotographySchool').collection('users')
const classesCollection = client.db('PhotographySchool').collection('classes')
const bookingsCollection = client.db('PhotographySchool').collection('bookings')
const SelectedClassCollection = client.db('PhotographySchool').collection('selectedClass')



app.get('/users', async(req, res) => {
	const result = await usersCollection.find().toArray();
	console.log(result);
	res.send(result);
})

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
// post class
app.post('/postClass', async(req, res) => {
	const body = req.body;
	const result = await classesCollection.insertOne(body)
	console.log(result);
	res.send(result)
});

// data patch admin

app.patch('/users/admin/:id', async(req, res) => {
	const id = req.params.id;
	const filter = {_id: new ObjectId(id)};
	const updateDoc = {
		$set: {
			role: 'admin'
		},
	};
	const result = await usersCollection.updateOne(filter, updateDoc)
	res.send(result)
})

//data patch instructor

app.patch('/users/instructor/:id', async(req, res) => {
	const id = req.params.id;
	const filter = {_id: new ObjectId(id)};
	const updateDoc = {
		$set: {
			role: 'instructor'
		},
	};
	const result = await usersCollection.updateOne(filter, updateDoc)
	res.send(result)
})

// get data all

app.get('/allClass', async(req, res) => {
	const cursor = classesCollection.find({});
	const result = await cursor.toArray();
	const parts = result.reverse();
	res.send(parts)
});

//get data by id

app.get("/classDetails/:id", async (req, res) => {
	const id = req.params.id;
	const query = {
	  _id: new ObjectId(id),
	};

	const options = {
	  projection: {
  className: 1,
		instructorName: 1,
		email: 1,
		seats: 1,
		Price: 1,
		textarea: 1,
		classPhoto: 1,
		_id: 1,
	  },
	};

	const result = await classesCollection.findOne(query, options);
	res.send(result);
  });


  // Data get by email from user

  app.get("/users/:email", async (req, res) => {
	const cursor = usersCollection.find({ email: req.params.email });
	const result = await cursor.toArray();
	res.send(result);
  });

  // data get by email from classes

  app.get("/classes/:email", async (req, res) => {
	const cursor = classesCollection.find({ email: req.params.email });
	const result = await cursor.toArray();
	res.send(result);
  });

  // data deny req

  app.patch('/class/deny/:id', async(req, res) => {
	const id = req.params.id;
	const filter = {_id: new ObjectId(id)};
	const updateDoc = {
		$set: {
			status: 'deny'
		},
	};
	const result = await classesCollection.updateOne(filter, updateDoc)
	res.send(result)
})

// data approve req

app.patch('/class/approve/:id', async(req, res) => {
	const id = req.params.id;
	const filter = {_id: new ObjectId(id)};
	const updateDoc = {
		$set: {
			status: 'approve'
		},
	};
	const result = await classesCollection.updateOne(filter, updateDoc)
	res.send(result)
})

// approve data get

app.get("/classesApprove/:text", async(req, res)=> {
	if(req.params.text == "approve"){
		const result = await classesCollection.find.limit(6)({status: req.params.text}).toArray();
		return res.send(result)
	}
	const cursor = classesCollection.find();
	const result = await cursor.toArray();
	res.send(result);
})

// data get instructor

app.get("/role/:text", async(req, res)=> {
	if(req.params.text == "instructor"){
		const result = await usersCollection.find({role: req.params.text}).toArray();
		return res.send(result)
	}
	const cursor = usersCollection.find();
	const result = await cursor.toArray();
	res.send(result);
})

app.post("/selected", async (req, res) => {
	const item = req.body;
	const result = await SelectedClassCollection.insertOne(item);
	res.send(result);
  });

   // data get by email from selectedClassCollection

   app.get("/myClass/:email", async (req, res) => {
	const cursor = SelectedClassCollection.find({ email: req.params.email });
	const result = await cursor.toArray();
	res.send(result);
  });

//   select class delete
app.delete('/classDelete/:id', async(req, res) => {
	const id = req.params.id;
	console.log(id)
	const query = {_id: new ObjectId(id)}
	const result = await SelectedClassCollection.deleteOne(query);
	res.send(result)
});

// Update data
app.put('/update/:id', async(req, res) => {
	const id = req.params.id;
	const filter = {_id: new ObjectId(id)}
	const option = {upsert: true};
	const updateClass = req.body;
	const classes = {
		$set:{
			className: updateClass.className,
			seats: updateClass.seats,
			Price: updateClass.Price,
			classPhoto: updateClass.classPhoto
		}
	}
	const result = await classesCollection.updateOne(filter, classes, option)
	res.send(result)
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('summer-camp-school-Server is running..')
})

app.listen(port, () => {
  console.log(`summer-camp-school-server is running on port ${port}`)
})
















