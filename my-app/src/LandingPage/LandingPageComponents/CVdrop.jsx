import React, { useRef, useState, useEffect } from "react";

const CVdrop = () => {
  const [cvAdded, setCvAdded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetch("http://localhost:3000/user-profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cv_name) {
          setFileName(data.cv_name);
          setCvAdded(true);
        }
      });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      return;
    }
    setFileName(file.name);
    setCvAdded(false);
    setIsAnalyzing(true);
    analyzeCV(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      return;
    }
    setFileName(file.name);
    setError("");
    setCvAdded(false);
    setIsAnalyzing(true);
    analyzeCV(file);
    e.target.value = "";
  };

  const analyzeCV = async (file) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const uploadRes = await fetch("http://localhost:3000/upload-pdf", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const uploadData = await uploadRes.json();
      if (uploadData.error) {
        setError(uploadData.error);
        setIsAnalyzing(false);
        return;
      }

      setError("");
      setCvAdded(true);
    } catch (error) {
      setError("Server error!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`w-xs sm:w-xl h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition
          ${
            isAnalyzing
              ? "border-blue-500 bg-blue-50"
              : cvAdded
              ? "border-green-500 bg-green-50"
              : "border-red-300 bg-red-50"
          }
        `}
        onClick={() => dropRef.current.querySelector("input").click()}
      >
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {isAnalyzing ? (
        <span className="text-blue-600 px-4 text-center font-semibold break-all">
          Analyzing CV...
        </span>
      ) : cvAdded ? (
        <span className="text-green-600 px-4 text-center font-semibold break-all">
          CV added: {fileName}
        </span>
      ) : (
        <span className="text-black text-lg px-4 text-center">
          Drag & drop your CV here or click to upload (only PDF files)
        </span>
      )}
      </div>
      {error && (
        <div
          className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow font-poppins text-lg
          bg-red-50 text-red-700 border border-red-300
        `}
          style={{ minWidth: 300, maxWidth: 400, textAlign: "center" }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default CVdrop;