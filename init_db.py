from app import app, db

with app.app_context():
    # This will create all tables
    db.create_all()
    print("Database tables created!") 