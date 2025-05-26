import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [username, setUsername] = useState("");
    const [cvFileName, setCvFileName] = useState("");

    const [editUsername, setEditUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");

    const [editPassword, setEditPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    useEffect(() => {
        fetch("https://jobsearch-n4zw.onrender.com/user-profile", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsername(data.username || "");
                setCvFileName(data.cv_name || "");
            });
    }, []);

    const handleUsernameChange = (e) => setNewUsername(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    const handleSaveUsername = async () => {
        if (!newUsername.trim()) {
            setMessage("Username cannot be empty!");
            setMessageType("error");
            return;
        }
        try {
            const res = await fetch("https://jobsearch-n4zw.onrender.com/update-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ newUsername }),
            });
            const data = await res.json();
            if (data.success) {
                setUsername(newUsername);
                setEditUsername(false);
                setMessage("Username changed!");
                setMessageType("success");
            } else {
                setMessage(data.error || "Could not update username!");
                setMessageType("error");
            }
        } catch {
            setMessage("Server error!");
            setMessageType("error");
        }
    };

    const handleSavePassword = async () => {
        if (!newPassword.trim()) {
            setMessage("Password cannot be empty!");
            setMessageType("error");
            return;
        }
        try {
            const res = await fetch("https://jobsearch-n4zw.onrender.com/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ newPassword }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setEditPassword(false);
                setNewPassword("");
                setMessage("Password changed!");
                setMessageType("success");
            } else {
                setMessage(data.error || "Could not update password!");
                setMessageType("error");
            }
        } catch {
            setMessage("Server error!");
            setMessageType("error");
        }
    };

    const handleDeleteAccount = () => setShowDeleteModal(true);

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch("https://jobsearch-n4zw.onrender.com/delete-account", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            setShowDeleteModal(false);
            if (res.ok && data.success) {
                setMessage("Account deleted!");
                setMessageType("success");
                localStorage.removeItem("token");
                setTimeout(() => {
                    navigate("/register");
                }, 250);
            } else {
                setMessage(data.error || "Could not delete account!");
                setMessageType("error");
            }
        } catch {
            setShowDeleteModal(false);
            setMessage("Server error!");
            setMessageType("error");
        }
    };

    const handleCancelDelete = () => setShowDeleteModal(false);

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("pdf", file);

        setMessage("");
        setIsAnalyzing(true);

        fetch("https://jobsearch-n4zw.onrender.com/upload-pdf", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsAnalyzing(false);
                if (data.error) {
                    setMessage(data.error || "Could not upload CV!");
                    setMessageType("error");
                    return;
                }
                setCvFileName(data.fileName);
                setMessage("CV saved!");
                setMessageType("success");
            })
            .catch(() => {
                setIsAnalyzing(false);
                setMessage("Could not upload CV!");
                setMessageType("error");
            })
            .finally(() => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            });
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
            <div className="flex items-center justify-center flex-1 m-5">
                <div className="w-full max-w-xl relative mb-10">
                    <h2 className="text-3xl font-bold text-left mb-2">Settings</h2>
                    <div className="bg-white flex flex-col gap-10 items-stretch justify-center shadow-md p-8">
                        <div>
                            <label className="text-lg block font-semibold mb-1">CV (only .pdf)</label>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-800 font-medium">
                                    {isAnalyzing
                                        ? "Waiting for CV to upload..."
                                        : (cvFileName || "No CV uploaded")}
                                </span>
                                <label className="min-w-[90px] py-2 px-3 bg-blue-500 text-white rounded cursor-pointer ml-4 text-center flex items-center justify-center">
                                    Browse
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={handleCvChange}
                                        ref={fileInputRef}
                                        disabled={isAnalyzing}
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
                                    className="min-w-[90px] py-2 px-3 bg-blue-500 text-white rounded ml-4"
                                    onClick={() => {
                                        setEditUsername(true);
                                        setNewUsername("");
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                            {editUsername && (
                                <div className="flex flex-col mt-2 gap-2">
                                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                                        <input
                                            type="text"
                                            className="border rounded px-3 py-2 flex-1 min-w-[120px]"
                                            value={newUsername}
                                            onChange={handleUsernameChange}
                                        />
                                        <div className="flex flex-row gap-2 w-full sm:w-auto">
                                            <button
                                                className="w-full sm:w-auto px-3 py-2 bg-green-500 text-white rounded"
                                                onClick={handleSaveUsername}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="w-full sm:w-auto px-3 py-2 bg-gray-300 text-gray-800 rounded"
                                                onClick={() => { setEditUsername(false); setNewUsername(username); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Change Password</label>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-800 font-medium">********</span>
                                <button
                                    className="min-w-[90px] py-2 px-3 bg-blue-500 text-white rounded ml-4"
                                    onClick={() => setEditPassword(true)}
                                >
                                    Change
                                </button>
                            </div>
                            {editPassword && (
                                <div className="flex flex-col mt-2 gap-2">
                                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                                        <input
                                            type="password"
                                            className="border rounded px-3 py-2 flex-1"
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                        />
                                        <div className="flex flex-row gap-2 w-full sm:w-auto">
                                            <button
                                                className="w-full sm:w-auto px-3 py-2 bg-green-500 text-white rounded"
                                                onClick={handleSavePassword}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="w-full sm:w-auto px-3 py-2 bg-gray-300 text-gray-800 rounded"
                                                onClick={() => { setEditPassword(false); setNewPassword(""); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
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
            {message && (
                <div
                    className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow font-poppins text-lg
                    ${messageType === "success" ? "bg-green-50 text-green-700 border border-green-300" : "bg-red-50 text-red-700 border border-red-300"}
                    `}
                    style={{ minWidth: 300, maxWidth: 400, textAlign: "center" }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
