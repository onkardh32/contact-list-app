import { useState } from "react";
import AddressForm from "./AddressForm";

function AddressCard({ address, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  async function handleUpdate(payload) {
    setUpdateLoading(true);
    await onUpdate(address._id, payload);
    setUpdateLoading(false);
    setIsEditing(false);
  }

  function handleDelete() {
    const confirm = window.confirm("Are you sure you want to delete this address?");
    if (confirm) {
      onDelete(address._id);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {isEditing ? (
        // show edit form
        <AddressForm
          existingAddress={address}
          onSave={handleUpdate}
          onCancel={() => setIsEditing(false)}
          loading={updateLoading}
        />
      ) : (
        // show address text with edit and delete buttons
        <div className="flex justify-between items-start gap-3">
          <p className="text-sm text-gray-700 leading-relaxed">{address.address}</p>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressCard;
