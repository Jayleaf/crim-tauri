import { For, createEffect, createSignal, untrack, on, Show, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { toast, Toaster } from 'solid-toast';
import NavBar from "./components/NavBar";
import Fa from 'solid-fa'
import { faArrowRightFromBracket, faBell, faGear } from '@fortawesome/free-solid-svg-icons'
import Conversation from "./components/Conversation";
import FriendMgmt from "./components/FriendMgmt";
import Modal from "./components/Modal";
import { emit, listen } from '@tauri-apps/api/event'

await listen('infotoast', async (event) => {
  toast(event.payload, { icon: "📢" })
})

function Messenger(props) {
  const [username, setUsername] = createSignal("");
  const [friends, setFriends] = createSignal([{}]);
  const [conversations, setConversations] = createSignal([{}]);
  const [query, setQuery] = createSignal("");
  const [warnQuery, setWarnQuery] = createSignal("");
  const [activeConversation, setActiveConversation] = createSignal({}); // this is a convo obj
  const [modalConfirmed, setModalConfirmed] = createSignal(false);
  const [modalFocusAction, setModalFocusAction] = createSignal("");
  const [friendRequests, setFriendRequests] = createSignal([]);

  function rSetModalConfirmed(val)
  {
    setModalConfirmed(val)
    console.log(modalConfirmed())
    return;
  }

  onMount(() => {
    setModalConfirmed(false);
    setModalFocusAction("");
  })

  // stop this from infinitely recursing by listening to these props specifically
  
  createEffect(on(() => (props.data.username, props.data.friends, props.data.conversations), () => {
    // load up the user data
    const data = typeof props.data == "string" ? JSON.parse(props.data) : props.data;
    console.log(data)

    if(data) {
      setUsername(data.username);
      setFriends(data.friends);
      setFriendRequests(data.friend_requests);
      setConversations(data.conversations);
      if(activeConversation().id && data) {
        console.log("refreshing active conversation")
        console.log(activeConversation())
        untrack(() => setActiveConversation(conversations().find((conv) => conv.id === activeConversation().id)));
      }
    }
  }))

  createEffect(() => {
    console.log(`Effect`)
    if(modalConfirmed()){
      switch(modalFocusAction()) {
        case "logout":
          untrack(() => setModalConfirmed(false));
          setModalFocusAction("");
          invoke("logout_f").then(() => { window.eval("window.location.replace('index.html')") });
      }
    }
  });

  async function addFriend(e) {
    e.preventDefault();
    if (query() === "") {
      setWarnQuery("Please enter a name.")
      return;
    }
    await invoke("add_remove_friend", { action: "add", friend: query()})
    toast("Sending friend request to " + query() + "...", { icon: "✉️" })
    
  }

  const [show, setShow] = createSignal(false);
    async function click(name)
    {
        console.log(name)
        // set active conversation in parent
        if(name != activeConversation().id) setActiveConversation(conversations().find((conv) => conv.id === name));
        else setActiveConversation({});
        setShow(!show())
        console.log(activeConversation())
    }



  return (
    <div>
      <div class="flex flex-col h-[100vh] overflow-hidden">
        <NavBar />
        <Toaster
          toastOptions={{
            duration: 2000,
            position: "bottom-right",
            style: {
              background: 'rgb(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              top: 20,
            },

          }}

        />
        <div class="flex flex-row h-[100vh]">
        <Show when={modalFocusAction() != ""} fallback={<div/>}>
          <div class="">
            <Modal setModalConfirmed={rSetModalConfirmed} setModalFocusAction={setModalFocusAction} modalFocusAction={modalFocusAction}/>
          </div>
        </Show>
          <div class="w-[200px] max-w-[200px] min-w-[200px] bg-black bg-opacity-40 h-full">
            <div class="flex flex-col h-full">
              <div class="align-middle text-center justify-center pt-5 h-[50x]">
                <h1 class="text-4xl font-sans font-bold text-stone-300">CRIM</h1>
              </div>

              <div class="pt-2">
                <hr class="border-double border-2 border-white border-opacity-0"></hr>
              </div>
              <form class="flex flex-col items-center justify-center w-full h-8 select-none pt-5 pb-7" onSubmit={(e) => addFriend(e)}>
                <input
                  id="friend-query"
                  class={warnQuery() != "" ? "animate-pulse outline-none font-sans w-5/6 h-4 p-3 border-2 text-xs border-rose-500 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400" : "outline-none font-sans w-5/6 h-4 p-3 border-2 text-xs border-rose-950 border-opacity-0 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
                  onChange={(e) => { setQuery(e.currentTarget.value) }}
                  onInput={() => setWarnQuery("")}
                  placeholder={warnQuery() != "" ? warnQuery() : "Add a friend..."}
                />
              </form>
              <div class="">
                <hr class="border-double border-2 border-white border-opacity-5"></hr>
              </div>
              <div class="pl-3 flex items-center w-full h-[780px] max-h-[780px] min-h-[350px] object-center justify-center">
                <ul class="pt-5 w-full h-full text-center items-center scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll pr-3">

                  <For each={conversations()}>{(convo) => (
                    <li class="">
                      <button onClick={() => click(convo.id)} class={`flex flex-row w-full items-center bg-black ${activeConversation() == convo.id ? "bg-opacity-40" : "bg-opacity-25"} rounded-md h-12 mt-2 mb-2 pr-5 ${activeConversation() == convo.id ? "hover:bg-opacity-40" : "hover:bg-opacity-15"}`}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-6 h-6 ml-2" />
                          <p class="truncate text-xs pl-2 font-sans text-stone-300 text-center align-middle justify-center w-fit">{convo.users?.join(", ") || ""}</p>
                      </button>
                    </li>

                  )}</For>
                </ul>
              </div>
              <div class="flex flex-col w-full h-[125px] max-h-[125px] min-h-[125px] bg-black bg-opacity-25 border-black border-3 border-opacity-10 items-center">
                <div class="flex flex-col h-16 items-center pt-[2.5vh]">
                  <div class="flex flex-row justify-center gap-x-5 w-full h-12 items-center ">
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
                      <Fa icon={faGear} color="#D6D3D1" class="" translateX={0.5} />
                    </button>
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
                      <Fa icon={faBell} color="#D6D3D1" class="" translateX={0.55} />
                    </button>
                    <button onClick={() => setModalFocusAction("logout")} class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
                      <Fa icon={faArrowRightFromBracket} color="#D6D3D1" class="" translateX={0.55} />
                    </button>
                  </div>
                  <div class="flex flex-row pt-4">
                    <img img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-6 h-6"></img>
                    <h1 class="w-28 truncate pl-2 text-xs font-sans text-stone-300">{username()}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full h-screen bg-black bg-opacity-20">
            <div class="">
              
              {activeConversation().id? <Conversation target={activeConversation()} users={activeConversation().users?.join(', ')}/> : <FriendMgmt friends={friends()} username={username()} friendRequests={friendRequests()}/> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
