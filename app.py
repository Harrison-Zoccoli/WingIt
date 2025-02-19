from flask import Flask, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

# Create a data directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

def save_ride_request(ride_data):
    """Save ride request to a JSON file"""
    # Generate a unique filename using timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'data/ride_request_{timestamp}.json'
    
    # Add timestamp to ride data
    ride_data['timestamp'] = datetime.now().isoformat()
    
    # Save to file
    with open(filename, 'w') as f:
        json.dump(ride_data, f, indent=4)
    
    return filename

@app.route('/api/rides', methods=['POST'])
def create_ride_request():
    """Handle ride request submission"""
    try:
        # Get ride data from request
        ride_data = request.json
        
        # Print to terminal
        print("\n=== New Ride Request ===")
        print(f"Pickup Location: {ride_data.get('pickup')}")
        print(f"Airport: {ride_data.get('airport')}")
        print(f"Date: {ride_data.get('date')}")
        print(f"Time: {ride_data.get('time')}")
        print("=====================\n")
        
        # Validate required fields
        required_fields = ['pickup', 'airport', 'date', 'time']
        for field in required_fields:
            if not ride_data.get(field):
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Save the ride request
        filename = save_ride_request(ride_data)
        
        return jsonify({
            'message': 'Ride request saved successfully',
            'filename': filename
        }), 201
        
    except Exception as e:
        print(f"Error processing ride request: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

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
    app.run(debug=True) 