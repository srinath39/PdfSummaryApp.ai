import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/upload-pdf`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data.pdfSummary);
    } catch (err) {
      setError("Something went wrong while processing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 flex items-center justify-center p-6">

      <div className="w-full max-w-7xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white/70 rounded-2xl p-6 shadow-md border border-blue-100">
          <h1 className="text-3xl font-bold text-sky-700 mb-6 flex items-center gap-2">
            ☁️ PdfSummary.ai
          </h1>

          <label className="group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-sky-300 rounded-xl p-8 transition hover:bg-sky-50">
            <span className="text-sky-700 font-semibold text-lg">
              Click to upload PDF
            </span>
            <span className="text-sm text-gray-500 mt-1">
              Max file size 5MB
            </span>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <p className="mt-4 text-sm text-gray-700">
              📄 <span className="font-medium">{file.name}</span>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
              ${
                loading
                  ? "bg-sky-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:scale-[1.02] hover:shadow-xl"
              }`}
          >
            {loading ? "Processing PDF..." : "Upload & Extract"}
          </button>

          {error && (
            <p className="mt-4 text-red-500 font-medium">{error}</p>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/70 rounded-2xl p-6 shadow-md border border-blue-100 flex flex-col">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            📘 Summary 
          </h2>

          <div className="flex-1 overflow-y-auto bg-white/80 border rounded-xl p-4">
            {result ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-sky-700 mt-4 mb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-cyan-700 mt-4 mb-2">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-6 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  code: ({ children }) => (
                    <code className="bg-sky-100 text-sky-700 px-1 rounded">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-900 text-sky-300 p-4 rounded-lg overflow-x-auto text-sm my-3">
                      {children}
                    </pre>
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic text-center mt-20">
                Your PDF summary content will appear here 
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
