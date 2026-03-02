import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Addresses() {
    const { token, phone, logout } = useAuth();

    const [addresses, satAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [addLoading, setAddLoading] = useState(false);

    // get all addresses when page loads
    useEffect(() => {
        fetchAddresses();
    }, []);

    async function fetchAddresses() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/api/address/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("addresses data", data);

            if (response.ok) {
                setAddresses(data.data || data.addresses || data || []);
            } else {
                setError(data.message || "Failed to load addresses");
            }
        } catch (err) {
            console.log("error fetching addresses", err);
            setError("Something went wrong");
        }

        setLoading(false);
    }

    // add new address
    async function handleAddAddress(payload) {
        setAddLoading(true);
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/api/address/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("add address response", data);

            if (response.ok) {
                setShowForm(false);
                fetchAddresses();
            } else {
                setError(data.message || "Failed to add address");
            }
        } catch (err) {
            console.log("error adding address", err);
            setError("Something went wrong");
        }

        setAddLoading(false);
    }

    // update existing address
    async function handleUpdateAddress(addressId, payload) {
        setError("");

        try {
            const response = await fetch(
                `${BASE_URL}/api/address/${addressId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            const data = await response.json();

            if (response.ok) {
                fetchAddresses();
            } else {
                setError(data.message || "Failed to update address");
            }
        } catch (err) {
            console.log("error updating address", err);
            setError("Something went wrong");
        }
    }

    // delete address
    async function handleDeleteAddress(addressId) {
        setError("");

        try {
            const response = await fetch(
                `${BASE_URL}/api/address/${addressId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (response.ok) {
                fetchAddresses();
            } else {
                setError(data.message || "Failed to delete address");
            }
        } catch (err) {
            console.log("error deleting address", err);
            setError("Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* navbar */}
            <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">
                        Regime Premium
                    </h1>
                    <p className="text-xs text-gray-500">+91 {phone}</p>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        My Addresses
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                    >
                        {showForm ? "Cancel" : "+ Add Address"}
                    </button>
                </div>

                {/* error message */}
                {error && (
                    <p className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4">
                        {error}
                    </p>
                )}

                {/* add address form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Add New Address
                        </h3>
                        <AddressForm
                            onSave={handleAddAddress}
                            onCancel={() => setShowForm(false)}
                            loading={addLoading}
                        />
                    </div>
                )}

                {/* loading state */}
                {loading && (
                    <p className="text-center text-gray-500 text-sm py-8">
                        Loading addresses...
                    </p>
                )}

                {/* empty state */}
                {!loading && addresses.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">
                        No addresses added yet
                    </p>
                )}

                {/* address list */}
                {!loading && addresses.length > 0 && (
                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <AddressCard
                                key={addr._id}
                                address={addr}
                                onUpdate={handleUpdateAddress}
                                onDelete={handleDeleteAddress}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Addresses;
