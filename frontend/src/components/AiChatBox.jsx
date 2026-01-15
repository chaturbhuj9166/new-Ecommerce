import React, { useState, useRef, useEffect } from "react";
import instance from "../axiosConfig.js";
import { FaPaperPlane, FaComments } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIChatBox = ({ productName = "our products" }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi! Ask anything about ${productName} 😊` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    try {
      setLoading(true);
      const res = await instance.post("/chat", { message: userMsg });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong 😐" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-xl z-50"
      >
        <FaComments size={22} />
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-2xl border p-4 h-[430px] flex flex-col z-50">
          <h2 className="text-base font-semibold text-teal-700 mb-2 text-center">
            Product Assistant 💬
          </h2>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] break-words whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-teal-600 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}

              {loading && (
                <p className="text-gray-500 text-xs italic">AI typing...</p>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Ask about ${productName}...`}
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              onClick={sendMessage}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBox; 