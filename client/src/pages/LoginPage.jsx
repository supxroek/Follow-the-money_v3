import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import liffService from "../services/liffService";

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [liffStatus, setLiffStatus] = useState("initializing");

  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV != "development") {
      initializeLiff();
    }
  }, []);

  const initializeLiff = async () => {
    try {
      setLiffStatus("initializing");
      const success = await liffService.init();

      if (success) {
        setLiffStatus("ready");

        // ตรวจสอบว่า user login มาแล้วหรือยัง (redirect กลับมา)
        if (liffService.isLoggedIn()) {
          handleLineLogin();
        }
      } else {
        setLiffStatus("error");
        setError("ไม่สามารถเชื่อมต่อ LINE ได้");
      }
    } catch (error) {
      console.error("LIFF initialization error:", error);
      setLiffStatus("error");
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ LINE");
    }
  };

  // ฟังก์ชันสำหรับเข้าสู่ระบบด้วย LINE
  const handleLineLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      // ได้ access token จาก LIFF
      const accessToken = await liffService.login();

      if (!accessToken) {
        // จะ redirect ไป LINE login page
        return;
      }

      // ส่ง access token ไปที่ backend
      await login(accessToken);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับแสดงสถานะ LIFF
  const renderLiffStatus = () => {
    switch (liffStatus) {
      case "initializing":
        return (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>กำลังเชื่อมต่อ LINE...</span>
          </div>
        );
      case "error":
        return (
          <div className="text-red-600 text-center">
            <p className="mb-2">⚠️ ไม่สามารถเชื่อมต่อ LINE ได้</p>
            <button
              onClick={initializeLiff}
              className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        );
      case "ready":
        return (
          <div className="space-y-4">
            {/* Primary LINE Login Button */}
            <button
              onClick={handleLineLogin}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .629.285.629.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span>เข้าสู่ระบบด้วย LINE</span>
                </>
              )}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Follow the Money's
          </h2>
          <p className="text-gray-600">ระบบติดตามค่าใช้จ่ายแบบกลุ่ม</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              เข้าสู่ระบบ
            </h3>
            <p className="text-gray-600 text-sm">
              เข้าสู่ระบบด้วยบัญชี LINE ของคุณ
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* LIFF Status & Login Buttons */}
          {import.meta.env.VITE_NODE_ENV != "development" && (
            <div className="space-y-4">{renderLiffStatus()}</div>
          )}

          {/* Features Preview */}
          <div className="text-center space-y-4">
            <h4 className="text-md font-medium text-gray-900">ฟีเจอร์หลัก</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-green-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>แบ่งค่าใช้จ่ายอัตโนมัติ</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>จัดการหลายกลุ่ม</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-purple-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>แจ้งเตือนผ่าน LINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-orange-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>หักลบหนี้อัตโนมัติ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Info */}
        {import.meta.env.VITE_NODE_ENV === "development" && (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              ระบบอยู่ในช่วงพัฒนาและทดสอบเท่านั้น
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
