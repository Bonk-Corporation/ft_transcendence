import { useState, useEffect, useContext } from "preact/hooks";
import { Message } from "./Message";
import { language } from "../../scripts/languages";
import { createRef } from "preact";
import { ProfileContext, LangContext } from "../../Contexts";

function RoomButton({ withSeparator, children, activeRoom, ...rest }) {
  return (
    <>
      {withSeparator && <button class="inline">|</button>}
      <div class="m-1 inline">
        <button
          class={`${
            activeRoom == children
              ? "bg-gradient-to-br from-black/30 to-black/15"
              : "bg-gradient-to-br from-black/10 to-black/5"
          }
					m-1 p-1 rounded transition`}
          {...rest}
        >
          {children}
        </button>
      </div>
    </>
  );
}

let ws;

export function Chat() {
  const profile = useContext(ProfileContext);
  const lang = useContext(LangContext);

  if (!profile) return;

  const ref = createRef();

  const me = profile.name;
  const [hover, setHover] = useState(false);
  const [shouldShowChat, setShouldShowChat] = useState(false);
  const [activeRoom, setActiveRoom] = useState("Lobby");
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState({});

  function sendChat(e) {
    e.preventDefault();

    const input = e.target.querySelector("input");

    if (ws) {
      const users = [me, activeRoom].sort();
      let actualRoomName = "Lobby";
      if (activeRoom != actualRoomName)
        actualRoomName = `${users[0]}_${users[1]}`;
      if (input.value.trim() == "") return;

      ws.send(
        JSON.stringify({
          room: actualRoomName,
          content: input.value,
        }),
      );
      (messages[activeRoom] ??= []).push(["local", { content: input.value }]);
      setMessages({ ...messages });
      input.value = "";
    }
  }

  useEffect(() => {
    ref?.current?.scrollTo(0, 100000);
  }, [messages, hover]);

  useEffect(() => {
    const url =
      (location.protocol == "https:" ? "wss:" : "ws:") +
      "//" +
      location.host +
      "/chat";
    ws = new WebSocket(url);

    ws.onopen = () => setShouldShowChat(true);

    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      switch (message.type) {
        case "friends":
          setFriends(message.friends);
          break;
        case "message":
          (messages[message.room] ??= []).push(["distant", message]);
          setMessages(messages);
          break;
      }
    };
  }, []);

  const roomOpts = {
    activeRoom,
    onClick: (e) => setActiveRoom(e.target.textContent),
  };

  return (
    // Can't use hover: since it doesn't always trigger
    // in the same conditions as onmouseenter
    <div
      className={`
			fixed
			${
        hover
          ? "bottom-0 right-0 h-[300px] w-[300px] rounded"
          : "bottom-[-2rem] right-[-2rem] w-32 h-32 rounded-full backdrop-blur-lg"
      }
			bg-gradient-to-br from-white/20 to-white/5
			transition-all
		`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <>
          <div class="m-2 bg-gradient-to-br from-white/30 to-white/15 rounded h-[95%] backdrop-blur">
            <div class="overflow-x-scroll max-h-1/5 whitespace-nowrap">
              <RoomButton {...roomOpts}>Lobby</RoomButton>
              {friends.map((friend) => (
                <RoomButton withSeparator {...roomOpts}>
                  {friend}
                </RoomButton>
              ))}
            </div>
            <hr class="border-black/30" />
            <div
              ref={ref}
              class="flex flex-col h-[70%] w-full overflow-y-scroll mb-[4px]"
            >
              <div class="flex flex-col h-[90%]">
                {messages[activeRoom]?.map(([where, message]) => (
                  <Message where={where}>{message}</Message>
                ))}
              </div>
            </div>
            <form action="" onSubmit={sendChat}>
              <input
                placeholder={language.your_message[lang]}
                class="self-end w-full p-2 outline-none ml-0 relative b-[5px] rounded-b"
              />
            </form>
          </div>
        </>
      ) : (
        <div class="flex h-full items-center justify-center">
          <p>Chat</p>
        </div>
      )}
    </div>
  );
}
