from app.utils.dataset_loader import load_dataset

class DataService:
    @staticmethod
    def get_data():
        return load_dataset()