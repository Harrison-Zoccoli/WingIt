from flask import Flask
from models import db, User, RideRequest, WaitlistEntry
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Azure PostgreSQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://HarrisonZoccoli@wingit-db:qwert123$Benny123$@wingit-db.postgres.database.azure.com/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

def test_connection():
    """Test the connection to Azure PostgreSQL"""
    with app.app_context():
        try:
            # Try to execute a simple query
            result = db.session.execute('SELECT 1').fetchone()
            logger.info(f"Connection successful! Result: {result}")
            
            # Count existing tables
            tables = db.session.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """).fetchall()
            
            if tables:
                logger.info(f"Found {len(tables)} tables in the database:")
                for table in tables:
                    logger.info(f"- {table[0]}")
            else:
                logger.info("No tables found in the database. Run init_azure_db.py to create them.")
                
            return True
        except Exception as e:
            logger.error(f"Connection failed: {str(e)}")
            return False

if __name__ == "__main__":
    test_connection()