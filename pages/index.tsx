import Header from "@/components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

interface sendChat {
  e: any;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY ?? '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',
});

const openai = new OpenAIApi(configuration);

export default function Home() {
  let [userInput, setUserInput] = useState("");
  let [loading, setLoading] = useState(false);

  let [messages, setMessage] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (userInput.trim() != "") {
      setMessage((prevMessage) => [
        ...prevMessage,
        { content: userInput, role: "user" },
      ]);
      console.log(messages);
      const responseai = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userInput,
          },
        ],
        // messages: messages.map((message, index) => {
        //   return {
        //     role: message.role == 'user' ? 'user' : 'assistant',
        //     content: message.content
        //   }
        // })
      });

      setMessage((prevMessage) => [
        ...prevMessage,
        {
          content: responseai.data.choices[0].message.content,
          role: "assistant",
        },
      ]);
    }

    setUserInput("");
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-screen-md m-auto h-screen relative">
        <Header></Header>
        <div className="mx-3 mt-3 mb-3 w-full max-h-80 overflow-y-scroll">
          <div className="chat chat-start">
            <div className="chat-bubble">Welcome @billalxcode_. NortonAI is a simple chatbot based on OpenAI GPT-3 Turbo.</div>
          </div>
          {messages.map((message, index) => {
            if (message.role == "user") {
              return (
                <div className="chat chat-end">
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            } else if (message.role == "assistant") {
              return (
                <div className="chat chat-start">
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="fixed w-full max-w-screen-md bottom-0 flex flex-col flex-start pb-4 ">
          <form
            className="w-full flex flex-row items-center justify-center"
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                readOnly={loading}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                <FontAwesomeIcon
                  spin={loading}
                  icon={loading == true ? faSpinner : faPaperPlane}
                ></FontAwesomeIcon>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
