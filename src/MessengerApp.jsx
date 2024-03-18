import { For, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { toast, Toaster } from 'solid-toast';
import NavBar from "./components/NavBar";
import Conversation from "./components/Conversation";
import Message from "./components/Message";
import ConversationButtonSidebar from "./components/ConversationButtonSidebar";
import Fa from 'solid-fa'
import { faArrowRightFromBracket, faBell, faGear, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { Store } from "tauri-plugin-store-api";

function Messenger() {
  const [username, setUsername] = createSignal("");
  const [friends, setFriends] = createSignal([{}]);
  const [conversations, setConversations] = createSignal([{}]);
  const [query, setQuery] = createSignal("");
  const [warnQuery, setWarnQuery] = createSignal("");
  const [activeConversation, setActiveConversation] = createSignal(""); // this is a conversation ID
  const store = new Store(".data.tmp");
  onMount(async () => {
    // load up the user data
    let sid = await store.get("sid");
    if (sid === null) {
      window.eval("window.location.replace('index.html')");
      toast.error("Invalid session.")
    }
    let res = await invoke("get_f", { sid: sid });
    switch (res) {
      case 200:
        setUsername(JSON.parse(await store.get("userdata")).username);
        setFriends(JSON.parse(await store.get("userdata")).friends);
        setConversations(JSON.parse(await store.get("userdata")).conversations);
        break;
      case 401:
        toast.error("Invalid session.")
        window.eval("window.location.replace('index.html')");
        break;
      case 500:
        toast.error("Server error.")
        break;
    }
  })

  async function logout() {
    await store.clear();
    window.eval("window.location.replace('index.html')");
  }

  async function addFriend(e) {
    e.preventDefault();
    if (query() === "") {
      setWarnQuery("Please enter a name.")
      return;
    }
    let res = await invoke("add_friend_f", { target: query() });
    switch (res) {
      case 200:
        toast.success(`Successfully added ${query()} as a friend! 🎉`)
        setFriends(JSON.parse(JSON.stringify(await store.get("userdata"))).friends);
        console.log(await store.get("userdata"))
        break;
      case 401:
        toast.error("Invalid session. Try relogging.")
        break;
      case 404:
        toast.error("User not found.")
        break;
      case 403:
        // yet to be implemented
        toast.error("User has blocked you.")
        break;
      case 400:
        toast.error("You are already friends with this user.")
        break;
      case 500:
        toast.error("Server error.")
        break;
    }
  }


  return (
    <div>
      <div class="flex flex-col h-[100vh] overflow-hidden">
        <NavBar />
        <Toaster
          toastOptions={{
            duration: 2000,
            position: "top-center",
            style: {
              background: 'rgb(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              top: 20,
            },

          }}

        />
        <div class="flex flex-row h-[100vh]">
          <div class="w-[200px] max-w-[200px] min-w-[200px] bg-black bg-opacity-40 h-full">
            <div class="flex flex-col h-full">
              <div class="align-middle text-center justify-center pt-4 h-[50x]">
                <h1 class="text-4xl font-sans font-bold text-stone-300">CRIM</h1>
              </div>

              <div class="pt-4">
                <hr class="border-double border-2 border-white border-opacity-5"></hr>
              </div>
              <form class="flex flex-col items-center justify-center w-full h-8 select-none pt-5 pb-5" onSubmit={(e) => addFriend(e)}>
                <input
                  id="friend-query"
                  class={warnQuery() != "" ? "animate-pulse outline-none font-sans w-5/6 h-4 p-3 border-2 text-xs border-rose-500 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400" : "outline-none font-sans w-5/6 h-4 p-3 border-2 text-xs border-rose-950 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
                  onChange={(e) => { setQuery(e.currentTarget.value) }}
                  onInput={() => setWarnQuery("")}
                  placeholder={warnQuery() != "" ? warnQuery() : "Add a friend..."}
                />
              </form>
              <div class="">
                <hr class="border-double border-2 border-white border-opacity-5"></hr>
              </div>
              <div class="pl-3 flex items-center w-full h-[780px] max-h-[780px] min-h-[370px] object-center justify-center">
                <ul class="pt-5 w-full h-full text-center items-center scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll pr-3">

                  <For each={friends()}>{(friend) => (
                    <ConversationButtonSidebar name={friend} />
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
                    <button onClick={() => logout()} class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
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

          <div class="w-full bg-black bg-opacity-20 h-full">
            <div class="block">
              <Conversation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
