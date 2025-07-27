import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, isLoading, error } = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Simulate LINE Login (ในการใช้งานจริงจะใช้ LINE SDK)
  const handleLineLogin = async () => {
    setIsLoginLoading(true);

    try {
      // สำหรับการทดสอบ - จะต้องใช้ LINE SDK ในการใช้งานจริง
      const result = await login("test-access-token");

      if (!result.success) {
        alert(`เข้าสู่ระบบไม่สำเร็จ: ${result.error}`);
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Simulate LINE LIFF Login
  const handleLiffLogin = () => {
    // ในการใช้งานจริงจะใช้ liff.login()
    alert("กำลังเปิด LINE Login... (ต้องใช้ LIFF SDK ในการใช้งานจริง)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo และ Title */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Follow the Money's
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ระบบติดตามค่าใช้จ่ายแบบกลุ่ม
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Login Options */}
          <div className="mt-8 space-y-4">
            {/* LINE Login Button */}
            <button
              onClick={handleLineLogin}
              disabled={isLoading || isLoginLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {/* <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading || isLoginLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                )}
              </span> */}
              {isLoading || isLoginLoading
                ? "กำลังเข้าสู่ระบบ..."
                : "เข้าสู่ระบบด้วย LINE"}
            </button>

            {/* LIFF Login Button (สำหรับการใช้งานใน LINE) */}
            <button
              onClick={handleLiffLogin}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </span>
              เปิดใน LINE App
            </button>
          </div>

          {/* Features */}
          <div className="mt-8">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">ฟีเจอร์หลัก</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
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
                แบ่งค่าใช้จ่ายอัตโนมัติ
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
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
                จัดการหลายกลุ่ม
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
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
                แจ้งเตือนผ่าน LINE
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
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
                หักลบหนี้อัตโนมัติ
              </div>
            </div>
          </div>

          {/* Development Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              สำหรับการทดสอบ - ต้องใช้ LINE SDK ในการใช้งานจริง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
