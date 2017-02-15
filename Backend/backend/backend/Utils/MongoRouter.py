from .. settings import MONGO_SETTINGS
from pymongo import MongoClient


class MongoRouter(object):
    def __init__(self,
                 connect_to="local"):

        # ToDo: At some point in the future, make a dedicated mongo machine and make router differentiate
        # between prod and local machines

        self.connect_to = connect_to
        self.client = MongoClient(MONGO_SETTINGS.get(connect_to, ("localhost", 27017)))

        if connect_to == "local":
            self.client = MongoClient()
        else:
            raise NotImplemented("Not yet implemented other environments.")

    def route(self, desired_collection):
        if desired_collection == "users":
            return self.client["users_db"]["users_db"]

        elif desired_collection == "test":
            return self.client["test_db"]["test_db"]


import unittest


class TestMongoRouter(unittest.TestCase):
    def setUp(self):
        self.test_collection = MongoClient()["test_db"]["test_db"]

    def tearDown(self):
        self.test_collection.drop()

    def test_route(self):
        self.test_collection.insert_one({
            "test_id": "tid",
            "test": "success"
        })

        router = MongoRouter()

        self.assertEquals(
            "success",
            router.route("test").find_one({"test_id": "tid"}).get("test", None)
        )
        
        router.route("test").insert_one({"test_id": "tid_2", "test": "success"})

        self.assertEquals(
            "success",
            router.route("test").find_one({"test_id": "tid_2"}).get("test", None)
        )