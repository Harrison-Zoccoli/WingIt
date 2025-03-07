from app import app, db
from models import User, RideRequest

def check_database():
    with app.app_context():
        print("\nUsers:")
        users = User.query.all()
        for u in users:
            print(f"ID: {u.id}")
            print(f"Name: {u.full_name}")
            print(f"Email: {u.email}")
            print(f"College: {u.college}")
            print("---")
        
        print("\nRides:")
        rides = RideRequest.query.all()
        for r in rides:
            print(f"ID: {r.id}")
            print(f"User ID: {r.user_id}")
            print(f"Pickup: {r.pickup}")
            print(f"Airport: {r.airport}")
            print(f"Date: {r.date}")
            print(f"Time: {r.time}")
            print("---")

if __name__ == "__main__":
    check_database() 