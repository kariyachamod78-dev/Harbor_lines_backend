# Harbor Lines ERP Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express-v5.1.0-lightgrey.svg)

The robust backend API for the **Harbor Lines ERP** system. Built with Node.js, Express, and MongoDB, this service manages the core logic for freight operations, master data administration, and secure user authentication.

## 🚀 Technologies

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5.1.0)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## ✨ Key Features

### 🔐 Security & Auth
- **JWT Authentication**: Stateless, secure user sessions.
- **Role-Based Access**: Granular permission control for API endpoints.
- **Data Protection**: Password hashing and input validation.

### 🗂️ Master Data Management
Comprehensive CRUD endpoints for system configuration:
- **Partners**: Customer and Supplier management.
- **Finance**: Currency rates, Bank details, and Tax rules.
- **Standards**: Unit of Measurement (UOM) definitions.

### 🚢 Freight Operations
- **Asset Management**: Databases for Vessels and Flights.
- **Route Configuration**: Sea and Air destination management.
- **Import Jobs**: Full lifecycle management for **Sea Import** and **Air Import** jobs.
- **Export Jobs**: Dedicated module for outbound freight management.
- **Documentation Support**: Integrated data endpoints for dynamic **Sales Invoices** and **Manifest Reports**, including complex vessel/voyage lookups and HBL/MBL grouping.
- **DO Management**: Generation and retrieval of Delivery Orders.

### 🇨🇦 Canada Manifest (Specialized Module)
- **Multi-DB Integration**: Dedicated data isolation for Canada-specific compliance.
- **HBL & Reference Tracking**: Granular tracking of weights, CBM, and package counts.
- **Automated Calculations**: Real-time recalculation of manifest totals upon HBL updates.

### 📊 Dashboard & Stats
- **Global Overview**: Aggregated metrics across Sea, Air, and Canada operations.
- **Financial Insights**: Revenue tracking and outstanding invoice monitoring.
- **Trend Analysis**: Statistical data for job distribution and monthly growth.

## 📡 API Endpoints

| Category | Endpoint | Description |
|-----------|-----------|--------------|
| **Auth** | `/api/auth` | Login and Registration |
| **Users** | `/api/users` | User administration |
| **Partners** | `/api/customersuppliers` | Customers & Suppliers |
| **Finance** | `/api/currencies` | Currency exchange rates |
| **Finance** | `/api/banks` | Bank account details |
| **Finance** | `/api/taxes` | Tax configurations |
| **Standards** | `/api/uoms` | Units of Measurement |
| **Freight** | `/api/vessels` | Sea Vessels |
| **Freight** | `/api/flights` | Air Flights |
| **Routes** | `/api/sea-destinations` | Sea Ports |
| **Routes** | `/api/air-destinations` | Airports |
| **Ops (Sea)** | `/api/jobs/sea-import` | Sea Import Jobs |
| **Ops (Air)** | `/api/jobs/air-import` | Air Import Jobs |
| **Ops (Export)**| `/api/jobs/export` | Export Jobs |
| **Docs** | `/api/delivery-orders` | Delivery Orders |
| **Docs** | `/api/air-waybills` | Air Waybills |
| **Canada** | `/api/canada/manifests` | Canada Manifest management |
| **Stats** | `/api/stats/dashboard` | Main dashboard metrics |
| **Stats** | `/api/stats/canada` | Canada-specific analytics |

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/VimukthiPramudantha/Harbor_lines_backend.git
    cd Harbor_lines_backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/harbor_lines
    JWT_SECRET=your_super_secret_key_change_this
    ```

4.  **Run the Server**:
    ```bash
    # Development (with hot reload)
    npm run dev

    # Production
    npm start
    ```

## 📁 Project Structure

```text
src/
├── config/         # Database and app configuration
├── controllers/    # Request handlers (logic layer)
├── middleware/     # Auth and error handling middleware
├── models/         # Mongoose data schemas
├── routes/         # API route definitions
├── utils/          # Helper functions
└── server.js       # App entry point
```
