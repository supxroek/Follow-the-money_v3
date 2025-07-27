# Development Commands & Scripts

## Server Commands (Backend)
```bash
# เข้าไปในโฟลเดอร์ server
cd server

# ติดตั้ง dependencies
npm install

# รัน development server (มี auto-restart)
npm run dev

# รัน production server
npm start

# ทดสอบการเชื่อมต่อ
curl http://localhost:3000/health
# หรือใน PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/health
```

## Client Commands (Frontend)
```bash
# เข้าไปในโฟลเดอร์ client
cd client

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Database Commands
```bash
# MongoDB connection string (ใช้ MongoDB Atlas)
# ดูใน server/.env

# ทดสอบการเชื่อมต่อ database
# เมื่อรัน npm run dev ใน server จะแสดงสถานะการเชื่อมต่อ
```

## API Testing Commands
```bash
# Health check
curl http://localhost:3000/health

# หรือใน PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/health
```

## Git Commands (Windows)
```bash
# ดูสถานะ
git status

# เพิ่มไฟล์
git add .

# Commit
git commit -m "message"

# Push
git push

# ดู branch
git branch

# สลับ branch
git checkout branch-name
```

## File System Commands (Windows PowerShell)
```powershell
# แสดงไฟล์ในโฟลเดอร์
ls
# หรือ Get-ChildItem

# เข้าไปในโฟลเดอร์
cd folder-name

# ดู path ปัจจุบัน
pwd
# หรือ Get-Location

# ค้นหาไฟล์
Get-ChildItem -Recurse -Name "*.js"

# ดูเนื้อหาไฟล์
Get-Content filename.txt
```

## Environment Setup
```bash
# Copy environment template
copy server\.env.example server\.env

# แก้ไข environment variables ใน server/.env:
# - MONGODB_URI (MongoDB Atlas connection string)
# - LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN
# - LIFF_ID
```

## Development Workflow
1. เปิด terminal 2 หน้าต่าง
2. Terminal 1: `cd server && npm run dev` (Backend)
3. Terminal 2: `cd client && npm run dev` (Frontend) 
4. เปิด browser ไปที่ http://localhost:5173 (Frontend)
5. Backend API อยู่ที่ http://localhost:3000