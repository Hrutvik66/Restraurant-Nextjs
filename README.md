# 🍴 Restaurant Website Project 🍽️

![Restaurant Banner](https://img.freepik.com/free-vector/cloud-kitchen-concept-illustration_114360-19132.jpg?t=st=1732685371~exp=1732688971~hmac=1274132d33a98f55bc9df7614508f577d7c309148110c89039824d3215844179&w=700&h=400) 

## 🌟 Overview
This project is a fully-featured restaurant management platform that includes a backend and frontend:

- **Backend**: A RESTful API built with Node.js, Express.js, and Prisma, featuring TypeScript for type safety and PostgreSQL for the database.
- **Frontend**: A modern web interface built with Next.js, Tailwind CSS, and React Context for state management.

## ✨ Features
### For Users 🛒
- 🏷️ Browse the menu and add items to the cart.
- 🛍️ Place orders without creating an account.

### For Restaurant Owners 🧑‍🍳
- 🍔 Manage food items (add, update, delete).
- 📋 View and update order statuses.
- 🏪 Open and close the restaurant.

### Admin Panel ⚙️
- 👨‍💼 Manage restaurant owners.
- 📊 Monitor analytics such as:
  - 📅 Sales per day
  - 🏆 Top-selling items
  - 💰 Total revenue
  - 📦 Orders placed this month

## 🛠️ Tech Stack
### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) **Node.js** with **Express.js** for building the REST API.
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white) **Prisma** ORM for database operations.
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) **PostgreSQL** as the database.
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) **TypeScript** for static typing.
- ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) **Redis** for session management.
- **PhonePe Payment Gateway** for transactions.

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) **Next.js** for server-side rendering and client-side navigation.
- ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) **React** with Context API for state management.
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS** for styling.
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) **Axios** for API requests.
- ![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white) **Socket.io** for real-time updates.

## 🚀 Installation
### Prerequisites
- Node.js (>= 16.x)
- PostgreSQL
- Redis
- Yarn or npm

### Steps to Run the Project
#### 1. Clone the Repository 🛠️
```bash
git clone <repository-url>
cd Restraurant-Nextjs-main
```

#### 2. Backend Setup 🗄️
1. Navigate to the backend folder:
   ```bash
   cd restraurant-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your database and Redis credentials.
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

#### 3. Frontend Setup 🖥️
1. Navigate to the frontend folder:
   ```bash
   cd ../restraurant-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🗂️ Project Structure
### Backend (`restraurant-backend`)
- **`src/`**: Contains the application logic, routes, and controllers.
- **`prisma/`**: Database schema and migrations.

### Frontend (`restraurant-frontend`)
- **`app/`**: Next.js pages and routing.
- **`components/`**: Reusable UI components.
- **`context/`**: State management using React Context.
- **`hooks/`**: Custom hooks for reusable logic.
- **`public/`**: Static assets like images.

## 📜 Scripts
### Backend
- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the backend.
- **`npm run migrate`**: Run Prisma migrations.

### Frontend
- **`npm run dev`**: Start the frontend development server.
- **`npm run build`**: Build the frontend for production.
- **`npm run lint`**: Lint the codebase.


![Thanks for visiting!](https://img.freepik.com/free-vector/thank-you-lettering-with-curls_1262-6964.jpg?t=st=1732685529~exp=1732689129~hmac=14179e94094e5174c74ed90aeffed4b208b5b2acfba35b19c652dd8e79ce68a8&w=300)