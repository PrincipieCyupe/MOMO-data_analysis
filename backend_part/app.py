# app.py
from flask import Flask, jsonify
import mysql.connector
from config import db_config
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/api/messages', methods=['GET'])
def get_messages():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sms_messages")
    messages = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(messages)

if __name__ == '__main__':
    app.run(debug=True)
