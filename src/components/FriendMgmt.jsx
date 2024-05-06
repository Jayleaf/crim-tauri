import { Fa } from 'solid-fa'
import { faPlus, faThumbtack, faWrench } from '@fortawesome/free-solid-svg-icons'
import { createSignal, For, Show } from 'solid-js'
import Friend from './Friend'
import FriendRequest from './FriendRequest'
import FriendConvoCheck from './FriendConvoCheck'
import {Motion, Presence} from "solid-motionone"
import { invoke } from "@tauri-apps/api/tauri";

export default function FriendMgmt(props) {
const [query, setQuery] = createSignal("");
const [showConvoDropdown, setShowConvoDropdown] = createSignal(false);
const [selectedPanel, setSelectedPanel] = createSignal("friends");
const [friendElements, setFriendElements] = createSignal([]);

function switchPanel(newpanel)
{
    setSelectedPanel(newpanel);
}

function newConversation(friends, e) {
    e.preventDefault();
    invoke("new_conversation_f", { names: friends })
}
    return (
        <div class = "w-full h-screen bg-black bg-opacity-5 flex flex-col justify-start items-center">
            <div class=" w-full min-h-[64px] max-h-[64px] h-[64px] bg-black bg-opacity-30 flex flex-col justify-center items-center shadow-2xl">
                <div class="w-full h-full flex flex-col justify-center items-center">
                    <div class="flex pr-4 py-1 flex-row justify-center text-center">
                        <div class="flex rounded-full w-8 h-8 bg-transparent justify-center text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                            <Fa icon={faWrench} color="#D6D3D1" class="" />
                        </div>
                        <p class="pl-2 pt-1 font-sans text-xl text-stone-400 text-opacity-100">Friend Management</p>
                    </div> 
                    <div class="flex flex-row h-full w-full">
                        <button class={`w-1/2 bg-black ${selectedPanel() == "friends" ? "bg-opacity-25" : "bg-opacity-5"} text-stone-300 font-sans text-xs`} onClick={() => switchPanel("friends")}>Friends</button>
                        <button class={`w-1/2 bg-black ${selectedPanel() == "friend-requests" ? "bg-opacity-25" : "bg-opacity-5"} text-stone-300 font-sans text-xs`} onClick={() => switchPanel("friend-requests")}>Friend Requests</button>
                    </div>
                </div>
            </div>
            
            <div class="relative flex object-center w-full h-[calc(100vh-151px)] justify-start items-start">
                <ul class = "absolute w-full h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll">
                    <Show when={selectedPanel() == "friends"}>
                        <Show when={props.friends.length == 0}>
                            <li class="pt-5"><p class="text-stone-400 text-opacity-100 text-center font-sans">No friends? How lonely.</p></li>
                        </Show>
                        <For each={props.friends}>{(friend) => (
                                <li class="py-2"><Friend name={friend}/></li>
                        )}</For>   
                    </Show>
                    <Show when={selectedPanel() == "friend-requests"}>
                        {console.log(props)}
                        <Show when={props.friendRequests.length == 0}>
                            <li class="pt-5"><p class="text-stone-400 text-opacity-100 text-center font-sans">You don't have any friend requests. Send some!</p></li>
                        </Show>
                        <For each={props.friendRequests}>{(req) => (
                                <li class="py-2"><FriendRequest username={props.username} req={req}/></li>
                        )}</For>
                    </Show>
                </ul>
            </div>
            <div class="w-full min-h-[64px] max-h-[64px] h-[64px] bg-black bg-opacity-30 flex flex-row justify-center items-center shadow-2xl">
                <form class="w-full p-3 h-full flex items-center justify-center ">
                    <input
                        id="search-query"
                        class={"outline-none font-sans w-5/6 h-5/6 border-2 p-1 pl-2 text-xs border-transparent border-opacity-0 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
                        onChange={(e) => { setQuery(e.currentTarget.value) }}
                        placeholder={"Search..."}
                    />
                    <div class="pl-5">
                        <Presence exitBeforeEnter>
                            <Show when={showConvoDropdown()}>
                                <Motion class="absolute w-[40%] h-[40%] right-10 lg:right-32 bottom-20 bg-black bg-opacity-40 rounded-md"
                                    initial={{opacity: 0, scale: 0.6}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.6}}
                                    transition={{duration: 0.2}}
                                >
                                    <p class="p-4 text-stone-300 text-opacity-100 font-sans text-s">Start a New Conversation</p>
                                    <div class="h-[65%]">
                                        <ul class="w-full h-full bg-black bg-opacity-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                                            <For each={props.friends}>{(friend) => (
                                                <li class="py-1 flex-1">
                                                    <FriendConvoCheck name={friend} setFriendElements={setFriendElements} friendElements={friendElements}/>
                                                 </li>
                                            )}</For> 
                                        </ul>
                                    </div>
                                    <button 
                                        style={{"border-radius": "0 0 0.375rem 0.375rem" }}
                                        class=" w-full h-7 bg-black bg-opacity-0 font-sans text-stone-300 hover:bg-opacity-70 transition ease-in-out duration-200"
                                        onClick={(e) => {
                                            newConversation(friendElements(), e)
                                        }}
                                        >
                                        Confirm
                                    </button>
                                </Motion>      
                            </Show>
                        </Presence>
                        <button onClick={(e) => { e.preventDefault(); showConvoDropdown() == true? setShowConvoDropdown(false) : setShowConvoDropdown(true)}}class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                            <Fa icon={faPlus} color="#D6D3D1" class="" translateX={0} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}