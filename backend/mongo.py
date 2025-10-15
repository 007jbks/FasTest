from dotenv import load_dotenv
from pymongo import MongoClient
import os
import logging

load_dotenv()

mongo_srv = os.environ["mongo"]

def connect():
    try:
        c = MongoClient(mongo_srv)
        logging.info("Connected")
    except Exception as e:
        print(f"Error {e}")
