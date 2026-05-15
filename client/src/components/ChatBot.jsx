import { useEffect } from "react";

export default function Chatbot() {

  useEffect(() => {

    if (!document.getElementById("chatbase-script")) {

      const script = document.createElement("script");

      script.src = "https://www.chatbase.co/embed.min.js";

      script.id = "chatbase-script";

      script.setAttribute(
        "chatbotId",
        "9R9qVgqmywcu_yQabFiBH"
      );

      script.domain = "www.chatbase.co";

      document.body.appendChild(script);
    }

  }, []);

  return null;
}