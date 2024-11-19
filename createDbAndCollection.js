// Import the MongoDB client
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs';

// const username = encodeURIComponent("hitesh");
// const password = encodeURIComponent("66WaoFoU2X1W6Rfs");
// const uri = `mongodb+srv://${username}:${password}@cluster-hitesh.wc0ha.mongodb.net/?retryWrites=true&w=majority&appName=cluster-hitesh`;
const uri = 'mongodb://localhost:27017/product-management';

// Function to create database and collection
async function createDbAndCollection() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connecting to MongoDB local instance...");

    try {
        // Connect to the MongoDB Atlas cluster
        await client.connect();
        console.log("Connected successfully to the local MongoDB instance.");

        // Specify the name of the database and collection
        const dbName = "product-management"; // Replace with your desired database name
        const usersCollection = "users"; // Replace with your desired collection name
        const productsCollection = "products"; // Replace with your desired collection name

        // Access the database (it will be created if it doesn't exist)
        const db = client.db(dbName);
        console.log(`Database: ${dbName} created successfully.`);
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map((col) => col.name);
        console.log("Existing collections:", collectionNames);

        if (!collectionNames.includes(usersCollection)) {
          // Create the 'users' collection if it does not exist
          await db.createCollection(usersCollection);
          console.log(`Collection '${usersCollection}' created.`);
        } else {
            console.log(`Collection '${usersCollection}' already exists.`);
        }
        
        if (!collectionNames.includes(productsCollection)) {
            // Create the 'users' collection if it does not exist
            await db.createCollection(productsCollection);
            console.log(`Collection '${productsCollection}' created.`);
        } else {
            console.log(`Collection '${productsCollection}' already exists.`);
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        // Insert the default admin user into the 'users' collection if it doesn't already exist
        const adminDetails = {
            fullName: 'Admin',
            phone: '9999988888',
            email: 'admin@admin.com',
            password: hashedPassword, // In a real app, you should hash the password before storing it.
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const userCollection = db.collection(usersCollection);
        const existingAdmin = await userCollection.findOne({ email: adminDetails.email });

        if (!existingAdmin) {
            await userCollection.insertOne(adminDetails);
            console.log("Default admin user created.");
        } else {
            console.log("Admin user already exists.");
        }

    } catch (error) {
        console.error("Error creating database or collection:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Call the function to create the database and collection
createDbAndCollection();