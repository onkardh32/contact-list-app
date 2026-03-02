import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
    const { login } = useAuth();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function handleSendOtp(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (phone.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phone }),
            });

            const data = await response.json();
            console.log("send otp response", data);

            if (response.ok) {
                setSuccessMsg("OTP sent successfully!");
                setStep(2);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            console.log("error in send otp", err);
            setError("Network error, please try again");
        }

        setLoading(false);
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phone, otp: otp }),
            });

            const data = await response.json();
            console.log("verify otp response", data);

            if (response.ok) {
                // get token from response and save it
                const token = data.token || data.data?.token;
                login(token, phone);
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            console.log("error in verify otp", err);
            setError("Network error, please try again");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Regime Premium
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    {step === 1
                        ? "Login to your account"
                        : `Enter OTP sent to ${phone}`}
                </p>

                {error && (
                    <p className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4">
                        {error}
                    </p>
                )}

                {successMsg && (
                    <p className="bg-green-100 text-green-600 text-sm px-3 py-2 rounded mb-4">
                        {successMsg}
                    </p>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                maxLength={10}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium disabled:opacity-50 mb-3"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setError("");
                                setSuccessMsg("");
                            }}
                            className="w-full text-gray-500 text-sm hover:text-gray-700"
                        >
                            Go back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
