import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";

const ProfileView = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/#/profile/edit");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <Header user={user} logout={logout} />

      {/* Profile View */}
      <div className="flex justify-center mt-4 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            {user?.pictureUrl && (
              <img
                src={user.pictureUrl}
                alt={user.displayName}
                className="h-32 w-32 rounded-full shadow-lg border-4 border-blue-200 mb-4 object-cover"
              />
            )}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {user?.displayName}
            </h2>
            <span className="text-gray-400 text-base">LINE Profile</span>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                ข้อมูลพื้นฐาน
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อที่แสดง:</span>
                  <span className="text-gray-900 font-medium">
                    {user?.displayName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">อีเมล:</span>
                  <span className="text-gray-900 font-medium">
                    {user?.email || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เบอร์โทรศัพท์:</span>
                  <span className="text-gray-900 font-medium">
                    {user?.phoneNumber || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {user?.paymentMethods && user.paymentMethods.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  ช่องทางชำระเงิน
                </h3>
                <div className="space-y-3">
                  {user.paymentMethods.map((method, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 border">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-600">
                            {method.type === "promptpay" && "พร้อมเพย์"}
                            {method.type === "bank" && "บัญชีธนาคาร"}
                            {method.type === "qr_code" && "QR Code"}
                          </span>
                          <p className="text-gray-900 font-medium">
                            {method.value}
                          </p>
                          {method.bankName && (
                            <p className="text-sm text-gray-600">
                              {method.bankName}
                            </p>
                          )}
                          {method.accountName && (
                            <p className="text-sm text-gray-600">
                              {method.accountName}
                            </p>
                          )}
                        </div>
                        {method.type === "qr_code" && method.qrCodeUrl && (
                          <img
                            src={method.qrCodeUrl}
                            alt="QR Code"
                            className="h-16 w-16 object-contain rounded"
                          />
                        )}
                        {method.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            หลัก
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {user?.socialMedia && user.socialMedia.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Social Media
                </h3>
                <div className="space-y-2">
                  {user.socialMedia.map((social, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-xl p-3 border flex justify-between"
                    >
                      <span className="text-gray-600 capitalize">
                        {social.platform}:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {social.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups */}
            {user?.groups && user.groups.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  กลุ่ม
                </h3>
                <div className="space-y-2">
                  {user.groups.map((group, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 border">
                      <span className="text-gray-900 font-medium">
                        {group.groupName || group.name || `กลุ่ม ${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={handleEditProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow transition duration-150"
            >
              แก้ไขโปรไฟล์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
