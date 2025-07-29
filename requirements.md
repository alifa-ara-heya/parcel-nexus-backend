# Parcel Delivery API

### **🎯 Project Overview**

Design and build a **secure, modular, and role-based backend API** for a parcel delivery system (inspired by Pathao Courier or Sundarban) using **Express.js** and **Mongoose**.

Your task is to implement a system where users can register as senders or receivers and perform parcel delivery operations such as **create parcel**, **track status**, and **cancel or receive parcels**.

You must implement:

- 🔐 Authentication
- 🎭 Role-based Authorization (`admin`, `sender`, `receiver`)
- 🧱 Parcel and Status Management (status history embedded inside parcel model)
- 📦 Modular Code Architecture
- 🧱 Transactional Logic
- 🔁 Proper API Endpoints

While the **system design is up to you**, the implementation **must include the following minimum requirements**.

---

### **📌 Minimum Functional Requirements**

- ✅ JWT-based login system with three roles: `admin`, `sender`, `receiver`
- ✅ Passwords must be securely hashed (using bcrypt or appropriate method)
- ✅ Senders can:
  - Create parcel delivery requests
  - Cancel parcel (if not dispatched)
  - View all their parcels and status logs
- ✅ Receivers can:
  - View incoming parcels
  - Confirm parcel delivery
  - Delivery history
- ✅ Admins can:
  - View and manage all users and parcels
  - Block or unblock users or parcels
  - Update delivery statuses or assign delivery personnel (optional)
- ✅ All parcels and their status changes must be **stored and trackable**
- ✅ Role-based route protection must be implemented

---

### **🏷️ You Must Decide**

This project encourages **design thinking**. You must decide and implement:

- How and when a **parcel is created and dispatched**?
- What fields and schema structure each parcel should have (include status log inside parcel schema)?
- Whether a parcel can be **flagged or held**?
- What fields are necessary for a **parcel** and a **status log (as subdocument inside parcel)**?
- How to handle **status changes** (e.g., Requested → Picked → In Transit → Delivered)?
- How sender/receiver/admin interact with **parcel records**?
- Whether **delivery agents or hubs** are involved (optional)?

---

### **📦 Parcel Logic**

- When and how is a **parcel created**?
  - By sender only?
  - or by Admin?
- What are required fields for a parcel?
  - e.g., type, weight, sender/receiver info, address, fee, delivery date, status logs, etc.
- Can a parcel be **canceled**, **blocked**, **returned**, or **rescheduled**?
- What are the **valid parcel status**
  - Requested → Approved → Dispatched → In Transit → Delivered (you decide)
- Can a user **delete** a parcel?
- Should each parcel have a **unique tracking ID**?
  - Format: `TRK-YYYYMMDD-xxxxxx`?
  - Include: trackingEvents[]: Array of status logs (location + timestamp + status + note)?
- How are **fees calculated**? (Optional)
  - Based on weight, distance, or flat rate?

---

### **🔁 Status & Tracking Design**

- What fields are required in a **status log** (as part of the parcel model)?
  - e.g., status, timestamp, updatedBy (admin/system)
- How to **track parcel history** by sender or receiver?
- Will you allow **search/filter by status or delivery time**?
- Should tracking info be public (e.g., via tracking ID)? (optional)

> 🛠 Note: Status log must be stored as an array of objects inside the parcel document (subdocument pattern). No need to build a separate statusLog module.

---

### **🫆 Validations & Business Rules**

- Can a sender cancel a **dispatched parcel**?
- Can a receiver mark a parcel as **delivered** themselves?
- Can blocked users **access features**?
- What validations will you enforce?
  - e.g., user role checks, parcel ownership, delivery status flow

---

### **📜 Access & Visibility**

- Who can view:
  - All parcels?
  - Specific parcel status?
  - Delivery logs?
- Can a sender see only their parcels?
- Can a receiver see parcels being delivered to them?
- Can admins access all records with filters?

---

### **🔐 Role-Based Control**

- Which endpoints are:
  - **Sender-only**?
  - **Receiver-only**?
  - **Admin-only**?
  - **Public or shared**?
- How will you **authorize** each request based on role?

---

### **🧩 API Design**

- Which API endpoints will you build?
  - RESTful resource naming preferred
  - e.g., `POST /parcels`, `GET /parcels/me`, `PATCH /parcels/cancel/:id`, `GET /parcels/:id/status-log`
- Will you include:
  - **Tracking ID system**?
  - **Status log history embedded and returned via parcel details?**
- How will you handle:
  - Error responses
  - Status codes
  - Success feedback

---

### **🧠 Optional (Bonus Considerations)**

- Will you implement:
  - **Tracking system with tracking ID lookup?**
  - **Fee calculation based on parcel weight or location?**
  - **Special discount using coupon?**
  - **Admin dashboard support (via API)?**

---

### **📁 Suggested Project Structure**

```bash
bash
CopyEdit
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── parcel/   # Parcel module includes status log handling internally
├── middlewares/
├── config/
├── utils/
├── app.ts

```

---

### **🧪 Testing & Documentation**

- ✅ Use **Postman** to test and document your endpoints
- ✅ Submit a professional README.md with:
  - Project overview
  - Setup and environment instructions
  - A summary of all implemented endpoints
- ✅ Submit a **5–10 minute screen-recorded video** demonstrating:
  - **Intro (30s)** – Name + Project title + What it does
  - **Folder Structure (1 min)** – Show `src/`, explain main modules
  - **Authentication/Authorization Flow (1 min)** – Register, Login, show JWT + roles
  - **Sender Features (1 mins)** – Parcel creation, cancel, list, status
  - **Receiver Features (1 mins)** – Track parcel, confirm delivery
  - **Admin Features (1 mins)** – View all, block users, update status
  - **API Testing (3–4 mins)** – Show Postman collection working
  - **Ending (30s)** – Mention README, deployment, say thanks

---

### **📊 Evaluation Rubric (Total: 60 Marks)**

| **Criteria**                                                   | **Marks** |
| -------------------------------------------------------------- | --------- |
| 🔐 Authentication (JWT + bcrypt)                               | 5         |
| 🔒 Role-Based Authorization Middleware                         | 5         |
| 🧍 Sender/Receiver Logic + Schema Design + Validation          | 10        |
| 📦 Parcel & Status Design + Validations                        | 10        |
| 🔁 Status History, Tracking + Filtering (inside parcel schema) | 10        |
| 🧱 Code Structure + Error Handling                             | 5         |
| 🧠 Creativity + Thoughtful Design                              | 5         |
| 📄 README + 🔁 API Testing + 🎥 Video                          | 10        |
| **Total**                                                      | **60**    |
