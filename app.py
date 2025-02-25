from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models import db, User, RideRequest, WaitlistEntry
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    user = User(
        full_name=data['fullName'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        college=data['college']
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'fullName': user.full_name,
        'email': user.email,
        'college': user.college
    }), 201

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
    data = request.json
    
    ride = RideRequest(
        user_id=data['userId'],
        pickup=data['pickup'],
        airport=data['airport'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time=datetime.strptime(data['time'], '%H:%M').time()
    )
    
    db.session.add(ride)
    db.session.commit()
    
    return jsonify({
        'id': ride.id,
        'message': 'Ride request created successfully'
    }), 201

@app.route('/api/matches/<int:ride_id>', methods=['GET'])
def find_matches(ride_id):
    ride = RideRequest.query.get_or_404(ride_id)
    
    # Find potential matches
    matches = RideRequest.query.filter(
        RideRequest.date == ride.date,
        RideRequest.pickup == ride.pickup,
        RideRequest.airport == ride.airport,
        RideRequest.user_id != ride.user_id,
        RideRequest.status == 'active'
    ).all()
    
    return jsonify([{
        'id': m.id,
        'user': User.query.get(m.user_id).full_name,
        'time': m.time.strftime('%H:%M')
    } for m in matches])

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 