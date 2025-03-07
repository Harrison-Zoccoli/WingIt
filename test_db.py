import psycopg2
import sys

def test_connection():
    try:
        conn = psycopg2.connect(
            host="wingit-db.postgres.database.azure.com",
            database="postgres",
            user="HarrisonZoccoli",
            password="qwert123$Benny123$",
            port="5432",
            sslmode="require"
        )
        print("Connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)