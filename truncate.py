import sqlite3

conn = sqlite3.connect("My_Database.db")
Cursor = conn.cursor()
Cursor.execute("DELETE FROM sms_messages")
Cursor.execute("DELETE FROM sqlite_sequence WHERE name='sms_messages'")
conn.commit()
conn.close()
print("deleted succesfully")
