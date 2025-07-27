# Production Environment Configuration

## Backend (.env)
```
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://suparoek:QNuvWwGlzjcRvA8Z@follow-the-money.ddzzmua.mongodb.net/?retryWrites=true&w=majority&appName=follow-the-money

# Client URL
CLIENT_URL=https://follow-the-money-v3-client.onrender.com

# JWT Secret
JWT_SECRET=production-jwt-secret-key-super-secure-12345

# LINE API Configuration
LINE_CHANNEL_ID=2007806921
LINE_CHANNEL_SECRET=5a153b0625c4f7657acf3e9d51cc1afd
LINE_CHANNEL_ACCESS_TOKEN=eNNEWQWBlrX7bnnsbL4n0SowkqUG+YlEHLLGJn+g2Au2icf8ke8sfqB67K6/Ba/rdMbD3QS/82vZKpbcy6BB536KjsGXWGSH38Qre+3nvy5w6/nfiEBE0WmsllZbNEt8CPN3gAdFW9hYSiVMAGdviQdB04t89/1O/w1cDnyilFU=

# LINE LIFF Configuration
LIFF_ID=2007806921-LYXebj6w
```

## Frontend (.env)
```
# API Configuration
VITE_API_URL=https://follow-the-money-v3-server.onrender.com/api

# LINE LIFF Configuration
VITE_LIFF_ID=2007806921-LYXebj6w

# Environment
VITE_NODE_ENV=production
```

## Local Development (.env files)

### Backend (server/.env)
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://suparoek:QNuvWwGlzjcRvA8Z@follow-the-money.ddzzmua.mongodb.net/?retryWrites=true&w=majority&appName=follow-the-money

# Client URL
CLIENT_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=dev-jwt-secret-key-12345

# LINE API Configuration
LINE_CHANNEL_ID=2007806921
LINE_CHANNEL_SECRET=5a153b0625c4f7657acf3e9d51cc1afd
LINE_CHANNEL_ACCESS_TOKEN=eNNEWQWBlrX7bnnsbL4n0SowkqUG+YlEHLLGJn+g2Au2icf8ke8sfqB67K6/Ba/rdMbD3QS/82vZKpbcy6BB536KjsGXWGSH38Qre+3nvy5w6/nfiEBE0WmsllZbNEt8CPN3gAdFW9hYSiVMAGdviQdB04t89/1O/w1cDnyilFU=

# LINE LIFF Configuration
LIFF_ID=2007806921-LYXebj6w
```

### Frontend (client/.env)
```
# API Configuration
VITE_API_URL=http://localhost:3000/api

# LINE LIFF Configuration
VITE_LIFF_ID=2007806921-LYXebj6w

# Environment
VITE_NODE_ENV=development
```

## Required Environment Variables

### LINE Developer Console Setup

1. **LINE Login Channel**
   - Channel ID: `2007806921`
   - Channel Secret: `5a153b0625c4f7657acf3e9d51cc1afd`
   - Callback URLs:
     - Development: `http://localhost:5173`
     - Production: `https://follow-the-money-v3-client.onrender.com`

2. **LINE LIFF App**
   - LIFF ID: `2007806921-LYXebj6w`
   - Endpoint URL:
     - Development: `http://localhost:5173`
     - Production: `https://follow-the-money-v3-client.onrender.com`
   - Size: Full (required for full-screen app)

### Deployment URLs

- **Frontend**: https://follow-the-money-v3-client.onrender.com/
- **Backend**: https://follow-the-money-v3-server.onrender.com/
- **Health Check**: https://follow-the-money-v3-server.onrender.com/health

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://follow-the-money-v3-client.onrender.com` (production)

### Security Headers

- Content Security Policy configured for LINE integration
- Helmet.js security middleware enabled
- CORS with credential support

## Testing

### Local Development
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

### Production
- Frontend: https://follow-the-money-v3-client.onrender.com/
- Backend: https://follow-the-money-v3-server.onrender.com/health

## LINE Integration Testing

1. **In Browser**: LIFF will open login popup
2. **In LINE App**: Direct integration with LINE client
3. **Development**: Debug info shown in development mode