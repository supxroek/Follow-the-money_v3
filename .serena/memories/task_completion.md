# Task Completion Checklist

## When a Development Task is Completed

### 1. Code Quality Checks
- [ ] **Linting**: Run `npm run lint` in client folder
- [ ] **Code Style**: ตรวจสอบว่าตาม conventions ใน `code_style.md`
- [ ] **Error Handling**: มี try-catch และ error messages ที่เหมาะสม
- [ ] **Security**: ตรวจสอบ input validation และ authentication

### 2. Testing
- [ ] **Manual Testing**: ทดสอบ functionality ที่เพิ่มใหม่
- [ ] **API Testing**: ใช้ curl หรือ Postman ทดสอบ endpoints
- [ ] **Health Check**: รัน `curl http://localhost:3000/health`
- [ ] **Database**: ตรวจสอบว่า MongoDB operations ทำงานถูกต้อง

### 3. Environment & Configuration
- [ ] **Environment Variables**: อัพเดท .env.example ถ้าเพิ่ม variables ใหม่
- [ ] **Dependencies**: ตรวจสอบว่า package.json ถูกต้อง
- [ ] **Server Restart**: ทดสอบ `cd server && npm run dev`
- [ ] **Client Restart**: ทดสอบ `cd client && npm run dev`

### 4. Documentation
- [ ] **API Documentation**: อัพเดท API_TESTING.md ถ้าเพิ่ม endpoints ใหม่
- [ ] **Comments**: เพิ่ม comments สำหรับ complex logic
- [ ] **Memory Updates**: อัพเดท memory files ถ้ามีการเปลี่ยนแปลงสำคัญ

### 5. Git & Version Control
- [ ] **File Organization**: ไฟล์อยู่ในโฟลเดอร์ที่ถูกต้อง
- [ ] **Commit Message**: เขียน commit message ที่ชัดเจน
- [ ] **Branch Status**: ตรวจสอบว่าอยู่ใน branch ที่ถูกต้อง

### 6. Integration Testing
- [ ] **Frontend-Backend**: ทดสอบการเชื่อมต่อระหว่าง client และ server
- [ ] **LINE Integration**: ทดสอบ LINE Login และ API integration (ถ้าเกี่ยวข้อง)
- [ ] **Database Connectivity**: ตรวจสอบการเชื่อมต่อ MongoDB Atlas

### 7. Performance & Security
- [ ] **Response Time**: API endpoints ตอบสนองเร็วพอ
- [ ] **Memory Usage**: ไม่มี memory leaks
- [ ] **Authentication**: JWT tokens ทำงานถูกต้อง
- [ ] **CORS**: Client สามารถเชื่อมต่อ server ได้

## Common Commands for Verification

### Server Health Check
```bash
cd server && npm run dev
curl http://localhost:3000/health
```

### Client Build Check  
```bash
cd client && npm run lint
cd client && npm run build
```

### Full Stack Test
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev

# Browser: http://localhost:5173
# API: http://localhost:3000
```

## Phase-Specific Completions

### Phase 1: Backend Foundation ✅
- [ ] MongoDB models created
- [ ] Authentication system working
- [ ] Basic API endpoints functional

### Phase 2: Group Management
- [ ] Group creation/joining works
- [ ] Member management functional  
- [ ] Role-based permissions working

### Phase 3: Expense Management
- [ ] Expense creation system
- [ ] Auto-split calculations
- [ ] Debt tracking functionality

### Phase 4: LINE Integration
- [ ] LINE Login working
- [ ] LIFF integration complete
- [ ] Messaging API functional

### Phase 5: Advanced Features
- [ ] Auto debt settlement
- [ ] Payment tracking
- [ ] Receipt processing