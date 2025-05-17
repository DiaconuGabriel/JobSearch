import React, { useRef, useState } from "react";

const CVdrop = () => {
  const [cvAdded, setCvAdded] = useState(false);
  const [fileName, setFileName] = useState("");
  const dropRef = useRef(null);

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
      setCvAdded(true);
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
          <span className="text-black sm:text-2xl lg:text-2xl px-4 text-center">
            Drag & drop your CV here or click to upload
          </span>
        )}
      </div>
    </div>
  );
};

export default CVdrop;