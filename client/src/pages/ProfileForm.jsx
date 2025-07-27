import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";

const ProfileForm = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    socialMedia: user?.socialMedia || [{ platform: "", username: "" }],
    bankAccountName: "",
    bankName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // โหลดข้อมูล payment methods ที่มีอยู่แล้วเข้าใน form
  useEffect(() => {
    if (user && user.paymentMethods) {
      setForm((currentForm) => {
        const newForm = { ...currentForm };

        user.paymentMethods.forEach((method) => {
          if (method.type === "promptpay") {
            newForm.promptpay = method.value;
          } else if (method.type === "bank") {
            newForm.bankAccount = method.value;
            newForm.bankAccountName = method.accountName || "";
            newForm.bankName = method.bankName || "";
          } else if (method.type === "qr_code") {
            newForm.qrCode = method.qrCodeUrl;
          }
        });

        return newForm;
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (idx, field, value) => {
    const updated = [...form.socialMedia];
    updated[idx][field] = value;
    setForm((prev) => ({ ...prev, socialMedia: updated }));
  };

  const addSocial = () => {
    setForm((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", username: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Debug: ดูข้อมูลที่จะส่ง
      console.log("Form data to be sent:", form);

      // ใช้ updateProfile function จาก AuthContext
      const result = await updateProfile(form);

      if (result.success) {
        setSuccess("บันทึกข้อมูลสำเร็จ!");
        // กลับไปหน้า ProfileView หลังจากบันทึกสำเร็จ
        setTimeout(() => {
          //   navigate("/profile");
          window.location.href = "/#/profile";
        }, 1500);
      } else {
        setError(result.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <Header user={user} logout={logout} />

      {/* Profile Details */}
      <div className="flex justify-center mt-4 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 relative">
            {/* Back Button */}
            <button
              //   onClick={() => navigate("/profile")}
              onClick={() => (window.location.href = "/#/profile")}
              className="absolute left-0 top-0 text-gray-600 hover:text-gray-800 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {user?.pictureUrl && (
              <img
                src={user.pictureUrl}
                alt={form.displayName}
                className="h-24 w-24 rounded-full shadow-lg border-4 border-blue-200 mb-3 object-cover"
              />
            )}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {form.displayName || user?.displayName}
            </h2>
            <span className="text-gray-400 text-base">Edit Profile</span>
          </div>

          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-h-[80vh] overflow-y-auto px-1"
          >
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
              />
            </div>
            {/* ช่องทางชำระเงิน */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                ช่องทางชำระเงิน
              </label>
              <div className="space-y-3">
                {/* เลือกช่องทาง */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl border font-medium transition ${
                      form.promptpay !== undefined
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      setForm((prev) => {
                        if (prev.promptpay !== undefined) {
                          return Object.fromEntries(
                            Object.entries(prev).filter(
                              ([key]) => key !== "promptpay"
                            )
                          );
                        } else {
                          return { ...prev, promptpay: "" };
                        }
                      })
                    }
                  >
                    พร้อมเพย์
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl border font-medium transition ${
                      form.bankAccount !== undefined
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      setForm((prev) => {
                        if (prev.bankAccount !== undefined) {
                          const rest = Object.fromEntries(
                            Object.entries(prev).filter(
                              ([key]) => key !== "bankAccount"
                            )
                          );
                          return rest;
                        } else {
                          return { ...prev, bankAccount: "" };
                        }
                      })
                    }
                  >
                    บัญชีธนาคาร
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl border font-medium transition ${
                      form.qrCode !== undefined
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      setForm((prev) => {
                        if (prev.qrCode !== undefined) {
                          return Object.fromEntries(
                            Object.entries(prev).filter(
                              ([key]) => key !== "qrCode"
                            )
                          );
                        } else {
                          return { ...prev, qrCode: "" };
                        }
                      })
                    }
                  >
                    QR Code
                  </button>
                </div>

                {/* พร้อมเพย์ */}
                {form.promptpay !== undefined && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="promptpay"
                      value={form.promptpay}
                      onChange={handleChange}
                      placeholder="หมายเลขพร้อมเพย์"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
                    />
                  </div>
                )}

                {/* บัญชีธนาคาร */}
                {form.bankAccount !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="bankAccount"
                        value={form.bankAccount}
                        onChange={handleChange}
                        placeholder="เลขบัญชี"
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="bankAccountName"
                        value={form.bankAccountName || ""}
                        onChange={handleChange}
                        placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="bankName"
                        value={form.bankName || ""}
                        onChange={handleChange}
                        placeholder="ชื่อธนาคาร"
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg transition"
                      />
                    </div>
                  </div>
                )}

                {/* QR Code */}
                {form.qrCode !== undefined && (
                  <div>
                    <div className="flex items-center px-4 gap-2">
                      <label className="block mb-1 text-gray-700">
                        QR Code (อัปโหลดรูป)
                      </label>
                    </div>
                    <input
                      type="file"
                      name="qrCode"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm((prev) => ({
                              ...prev,
                              qrCode: reader.result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-base transition"
                    />

                    {form.qrCode && (
                      <img
                        src={form.qrCode}
                        alt="QR Code"
                        className="mt-2 h-32 w-32 object-contain border rounded"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Social Media
              </label>
              <div className="space-y-3">
                {form.socialMedia.map((sm, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row gap-3 items-center flex-wrap sm:flex-nowrap sm:gap-3"
                  >
                    <select
                      value={sm.platform}
                      onChange={(e) =>
                        handleSocialChange(idx, "platform", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-base transition flex-shrink-0 w-full sm:w-40"
                    >
                      <option value="">เลือกแพลตฟอร์ม</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Username"
                      value={sm.username}
                      onChange={(e) =>
                        handleSocialChange(idx, "username", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-base transition flex-1 w-full"
                    />
                    {form.socialMedia.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            socialMedia: prev.socialMedia.filter(
                              (_, i) => i !== idx
                            ),
                          }));
                        }}
                        className="text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded transition"
                        title="ลบ Social Media"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSocial}
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 transition"
              >
                + เพิ่ม Social Media
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-center font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-center font-medium">
                {success}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                // onClick={() => navigate("/profile")}
                onClick={() => (window.location.href = "/#/profile")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-bold text-lg shadow transition duration-150"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow transition duration-150"
                disabled={loading}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
