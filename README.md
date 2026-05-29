```text
   ____                   _        
  / __ \  _   _   ___   | |_   __ _ 
 / / _` || | | | / _ \  | __| / _` |
| | (_| || |_| || (_) | | |_ | (_| |
 \ \__,_| \__,_| \___/   \__| \__,_|
  \____/                            
```

# Quota: Smart Incentive Management

Quota is a professional, high-performance platform designed for automotive sales teams to log performance and manage complex incentive structures with precision. It replaces messy spreadsheets with a dense, intentional interface focused on efficiency and data clarity.

## What is Quota?

Quota provides a centralized ecosystem for:
- **Sales Representatives**: To log monthly vehicle sales and track incentive earnings in real-time.
- **Administrators**: To manage the vehicle inventory and define the performance-based payout logic (Incentive Tiers).

---

## Getting Started

To explore the platform, you can use the following pre-configured test accounts:

| Role | Email | Password |
|------|-------|----------|
| **System Administrator** | `admin@test.com` | `admin123` |
| **Sales Representative** | `sales@test.com` | `sales123` |

---

## Platform Routes & Functionality

### 1. Sales Portal (`/sales`)
The primary workspace for Sales Representatives.
- **Dashboard**: A high-density interface for selecting a reporting period (month) and entering sales volume for specific vehicle models.
- **Real-time Metrics**: As you enter numbers, the system automatically calculates your current "Payout Tier" and "Estimated Earnings" using the active administrative logic.
- **Incentive Roadmap**: A visual guide showing upcoming tiers and the volume required to reach higher payout rates.

### 2. Sales History (`/sales/history`)
- **Reporting Log**: A chronological, tabular view of all historical sales data submitted by the user.
- **Audit Trail**: Perfect for verifying past submissions and tracking performance over long durations.

### 3. Performance Analytics (`/sales/performance`)
- **Key Metrics**: High-level summaries of cumulative earnings, lifetime sales volume, and monthly averages.
- **Monthly Breakdown**: An analytical view that aggregates performance by month, showing exactly which tier was reached and the total payout for that period.

### 4. System Administration (`/admin`)
Reserved for users with the **Admin** role.
- **Vehicle Inventory**: Add, edit, or remove vehicle models and variants available for reporting.
- **Incentive Tiers (Slabs)**: Define the logic that drives the entire system. Set minimum and maximum car counts for specific payout rates (e.g., 1-3 cars = ₹5,000/car, 4-7 cars = ₹10,000/car).

---

## User Experience Standards
Quota is built for professionals who value speed and density:
- **Zero Fluff**: No unnecessary animations or oversized components.
- **Dense Data**: Information is organized into clean, scannable tables and compact cards.
- **Responsive**: Fully functional on desktop and mobile for logging sales on the showroom floor.
