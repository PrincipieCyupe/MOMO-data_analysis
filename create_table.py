from Db_Config import connection

try:

    conn = connection()
    cursor = conn.cursor()

    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS sms_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        protocol TEXT,
        address TEXT,
        date INTEGER,
        type INTEGER,
        subject TEXT,
        body TEXT,
        service_center TEXT,
        read_flag INTEGER,
        status INTEGER,
        locked INTEGER,
        date_sent INTEGER,
        sub_id INTEGER,
        readable_date TEXT,
        contact_name TEXT,
        extracted_amount REAL,
        transaction_type TEXT,
        sender_or_receiver TEXT
    )'''
)
    print("table Was succesful created")

    
    conn.commit()

except sqlite3.Error as e:
    print("failed due to error:", e)

finally:
    if conn:
        conn.close()


