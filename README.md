# School Vaccination Portal

A full-stack web application designed to help school coordinators manage and track student vaccination drives. This system provides tools for managing student data, scheduling drives, updating vaccination status, and generating detailed reports.

---

## Tech Stack

| Layer     | Technology             |
| --------- | ---------------------- |
| Frontend  | React.js, React Router |
| Backend   | Node.js, Express.js    |
| Database  | MongoDB (via Mongoose) |
| Reporting | react-csv, jsPDF       |

---

## Assumptions made

- We have the mongo db installed and we are able to connect to the mongo db locally

## Key Features

### Student Management

- Add/view/edit/delete student records
- Bulk upload via excel
- View/search by name, grade, status
- Track vaccination history per student

### Vaccination Drives

- Schedule and manage drives
- Supports multiple vaccines and grade filters
- Validates no overlaps and ensures 15-day notice
- Prevents editing past drives

### Dashboard

- Metrics: total students, number of avccinated students, vaccinated %, upcoming drives
- View insights at a glance

### Reports

- Filter by vaccine, grade, or vaccination date
- Paginated data exportable to CSV, Excel, or PDF

### Authentication

- Register a new user
- Login using the given user
- Using JWT to authenticate the API usage

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dimple-AA/school-vaccination-portal.git
cd school-vaccination-portal
```

### 2. Start Backend

```bash
cd server
npm install
npm run start
```

### 3. Start Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Login

1. Create a new user, by registering a new user
2. Login using the given user.

---

## Author

Developed by Dimple A A for FSAD SE ZG503 Assignment – 2025.
