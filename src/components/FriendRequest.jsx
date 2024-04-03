import { Fa } from 'solid-fa'
import { faCheck, faCheckCircle, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import 'solid-js-modal/dist/style.css';
import { createSignal, Show } from 'solid-js';
import { Transition } from "solid-transition-group"
import { invoke } from "@tauri-apps/api/tauri";
export default function FriendRequest(props) {
    var title;
    var target; 
    var isSender = props.req.sender == props.username;

    function acceptRequest(username) {
        console.log(username)
    }

    function declineRequest(username) {
        invoke("decline_friend_request_f", { name: username })
    }

    if(isSender)
    {
        title = "Outgoing Friend Request"
        target = props.req.receiver
    }
    else
    {
        title = "Incoming Friend Request"
        target = props.req.sender
    }

    return (
        <div>
            <div class = "w-full h-[72px] min-h-[72px] max-h-[72px] flex flex-row justify-center items-center">
                <div class="w-5/6 h-full bg-black bg-opacity-25 rounded-md">
                    <div class="flex-col">
                    <p class="pl-3 text-xs font-sans font-thin text-stone-400 text-opacity-100">{title || "UNDEFINED"}</p>
                    <div class = "pt-1 flex flex-row items-end justify-end gap-x-1 pl-3 w-full">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-8 h-8" />
                        <p class="pl-2 pb-1 text-xs font-sans font-thin text-stone-400 text-opacity-100">{isSender? "to" : "from"}</p><p class="pb-1 text-l font-sans font-thin text-stone-300 text-opacity-100">{target || "UNDEFINED"}</p>
                        <div class = "pr-5 flex flex-row gap-x-3 ml-auto">
                            <Show when={!isSender}>
                                <button onClick={() => acceptRequest(target)} class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                                    <Fa icon={faCheck} color="#D6D3D1" class="" translateX={-0.01} translateY={0.03} />
                                </button>
                            </Show>
                            <button onClick={() => declineRequest(target)} class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                                <Fa icon={faXmark} color="#D6D3D1" class="" translateX={-0.02} />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
    )
}