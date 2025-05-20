import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    const [username, setUsername] = useState("username");
    const [editUsername, setEditUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(username);

    const [editPassword, setEditPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [cvFile, setCvFile] = useState(null);

    const handleUsernameChange = (e) => setNewUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    const handleSaveUsername = () => {
        setUsername(newUsername);
        setEditUsername(false);
        alert("Username changed!");
    };

    const handleSavePassword = () => {
        setEditPassword(false);
        setPassword("");
        setNewPassword("");
        alert("Password changed!");
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        alert("Account deleted!");
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleCvChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <div className="pt-6">
                <div className="flex flex-row items-center px-5">
                    <Link
                        to="/landing-page"
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 items-center text-xl"
                    >
                        &#8592; Back
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1 px-5">
                <div className="w-full max-w-xl relative mb-8">
                    <h2 className="text-3xl font-bold text-left mb-0 absolute -top-12">Settings</h2>
                    <div className="bg-white flex flex-col gap-10 items-stretch justify-center shadow-md p-8">
                        <div className="">
                            <label className="text-lg block font-semibold mb-1">CV</label>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-800 font-medium">
                                    {cvFile ? cvFile.name : "No CV uploaded"}
                                </span>
                                <label className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer ml-4">
                                    Browse
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleCvChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="text-lg block font-semibold">Username</label>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-800 font-medium">{username}</span>
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded ml-4"
                                    onClick={() => {
                                        setEditUsername(true);
                                        setNewUsername("");
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                            {editUsername && (
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        className="border rounded px-3 py-2 flex-1"
                                        value={newUsername}
                                        onChange={handleUsernameChange}
                                    />
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                        onClick={handleSaveUsername}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                                        onClick={() => { setEditUsername(false); setNewUsername(username); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Change Password</label>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-800 font-medium">********</span>
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded ml-4"
                                    onClick={() => setEditPassword(true)}
                                >
                                    Change
                                </button>
                            </div>
                            {editPassword && (
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="password"
                                        className="border rounded px-3 py-2 flex-1"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                    />
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                        onClick={handleSavePassword}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                                        onClick={() => { setEditPassword(false); setNewPassword(""); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end mt-5">
                            <button
                                className="px-5 py-2 bg-red-600 text-white rounded"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg p-9 flex flex-col items-center">
                        <p className="mb-6 text-lg font-semibold">Are you sure you want to delete your account?</p>
                        <div className="flex gap-4">
                            <button
                                className="px-10 py-2 bg-red-600 text-white rounded"
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="px-10 py-2 bg-gray-300 text-gray-800 rounded"
                                onClick={handleCancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
