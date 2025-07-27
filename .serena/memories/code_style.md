# Code Style & Conventions

## JavaScript Style (Both Frontend & Backend)

### Naming Conventions
- **Variables & Functions**: camelCase
  ```javascript
  const userName = 'john';
  const getUserProfile = () => {};
  ```
- **Constants**: UPPER_SNAKE_CASE
  ```javascript
  const MAX_FILE_SIZE = 5242880;
  const API_BASE_URL = 'http://localhost:3000';
  ```
- **Files**: kebab-case หรือ PascalCase สำหรับ components
  ```
  user-profile.js
  UserProfile.jsx
  ```

### MongoDB Models
- **Schema names**: PascalCase
  ```javascript
  const userSchema = new mongoose.Schema({...});
  const User = mongoose.model('User', userSchema);
  ```
- **Field names**: camelCase
  ```javascript
  {
    lineId: String,
    displayName: String,
    paymentMethods: [...]
  }
  ```

### API Design
- **Route structure**: REST conventions
  ```javascript
  POST /api/auth/line-login
  GET /api/auth/me
  PUT /api/auth/profile
  
  POST /api/groups/create
  GET /api/groups/my-groups
  POST /api/groups/:id/join
  ```
- **Response format**: Consistent JSON structure
  ```javascript
  // Success
  {
    success: true,
    message: 'Operation successful',
    data: {...}
  }
  
  // Error
  {
    error: 'Error message',
    details: '...'
  }
  ```

### Error Handling
- **Backend**: Try-catch with proper error messages
  ```javascript
  try {
    // operation
    res.json({ success: true, data });
  } catch (error) {
    console.error('Operation error:', error);
    res.status(500).json({ error: 'Failed to perform operation' });
  }
  ```

### Environment Variables
- Use UPPER_SNAKE_CASE
- Store sensitive data in .env files
- Provide .env.example templates

### Comments
- **Thai comments**: ใช้ภาษาไทยสำหรับ business logic
- **English comments**: ใช้ภาษาอังกฤษสำหรับ technical details
```javascript
// ตรวจสอบว่าผู้ใช้มีกลุ่มครบ 5 แล้วหรือไม่
if (user.groups.length >= 5) {
  return res.status(400).json({ error: 'Cannot join more groups' });
}

// MongoDB connection with retry logic
const connectDB = async () => {
  // ...
};
```

## React Conventions (Frontend)

### Component Structure
```jsx
// Functional components with hooks
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // fetch user data
  }, [userId]);
  
  return (
    <div className="user-profile">
      {/* JSX content */}
    </div>
  );
};

export default UserProfile;
```

### Tailwind CSS
- Use utility classes
- Group related styles
- Use responsive design classes
```jsx
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md">
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
    Button
  </button>
</div>
```

## Security Best Practices
- Hash passwords with bcryptjs
- Use JWT tokens for authentication
- Validate input data
- Use helmet for security headers
- Enable CORS only for trusted origins