import unittest
from pymongo import MongoClient


MONGO_SETTINGS = {
    "local": {"host": "localhost", "port": 27017}
}



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

router = MongoRouter()


def get_user_board(email):
    last_visited = router.route("test").find_one({"email": email}, {"lastVisitedId": 1})["lastVisitedId"],
    last_visited = last_visited[0]
    results = router.route("test").find_one(
        {"email": email, "boards": {"$elemMatch": {"name": last_visited}}},
        {"boards": 1}
    )["boards"]
    for result in results:
        if result["name"] == last_visited:
            return result


class TestViews(unittest.TestCase):
    def setUp(self):
        test_router = MongoRouter()
        self.test_collection = test_router.route("test")
        self.test_collection.drop()
        self.test_collection.insert_one({
            "email": "test@email.com",
            "lastVisitedId": "correct_name",
            "boards": [
                {"test_value": 0, "name": "bad_name_1"},
                {"test_value": 1, "name": "correct_name"},
                {"test_value": 2, "name": "bad_name_2"},
            ]
        })
        # Another
        self.test_collection.insert_one({
            "email": "test_@@email.com",
            "lastVisitedId": "", # This did not visit anything
            "boards": [
                {"test_value": 3, "name": "2_bad_name_1"},
                {"test_value": 4, "name": "2_bad_name_2"},
                {"test_value": 5, "name": "2_bad_name_3"},
            ]
        })

    def tearDown(self):
        self.test_collection.drop()

    def test_get_user_board(self):
        self.assertEquals(1, get_user_board("test@email.com")["test_value"])