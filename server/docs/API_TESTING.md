# Follow the Money's API Testing

## Health Check

```bash
curl http://localhost:3000/health
```

## Authentication Endpoints

### 1. LINE Login (ต้องมี LINE access token จริง)

```bash
curl -X POST http://localhost:3000/api/auth/line-login \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "YOUR_LINE_ACCESS_TOKEN"
  }'
```

### 2. Get User Profile (ต้องมี JWT token)

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Update Profile

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0812345678",
    "paymentMethods": [{
      "type": "promptpay",
      "value": "0812345678",
      "isDefault": true
    }]
  }'
```

## Groups Endpoints

### 1. Create Group

```bash
curl -X POST http://localhost:3000/api/groups/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "บ้านเช่า 123",
    "description": "ค่าใช้จ่ายในบ้าน"
  }'
```

### 2. Join Group

```bash
curl -X POST http://localhost:3000/api/groups/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupCode": "ABC123"
  }'
```

### 3. Get My Groups

```bash
curl http://localhost:3000/api/groups/my-groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Group Details

```bash
curl http://localhost:3000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Leave Group

```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/leave \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with PowerShell

### Health Check

```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

### Test API with JSON

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

$body = @{
    groupName = "Test Group"
    description = "Test Description"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/groups/create -Method POST -Headers $headers -Body $body
```

## Environment Variables ที่ใช้

- `MONGODB_URI` - MongoDB Atlas connection string ✅
- `LINE_CHANNEL_ID` - LINE Channel ID ✅
- `LINE_CHANNEL_SECRET` - LINE Channel Secret ✅
- `LINE_CHANNEL_ACCESS_TOKEN` - LINE Channel Access Token ✅
- `LIFF_ID` - LINE LIFF App ID ✅

## Next Steps

1. สร้าง Frontend เพื่อเชื่อมต่อกับ API
2. ทดสอบ LINE Login integration
3. สร้าง Expense management system
4. เพิ่ม LINE Messaging API สำหรับการแจ้งเตือน
