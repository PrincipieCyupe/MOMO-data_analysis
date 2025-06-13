
# 📊 Mobile Money Analytics Dashboard (Fullstack)

This project is a complete end-to-end analytics platform for processing and visualizing mobile money transaction data (SMS-based). 

It extracts SMS backup data, parses relevant transaction details, stores them into a MySQL database, exposes a backend API, and renders a frontend dashboard to visualize financial insights interactively.

---

##  System Architecture Overview

- **Backend (Python + MySQL)**
  - Parses exported SMS files (`sms.xml`)
  - Extracts transaction data, amounts, dates, types, contacts, and financial information
  - Inserts clean data into MySQL database (`sms_messages` table)
  - Exposes a REST API with Flask for frontend consumption

- **Frontend (Vanilla JavaScript + TailwindCSS + Chart.js)**
  - Fetches parsed transaction data from backend API
  - Visualizes user’s mobile money transactions as charts, stats, and tables
  - Supports advanced filtering and contact-level analytics

---

## Full Project Structure

├── backend/
│   ├── app.py               # Flask API server
│   ├── config.py            # MySQL DB credentials
│   ├── sms.py               # SMS parsing and extraction logic
│   ├── sms.xml              # Raw exported SMS backup (input data)
│   └── schema.sql           # MySQL database schema definition
└── frontend/
├── index.html           # Main frontend dashboard
├── js/
│   ├── charts.js        # Chart.js rendering logic
│   ├── contactAnalytics.js # Contact level analytics logic
│   ├── calculations.js  # Global statistics calculations
│   ├── statsCards.js    # Stats summary card rendering
│   └── transactionList.js # Transaction list rendering


---

# Getting Started (Setup Instructions)

### 1️ Prerequisites

- Python 3.9+
- MySQL 8.x
- Node.js 16+
- npm or yarn (only if modifying frontend build)
- Browser (for running frontend directly)

---

### 2️ Backend Setup (Python & MySQL)

####  Install Python dependencies

```bash
pip install flask mysql-connector-python
````

#### ✅ Setup MySQL database

```bash
mysql -u root -p
source backend/schema.sql
```

> ✅ This creates the required `sms_messages` table used by the backend.

#### ✅ Import SMS data

* Place your exported SMS backup file as `sms.xml` inside `/backend`.
* Run the extraction:

```bash
python backend/sms.py
```

> ✅ This parses, classifies, and inserts transactions into MySQL.

#### ✅ Run Flask API Server

```bash
python backend/app.py
```

By default, this will serve API at:

```
http://localhost:5000/api/messages
```

---

### 3️ Frontend Setup

#### ✅ Launch Frontend

* No build step needed.
* Simply open `frontend/index.html` directly in your browser.
* Ensure your Flask API server is running in parallel.

---

#  Backend Technical Details

###  SMS Parsing & Data Extraction

* The SMS source file (`sms.xml`) is an Android SMS Backup & Restore export file.
* Python uses `xml.etree.ElementTree` to parse each `<sms>` record.

###  Classification Logic

Inside `sms.py`:

* `classify_transaction()` function uses string pattern matching to categorize:

  * `received`
  * `payment`
  * `deposit`
  * `transferred`
  * `unknown`

###  Amount Extraction Logic

* `extract_amount()` applies regex patterns like:

```python
r"(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*RWF"
```

* Supports parsing amounts like:

  * `1,000 RWF`
  * `40000 RWF`
  * `2000 RWF`

###  MySQL Schema Overview

Table: `sms_messages`

| Column               | Type     | Description       |
| -------------------- | -------- | ----------------- |
| id                   | INT (PK) | Auto increment ID |
| protocol             | VARCHAR  | SMS protocol      |
| address              | VARCHAR  | SMS sender        |
| date                 | BIGINT   | Unix timestamp    |
| type                 | INT      | SMS type          |
| subject              | VARCHAR  | Subject           |
| body                 | TEXT     | Full message      |
| service\_center      | VARCHAR  | Service center    |
| read\_flag           | BOOLEAN  | Read status       |
| status               | INT      | Delivery status   |
| locked               | BOOLEAN  | Lock flag         |
| date\_sent           | BIGINT   | Unix timestamp    |
| sub\_id              | INT      | Sub ID            |
| readable\_date       | VARCHAR  | Human date        |
| contact\_name        | VARCHAR  | Name extracted    |
| extracted\_amount    | DECIMAL  | Parsed amount     |
| transaction\_type    | VARCHAR  | Transaction type  |
| sender\_or\_receiver | VARCHAR  | Contact involved  |

 Full SQL schema located in `schema.sql`.

---

#  Frontend Logic Summary

The frontend is fully interactive and designed to consume the backend API responses.

### ✅ Main Modules Breakdown

| File                  | Responsibility                             |
| --------------------- | ------------------------------------------ |
| `index.html`          | Base structure with chart containers       |
| `charts.js`           | Chart.js visualization of transaction data |
| `calculations.js`     | Financial stats computations               |
| `contactAnalytics.js` | Contact-wise aggregations                  |
| `transactionList.js`  | Transaction history list rendering         |
| `statsCards.js`       | Summary statistics cards generation        |

### ✅ Data Flow

1. Frontend sends `GET` request to:

```
http://localhost:5000/api/sms-messages
```

2. Response JSON is processed globally for:

* Transaction counts
* Total income & expenses
* Most frequent contacts
* Daily/weekly trends
* Individual contact histories

---

#  Current Frontend Features

* Transaction list view
* Contact-wise transaction breakdown
* Total received, paid, transferred summaries
* Pie charts for transaction types
* Contact-based most frequent partners
* Total income vs total expenses comparisons
* Auto updates via REST API without page refresh
* Simple filter options to focus on particular transaction types
