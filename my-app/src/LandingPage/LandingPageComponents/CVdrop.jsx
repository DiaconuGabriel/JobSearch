import React, { useRef, useState, useEffect } from "react";

const CVdrop = () => {
  const [cvAdded, setCvAdded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const dropRef = useRef(null);

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
    if (file) {
      setFileName(file.name);
      setCvAdded(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setError("");

      const formData = new FormData();
      formData.append("pdf", file);
      console.log("FormData:", formData);

      fetch("http://localhost:3000/upload-pdf", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError("Nu a putut fi citit fișierul!");
            setCvAdded(false);
          } else {
            console.log("Text extras din PDF:", data.text);
            setError("");
            setCvAdded(true);
          }
        })
        .catch(() => {
          setError("Nu a putut fi citit fișierul!");
          setCvAdded(false);
        });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`w-xs sm:w-xl h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition ${
          cvAdded ? "border-green-500 bg-green-50" : "border-red-300 bg-red-50"
        }`}
        onClick={() => dropRef.current.querySelector("input").click()}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        {cvAdded ? (
          <span className="text-green-600 px-4 text-center font-semibold break-all">
            CV added: {fileName}
          </span>
        ) : (
          <span className="text-black text-xl px-4 text-center">
            Drag & drop your CV here or click to upload
          </span>
        )}
      </div>
      {error && (
        <div className="mt-4 text-red-600 font-semibold">{error}</div>
      )}
    </div>
  );
};

export default CVdrop;