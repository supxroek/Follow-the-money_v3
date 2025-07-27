import liff from '@line/liff';

class LiffService {
  constructor() {
    this.isInitialized = false;
    this.liffId = import.meta.env.VITE_LIFF_ID;
  }

  async init() {
    try {
      if (!this.liffId) {
        throw new Error('LIFF ID is not configured');
      }

      await liff.init({ liffId: this.liffId });
      this.isInitialized = true;
      console.log('✅ LIFF initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ LIFF initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  isLoggedIn() {
    if (!this.isInitialized) return false;
    return liff.isLoggedIn();
  }

  async login() {
    try {
      if (!this.isInitialized) {
        const initSuccess = await this.init();
        if (!initSuccess) {
          throw new Error('Failed to initialize LIFF');
        }
      }

      if (!liff.isLoggedIn()) {
        liff.login({
          redirectUri: window.location.href
        });
        return null; // จะ redirect ไปหน้า LINE Login
      }

      // ถ้า login แล้ว ให้ได้ access token
      const accessToken = liff.getAccessToken();
      return accessToken;
    } catch (error) {
      console.error('❌ LINE login failed:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      if (!this.isInitialized || !liff.isLoggedIn()) {
        throw new Error('LIFF not initialized or user not logged in');
      }

      const profile = await liff.getProfile();
      return profile;
    } catch (error) {
      console.error('❌ Failed to get LINE profile:', error);
      throw error;
    }
  }

  logout() {
    if (this.isInitialized && liff.isLoggedIn()) {
      liff.logout();
    }
  }

  // ตรวจสอบว่าอยู่ใน LINE app หรือไม่
  isInClient() {
    return this.isInitialized && liff.isInClient();
  }

  // เปิด LINE app (ถ้าอยู่ในเบราว์เซอร์)
  openWindow(url) {
    if (this.isInitialized) {
      liff.openWindow({ url });
    }
  }

  // ปิด LIFF app (ถ้าอยู่ใน LINE app)
  closeWindow() {
    if (this.isInitialized && this.isInClient()) {
      liff.closeWindow();
    }
  }

  // ส่งข้อความไปยัง LINE chat (ถ้าอยู่ใน LINE app)
  async sendMessages(messages) {
    try {
      if (this.isInitialized && this.isInClient()) {
        await liff.sendMessages(messages);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to send LINE messages:', error);
      return false;
    }
  }

  // แชร์ไปยัง LINE (ถ้าอยู่ใน LINE app)
  async shareTargetPicker(messages) {
    try {
      if (this.isInitialized && this.isInClient()) {
        await liff.shareTargetPicker(messages);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to share via LINE:', error);
      return false;
    }
  }
}

// Create singleton instance
const liffService = new LiffService();

export default liffService;