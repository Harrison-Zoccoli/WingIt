from app import app, db
from models import User, RideRequest
from datetime import datetime

def check_database():
    with app.app_context():
        print("\n=== Users ===")
        users = User.query.all()
        for user in users:
            print(f"ID: {user.id}, Name: {user.full_name}, Email: {user.email}, College: {user.college}")
            
        print("\n=== Ride Requests ===")
        rides = RideRequest.query.all()
        for ride in rides:
            print(f"ID: {ride.id}, User: {ride.user_id}")
            print(f"From: {ride.pickup} To: {ride.airport}")
            print(f"Date: {ride.date}, Time: {ride.time}")
            print("---")

if __name__ == "__main__":
    check_database() 