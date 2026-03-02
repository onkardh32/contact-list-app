import { useState } from "react";

// indore lat lng - api only accepts indore addresses
const DEFAULT_LAT = 22.728373804784862;
const DEFAULT_LNG = 75.86924436059628;

function AddressForm({ existingAddress, onSave, onCancel, loading }) {
  const [address, setAddress] = useState(existingAddress?.address || "");

  function handleSubmit(e) {
    e.preventDefault();

    if (!address.trim()) return;

    // always send same lat lng because backend only accepts indore
    const payload = {
      address: address,
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
    };

    onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address here..."
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1">Only Indore, MP addresses are accepted</p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : existingAddress ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
