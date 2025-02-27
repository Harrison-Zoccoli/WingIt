from flask import Flask
from models import db, User, RideRequest, WaitlistEntry
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Azure PostgreSQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://HarrisonZoccoli@wingit-db:YourPassword@wingit-db.postgres.database.azure.com/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

def init_db():
    """Initialize the database by creating all tables"""
    with app.app_context():
        logger.info("Creating database tables...")
        db.create_all()
        logger.info("Database tables created successfully!")

if __name__ == "__main__":
    init_db()