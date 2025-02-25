from app import app, db
from models import User, RideRequest
from werkzeug.security import generate_password_hash
from datetime import datetime, date, time

def init_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create test users
        test_users = [
            User(
                full_name="Test User 1",
                email="test1@example.com",
                password=generate_password_hash("password123"),
                college="Carnegie Mellon University"
            ),
            User(
                full_name="Test User 2",
                email="test2@example.com",
                password=generate_password_hash("password123"),
                college="Carnegie Mellon University"
            )
        ]
        
        # Add users to database
        for user in test_users:
            db.session.add(user)
        db.session.commit()
        
        # Create test ride requests
        test_rides = [
            RideRequest(
                user_id=1,
                pickup="Carnegie Mellon University",
                airport="Pittsburgh International Airport (PIT)",
                date=date(2025, 2, 26),
                time=time(12, 30)  # 12:30 PM
            ),
            RideRequest(
                user_id=2,
                pickup="Carnegie Mellon University",
                airport="Pittsburgh International Airport (PIT)",
                date=date(2025, 2, 26),
                time=time(12, 50)  # Changed to 12:50 PM
            )
        ]
        
        # Add rides to database
        for ride in test_rides:
            db.session.add(ride)
        db.session.commit()
        
        print("Database initialized with test data!")

if __name__ == "__main__":
    init_database() 