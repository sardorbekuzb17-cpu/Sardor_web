import { MongoClient } from 'mongodb';

// Production da environment variables avtomatik yuklanadi
// Local development uchun dotenv
if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config({ path: '.env.local' });
}

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable yo\'qolgan');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // Development da global variable ishlatamiz
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // Production da har safar yangi client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
