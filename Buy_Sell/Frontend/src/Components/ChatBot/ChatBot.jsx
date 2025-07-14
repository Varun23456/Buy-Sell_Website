import { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; 

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await axios.get("http://localhost:4000/api/validate", {
          withCredentials: true,
        });
        if (response.status == 201) {
          let UserInfo = response.data.user
          navigate("/ChatBot");
        }
        else {
          navigate("/")
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getreplyfrombot = async () => {
    if (input.trim() === "") return;
    console.log("hi")
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    const tempmessages = [...messages, userMessage]
    console.log(tempmessages)
    try {
      const response = await axios.post("http://localhost:4000/api/chatbot", { message: input,history: tempmessages },
        { withCredentials: true }
      );

      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response." },
      ]);
    }

    setInput("");
  };


  return (
    <>
      <NavBar />
      <div className="mt-10 flex flex-col bg-gray-50 p-4 mx-auto shadow-lg rounded-lg h-screen">
        <div
          className="flex-1 overflow-y-auto p-3 space-y-3"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 max-w-[75%] text-sm rounded-lg shadow-md ${msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                  }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 flex items-center bg-white border-t">
          <textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="h-10 w-full border p-2 rounded-lg focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getreplyfrombot();
              }
            }}
          />

          <button
            onClick={() => {
              getreplyfrombot();
            }}
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
