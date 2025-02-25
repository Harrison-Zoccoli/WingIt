from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import sqlite3
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.')
CORS(app)

logger.info("Starting application...")

# Database configuration
try:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wingit.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    logger.info("Database configuration set")
    
    from models import db, User, RideRequest, WaitlistEntry
    db.init_app(app)
    logger.info("Database initialized")

    with app.app_context():
        # Create all database tables
        db.create_all()
        logger.info("Database tables created")
except Exception as e:
    logger.error(f"Error during startup: {str(e)}")
    raise

@app.route('/')
def index():
    try:
        logger.info("Serving index page")
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        logger.error(f"Error serving index: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    logger.info("Received signup request")
    data = request.json
    logger.debug(f"Signup data: {data}")
    
    try:
        if User.query.filter_by(email=data['email']).first():
            logger.warning(f"Email already registered: {data['email']}")
            return jsonify({'error': 'Email already registered'}), 400
            
        user = User(
            full_name=data['fullName'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            college=data['college']
        )
        
        db.session.add(user)
        db.session.commit()
        logger.info(f"User created successfully: {user.id}")
        
        return jsonify({
            'id': user.id,
            'fullName': user.full_name,
            'email': user.email,
            'college': user.college
        }), 201
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'id': user.id,
            'fullName': user.full_name,
            'email': user.email,
            'college': user.college
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/rides', methods=['POST'])
def create_ride_request():
    logger.info("Received ride request")
    data = request.json
    logger.debug(f"Ride request data: {data}")
    
    try:
        # Log the user ID
        logger.debug(f"User ID from request: {data.get('userId')}")
        
        # Verify user exists
        user = User.query.get(data['userId'])
        if not user:
            logger.error(f"User not found: {data['userId']}")
            return jsonify({'error': 'User not found'}), 404

        ride = RideRequest(
            user_id=data['userId'],
            pickup=data['pickup'],
            airport=data['airport'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time=datetime.strptime(data['time'], '%H:%M').time()
        )
        
        db.session.add(ride)
        db.session.commit()
        logger.info(f"Ride request created successfully: {ride.id}")
        
        return jsonify({
            'id': ride.id,
            'message': 'Ride request created successfully'
        }), 201
    except Exception as e:
        logger.error(f"Error creating ride request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/matches', methods=['POST'])
def find_matches():
    data = request.json
    logger.debug(f"Finding matches for: {data}")
    
    try:
        # Find potential matches
        matches = RideRequest.query.filter(
            RideRequest.date == datetime.strptime(data['date'], '%Y-%m-%d').date(),
            RideRequest.pickup == data['pickup'],
            RideRequest.airport == data['airport'],
            RideRequest.user_id != data['userId'],
            RideRequest.status == 'active'
        ).all()
        
        logger.info(f"Found {len(matches)} matches")
        
        return jsonify([{
            'id': m.id,
            'user': User.query.get(m.user_id).full_name,
            'time': m.time.strftime('%H:%M')
        } for m in matches])
    except Exception as e:
        logger.error(f"Error finding matches: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/rides', methods=['GET'])
def get_ride_requests():
    """Get all ride requests"""
    try:
        rides = []
        for filename in os.listdir('data'):
            if filename.startswith('ride_request_'):
                with open(f'data/{filename}', 'r') as f:
                    rides.append(json.load(f))
        
        return jsonify(rides), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/health')
def health_check():
    try:
        # Test database connection
        with app.app_context():
            db.session.execute('SELECT 1')
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 