# LINE LIFF และ LINE Login Setup Guide

## 🔧 LINE Developer Console Configuration

### 1. LINE Login Channel Setup

เข้าไปที่ [LINE Developers Console](https://developers.line.biz/console/)

#### Channel Settings:
- **Channel ID**: `2007806921`
- **Channel Type**: LINE Login
- **Channel Secret**: `5a153b0625c4f7657acf3e9d51cc1afd`

#### Callback URLs:
```
Development: http://localhost:5173
Production: https://follow-the-money-v3-client.onrender.com
```

#### Required Scopes:
- `profile` - ข้อมูลพื้นฐาน (displayName, pictureUrl)
- `openid` - การยืนยันตัวตน

### 2. LINE LIFF App Setup

#### LIFF App Settings:
- **LIFF ID**: `2007806921-LYXebj6w`
- **LIFF App Name**: Follow the Money's
- **Size**: Full (เต็มหน้าจอ)
- **Endpoint URL**:
  - Development: `http://localhost:5173`
  - Production: `https://follow-the-money-v3-client.onrender.com`

#### Required Features:
- ✅ **Scan QR Code**: สำหรับสแกน QR ชำระเงิน
- ✅ **Send Messages**: ส่งการแจ้งเตือน
- ✅ **Share Target Picker**: แชร์ข้อมูลค่าใช้จ่าย

## 🌐 LIFF Integration Flow

### 1. User Access Scenarios

#### A. เข้าผ่าน Web Browser (Desktop/Mobile)
```mermaid
graph TD
    A[User เข้า Web App] --> B[LIFF.init()]
    B --> C{LIFF Ready?}
    C -->|Yes| D[Check isLoggedIn()]
    C -->|No| E[แสดง Error]
    D -->|Not Logged| F[liff.login() - Popup]
    D -->|Logged In| G[Get Access Token]
    F --> H[LINE Login Page]
    H --> I[Authorize & Redirect]
    I --> G
    G --> J[Send to Backend]
    J --> K[Backend Verify with LINE API]
    K --> L[Return JWT Token]
    L --> M[Store JWT & Redirect to Dashboard]
```

#### B. เข้าผ่าน LINE App
```mermaid
graph TD
    A[User เปิด LIFF ใน LINE] --> B[LIFF.init()]
    B --> C[Auto Login Success]
    C --> D[Get Access Token]
    D --> E[Send to Backend]
    E --> F[Return JWT Token]
    F --> G[Store & Show Dashboard]
```

### 2. Authentication Process

#### Frontend (LIFF SDK)
```javascript
// 1. Initialize LIFF
await liff.init({ liffId: 'LIFF_ID' });

// 2. Check login status
if (!liff.isLoggedIn()) {
    liff.login(); // Will redirect to LINE Login
}

// 3. Get access token
const accessToken = liff.getAccessToken();

// 4. Send to backend
const response = await authAPI.lineLogin(accessToken);
```

#### Backend (LINE API Verification)
```javascript
// 1. Receive access token from frontend
const { accessToken } = req.body;

// 2. Verify with LINE API
const lineResponse = await axios.get('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` }
});

// 3. Get user profile
const { userId, displayName, pictureUrl } = lineResponse.data;

// 4. Find or create user in database
let user = await User.findOne({ lineId: userId });

// 5. Return JWT token
const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET);
```

## 🔒 Security Considerations

### 1. Token Validation
- **Access Token**: ตรวจสอบกับ LINE API ทุกครั้ง
- **JWT Token**: มีอายุ 7 วัน, ใช้ secure secret
- **HTTPS Only**: ใน production environment

### 2. CORS Configuration
```javascript
// Backend CORS Settings
origin: [
    'http://localhost:5173',
    'https://follow-the-money-v3-client.onrender.com'
],
credentials: true
```

### 3. Content Security Policy
```javascript
// Allow LINE CDN and APIs
scriptSrc: ['https://static.line-scdn.net'],
connectSrc: ['https://api.line.me', 'https://access.line.me']
```

## 🧪 Testing Methods

### 1. Local Development Testing
```bash
# Start servers
cd server && npm run dev
cd client && npm run dev

# Test URLs
Frontend: http://localhost:5173
Backend: http://localhost:3000/health
```

### 2. LIFF Testing Tools

#### In Browser Console:
```javascript
// Check LIFF status
console.log('LIFF ready:', liff.isReady());
console.log('Logged in:', liff.isLoggedIn());
console.log('In client:', liff.isInClient());

// Get profile
liff.getProfile().then(profile => console.log(profile));
```

#### Development Debug Info:
- แสดง LIFF ID และสถานะใน LoginPage
- Console logs สำหรับ LIFF events
- Error handling แสดง detailed errors

### 3. Production Testing
```
1. เข้า https://follow-the-money-v3-client.onrender.com/
2. กดปุ่ม "เข้าสู่ระบบด้วย LINE"
3. ตรวจสอบ redirect และ authentication flow
4. ทดสอบใน LINE app โดยเปิด LIFF URL
```

## 🚨 Common Issues & Solutions

### 1. LIFF Initialization Failed
```javascript
// เช็คและแก้ไข LIFF ID
const liffId = import.meta.env.VITE_LIFF_ID;
if (!liffId) {
    console.error('VITE_LIFF_ID not found in environment');
}
```

### 2. CORS Errors
- ตรวจสอบ URL ใน LINE Developer Console
- ตรวจสอบ backend CORS configuration
- ตรวจสอบ protocol (http vs https)

### 3. LOGIN_REQUIRED Error
```javascript
// Reset LIFF และ login ใหม่
liff.logout();
window.location.reload();
```

### 4. Token Verification Failed
- ตรวจสอบ LINE Channel Secret
- ตรวจสอบ network connectivity
- ตรวจสอบ token expiration

## 📱 LINE App Integration Features

### 1. Send Messages (แจ้งเตือน)
```javascript
await liff.sendMessages([{
    type: 'text',
    text: 'คุณมีค่าใช้จ่ายใหม่ที่ต้องชำระ 500 บาท'
}]);
```

### 2. Share Target Picker (แชร์ข้อมูล)
```javascript
await liff.shareTargetPicker([{
    type: 'text',
    text: 'มาร่วมกลุ่มค่าใช้จ่าย "เที่ยวภูเก็ต" กันเถอะ!'
}]);
```

### 3. Close LIFF Window
```javascript
// ปิด LIFF app หลังจากทำงานเสร็จ
liff.closeWindow();
```

## 📊 Analytics & Monitoring

### 1. LIFF Events Tracking
- User login success/failure
- Feature usage (scan QR, send messages)
- Error rates และ common issues

### 2. Performance Monitoring
- LIFF initialization time
- API response times
- User flow completion rates

---

**📝 Note**: LIFF ID และ Channel settings ต้องตรงกันทุกประการระหว่าง environment ต่างๆ