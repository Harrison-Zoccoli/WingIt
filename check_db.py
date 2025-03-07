from flask import Flask
from models import db
import logging
from sqlalchemy import text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://HarrisonZoccoli:qwert123$Benny123$@wingit-db.postgres.database.azure.com:5432/postgres?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

def check_database():
    """Check database connection and list existing tables"""
    with app.app_context():
        try:
            # Test connection
            db.session.execute(text('SELECT 1'))
            logger.info("Successfully connected to the database!")
            
            # List existing tables
            sql = text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = db.session.execute(sql).fetchall()
            
            if tables:
                logger.info(f"Found {len(tables)} tables in the database:")
                for table in tables:
                    logger.info(f"- {table[0]}")
            else:
                logger.info("No tables found in the database.")
                
        except Exception as e:
            logger.error(f"Database connection error: {str(e)}")
            raise

if __name__ == "__main__":
    logger.info("Checking database connection...")
    check_database()
    logger.info("Database check completed!") 