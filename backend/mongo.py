import os
import logging
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

logging.basicConfig(level=logging.INFO)

load_dotenv()

mongo_srv = os.environ["mongo"]

async def connect_to_mongo():
    logging.info("inside the connection function")
    if not mongo_srv:
        logging.error("Error: 'mongo' environment variable not set.")
        return

    logging.info("Connecting to MongoDB...")
    try:
        client = AsyncIOMotorClient(mongo_srv)
        logging.info("Successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"Could not connect to MongoDB: {e}")

async def close_mongo_connection():
    logging.info("Closing MongoDB connection...")
    if client:
        client.close()
    logging.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    if client.db is None:
        raise Exception("Database not initialized. Call connect_to_mongo first.")
    return client.db
