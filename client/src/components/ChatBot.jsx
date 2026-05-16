import { useEffect } from 'react'

function ChatBot() {

  useEffect(() => {

    if (!window.chatbase || window.chatbase("getState") !== "initialized") {

      window.chatbase = (...arguments) => {
        if (!window.chatbase.q) {
          window.chatbase.q = []
        }

        window.chatbase.q.push(arguments)
      }

      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q
          }

          return (...args) => target(prop, ...args)
        },
      })
    }

    const script = document.createElement("script")

    script.src = "https://www.chatbase.co/embed.min.js"

    script.id = "9R9qVgqmywcu_yQabFiBH"

    script.domain = "www.chatbase.co"

    document.body.appendChild(script)

  }, [])

  return null
}

export default ChatBot