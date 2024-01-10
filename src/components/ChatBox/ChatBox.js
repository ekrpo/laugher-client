import { IoMdClose, IoIosSend } from "react-icons/io";
import "./chat_box.scss";
import { useEffect, useState, useRef } from "react";
import { authorizedPostRequest, authorizedGetRequest } from "../../utils/authorizedRequest.js";
import { dateTimeFormat } from "../../utils/dataFormats.js";

function ChatBox({ socket, closeChat, user }) {
  const id = window.localStorage.getItem("id");
  const [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  const conversationContainerRef = useRef(null);
  let [offset, setOffset] = useState(0);
  let [isLoading, setIsLoading] = useState(false)

  async function sendMessage() {
    if (message.trim().length === 0) {
      return;
    }

    const newMessage = {
      senderid: Number(id),
      message: message,
      time: new Date(),
    };

    setMessages([...messages, newMessage]);

    socket.emit("private-message", user.id, message);

    const payload = {
      senderId: id,
      receiverId: user.id,
      message: message,
    };

    await authorizedPostRequest(`/message/add`, payload, {});

    setMessage("");
    scrollToBottom();
  }

async function getMessages() {
  try {
    setIsLoading(true)
    const { data } = await authorizedGetRequest(`/message/all/${user.id}/${offset}`);
    if (data !== null && data.length > 0) {
      // Save the current scroll position before loading more messages
      const currentScrollTop = conversationContainerRef.current.scrollTop;

      // If there are no existing messages, just set the new messages
      if (messages.length === 0) {
        setMessages(data);
      } else {
        // If there are existing messages, concatenate the new messages to the existing ones
        setMessages((prevMessages) => [...data, ...prevMessages]);
      }

      // Update the offset
      setOffset((prevOffset) => prevOffset + 10);

      // Restore the scroll position after loading more messages
      const newHeight = conversationContainerRef.current.scrollHeight;
      const diff = newHeight - conversationContainerRef.current.offsetHeight;
      conversationContainerRef.current.scrollTop = currentScrollTop + diff;
    }
  } catch (error) {
    console.error(error);
  }
  finally{
    setIsLoading(false)
  }
}


  const lastMessageRef = useRef(null);

  useEffect(() => {
    if(messages.length === 10 ){
      scrollToBottom()
    }
    else if (lastMessageRef.current && messages.length > 10) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages]);

  function scrollToBottom() {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    let scrollableElement = conversationContainerRef.current;

    function handleScroll() {
      if (scrollableElement.scrollTop === 0) {
        // Save the current scroll position before loading more messages
        const currentScrollTop = scrollableElement.scrollTop;

        // Load more messages
        getMessages();

        // Restore the scroll position after loading more messages
        scrollableElement.scrollTop = currentScrollTop;
      }
    }

    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages]);

  socket.on("receive-message", (msgObject) => {
    setMessages([...messages, msgObject]);
    scrollToBottom();
  });

  return (
    <div id="chat-box">
      <div id="chat-header">
        <div onClick={() => window.location = `/user/${user.id}`}>
          <img src={process.env.PUBLIC_URL + '/default_profile.png'} alt="" />
          <h4>{user.username}</h4>
        </div>
        <IoMdClose onClick={closeChat} />
      </div>

      <div id="conversation-container" ref={conversationContainerRef}>
        {isLoading ? <img className="loading" src="loading.gif" alt=""/> : ""}
        {messages.map((msg, index) => (
          <div key={index} ref={index === offset ? lastMessageRef : null} className={msg.senderid === Number(id) ? "sender-message" : "sender-message received-message"}>
            <p>{msg.message}</p>
            <span id="message-time">{dateTimeFormat(msg.time)}</span>
          </div>
        ))}
      </div>

      <div id="conversation-form">
        <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
        <IoIosSend onClick={sendMessage} />
      </div>
    </div>
  );
}

export default ChatBox;
