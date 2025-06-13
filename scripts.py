import xml.etree.ElementTree as ET
import re
import sqlite3

conn = sqlite3.connect("My_database.db")
cursor = conn.cursor()

parse_data = ET.parse("modified_sms_v2.xml")
root = parse_data.getroot()

def parse_sms_body(body):
    # Extract amount
    amount_match = re.search(r"(\d[\d,]*)\s*RWF", body)
    amount = float(amount_match.group(1).replace(",", "")) if amount_match else None

    # Determine transaction type
    if "received" in body.lower():
        tx_type = "received"
    elif "transferred" in body.lower():
        tx_type = "transferred"
    elif "payment of" in body.lower():
        tx_type = "payment"
    elif "deposit" in body.lower():
        tx_type = "deposit"
    else:
        tx_type = "unknown"

    # Extract sender/receiver name
    person = None

    # Match "from Jane Smith", "to John Doe" (names with letters and spaces)
    from_match = re.search(r"from\s+([A-Z][a-z]+\s[A-Z][a-z]+)", body)
    to_match = re.search(r"to\s+([A-Z][a-z]+\s[A-Z][a-z]+)", body)

    if from_match:
        person = from_match.group(1)
    elif to_match:
        person = to_match.group(1)
    else:
        person = "Not sender/receiver"

    return amount, tx_type, person


# === Parse and Insert Each SMS ===
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

    amount, tx_type, person = parse_sms_body(body or "")

    cursor.execute("""
        INSERT INTO sms_messages (
            protocol, address, date, type, subject, body,
            service_center, read_flag, status, locked,
            date_sent, sub_id, readable_date, contact_name,
            extracted_amount, transaction_type, sender_or_receiver
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        protocol, address, date, type_, subject, body,
        service_center, read_flag, status, locked,
        date_sent, sub_id, readable_date, contact_name,
        amount, tx_type, person
    ))

# === Finalize ===
conn.commit()
cursor.close()
conn.close()
print("All SMS messages inserted successfully into SQLite!")