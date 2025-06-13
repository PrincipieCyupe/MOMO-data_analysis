from flask import Flask, jsonify
from Db_Config import connection

app = Flask(__name__)

@app.route("/api/messages")
def fetch():
    conn = connection()
    sms = conn.execute("SELECT * FROM sms_messages").fetchall()
    conn.close()

    results = [dict(row) for row in sms]

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

