# Import the useful libraries; ElementTree to parse and load the data from xml file, re to look for some specific data to categorize and mysql.connector to work with mysql database
import xml.etree.ElementTree as ET
import mysql.connector
import re

# Load XML
tree = ET.parse("modified_sms_v2.xml")  # Change to your file name
root = tree.getroot()

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="PrincipieSQL",
    password="0798200584",
    database="test"
)
cursor = conn.cursor()

# Function to extract amount and transaction type
def parse_sms_body(body):
    amount_match = re.search(r"(\d[\d,]*)\s*RWF", body)
    amount = float(amount_match.group(1).replace(",", "")) if amount_match else None

    if "received" in body:
        tx_type = "received"
    elif "transferred" in body:
        tx_type = "transferred"
    elif "payment of" in body:
        tx_type = "payment"
    elif "deposit" in body.lower():
        tx_type = "deposit"
    else:
        tx_type = "unknown"

    # Try to extract name or number
    person_match = re.search(r"to\s+([A-Za-z\s]+|\(\d+\))", body) or \
                   re.search(r"from\s+([A-Za-z\s]+|\(\d+\))", body)
    person = person_match.group(1).strip() if person_match else None

    return amount, tx_type, person

# Loop through all SMS messages
for sms in root.findall("sms"):
    protocol = sms.get("protocol")
    address = sms.get("address")
    date = int(sms.get("date"))
    type_ = int(sms.get("type"))
    subject = sms.get("subject")
    body = sms.get("body")
    service_center = sms.get("service_center")
    read_flag = int(sms.get("read"))
    status = int(sms.get("status"))
    locked = int(sms.get("locked"))
    date_sent = int(sms.get("date_sent"))
    sub_id = int(sms.get("sub_id"))
    readable_date = sms.get("readable_date")
    contact_name = sms.get("contact_name")

    amount, tx_type, person = parse_sms_body(body)

    # Insert into DB
    cursor.execute("""
        INSERT INTO sms_messages (
            protocol, address, date, type, subject, body,
            service_center, read_flag, status, locked,
            date_sent, sub_id, readable_date, contact_name,
            extracted_amount, transaction_type, sender_or_receiver
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        protocol, address, date, type_, subject, body,
        service_center, read_flag, status, locked,
        date_sent, sub_id, readable_date, contact_name,
        amount, tx_type, person
    ))

# Finalize
conn.commit()
cursor.close()
conn.close()
print("SMSes inserted successfully")
