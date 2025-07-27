# Tech Stack & Architecture

## Frontend (Client)
- **Framework**: React 19.1.0 + Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Build Tool**: Vite (development server + build)
- **Linting**: ESLint 9.30.1
- **Type System**: JavaScript (not TypeScript currently)

## Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (using Mongoose 8.0.3)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: Helmet 7.1.0, bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Development**: nodemon 3.0.2

## External Integrations
- **LINE Login**: OAuth authentication
- **LINE LIFF**: เชื่อมต่อ web app กับ LINE
- **LINE Messaging API**: ส่งการแจ้งเตือน
- **MongoDB Atlas**: Cloud database

## Project Structure
```
Follow-the-money_v3/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── main.jsx       # Entry point
│   │   ├── assets/        # Static assets
│   │   └── ...
│   ├── public/            # Public assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
├── server/                # Express backend
│   ├── models/            # MongoDB models
│   │   ├── User.js        # User schema
│   │   └── Group.js       # Group schema
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── groups.js      # Group management routes
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication
│   ├── services/          # External service integrations
│   ├── utils/             # Helper functions
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
└── .serena/               # Serena configuration
```

## Architecture Pattern
- **Monorepo**: Frontend และ Backend แยกโฟลเดอร์
- **REST API**: Backend ให้บริการ REST endpoints
- **MVC Pattern**: Models, Routes (Controllers), Middleware
- **Middleware Chain**: Authentication, Validation, Error Handling