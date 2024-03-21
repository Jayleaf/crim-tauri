import { createEffect, createSignal } from "solid-js";
import Fa from 'solid-fa'
import { faEnvelope, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Message from "./Message";
import { Store } from "tauri-plugin-store-api";
import { invoke } from "@tauri-apps/api/tauri";

const store = new Store(".data.tmp");

export default function Conversation(props) {
    const [query, setQuery] = createSignal("");
    const [messages, setMessages] = createSignal([]);
    const [charcount, setCharcount] = createSignal(0);
    const [currentMsg, setCurrentMsg] = createSignal("");


    createEffect(() => {
        console.log(props.target.id)
        // load the first 50 messages from the conversation
        console.log("loading messages...")
        if(props.target === "") {setMessages([]); return;}
            // find conversation by provided id
            store.get("userdata").then(data => {
                data = JSON.parse(data);
                let conversation = data.conversations.find((conv) => conv.id === props.target.id);
                for(let i = 0; i < 50; i++) {
                    let decoder = new TextDecoder("utf-8");
                    console.log(conversation)
                    if(conversation === undefined) {setMessages([]); break;}
                    if(conversation.messages.length == 0) {setMessages([]); break;}
                    let message = conversation.messages[i];
                    console.log(message)
                    if(message === undefined) {break;}
                    message.data = new Uint8Array(message.data);
                    console.log(message.data)
                    let text = JSON.parse(decoder.decode(message.data))
                    let date = text.time
                    console.log(text)
                    text = decoder.decode(new Uint8Array(text.message))
                    
                    console.log("Message: " + text)
                    // messages need to be added to the start of the list so they're rendered right.
                    setMessages([<Message text={text} username={message.sender} time={date}  />, ...messages()]);       
                }
                // get the username of the person we're sending a message to
        })
    })


    async function sendMessage(e)
    {
        e.preventDefault();
        if(currentMsg() === "") return;

        // these have to be their individual variables, because there's no simple way to `.clone();` like you can in rust.
        let message = currentMsg();
        let date = Date.now()
        await invoke("send_message_f", { message: message, time: date.toString(), target_convo_id: props.target.id});
        //setMessages([<Message text={message} username={username} time={date} />, ...messages()]);
        console.log(currentMsg() + " sent.")
        currentMsg("");
        e.target.reset();
    }

    return (
        <div class="w-full h-screen bg-black bg-opacity-5 flex flex-col justify-start items-center">
            <div class="w-full min-h-[56px] max-h-[56px] h-[56px] bg-black bg-opacity-30 flex flex-row justify-end items-center shadow-2xl">
                <div class="flex flex-row justify-center text-center pl-5">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-8 h-8"></img>
                    <p class="pl-3 pt-1 font-sans font-thin text-stone-400 text-opacity-100">{props.users || "ERROR"}</p>
                </div>
                <div class="ml-auto flex flex-row justify-end items-center">
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
                        <Fa icon={faThumbtack} color="#D6D3D1" class="" translateX={0.61} />
                    </button>
                    <form class="pl-5 pr-3">
                        <input
                            id="search-query"
                            class={"outline-none font-sans w-48 h-5/6 border-2 p-1 pl-2 text-xs border-rose-950 border-opacity-0 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
                            onChange={(e) => { setQuery(e.currentTarget.value) }}
                            placeholder={"Search..."}
                        />
                    </form>
                </div>
            </div>
            
            <div class="flex items-center w-full h-[100vh] max-h-[90vh] min-h-[72vh] object-center justify-center bg-black bg-opacity-5">
                <ul class="flex flex-col-reverse w-full h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll pr-3">
                    {messages()}
                </ul>
            </div>
            <div class="flex justify-center items-center w-full h-[80px] max-h-[80px] min-h-[80px] bg-black bg-opacity-25 ">
                <div class="mb-[22px] flex flex-row gap-x-3 items-center justify-start w-2/3 h-[40px] rounded-lg bg-black bg-opacity-25">
                    <Fa icon={faEnvelope} color="#D6D3D1" class="w-8 h-8"  translateX={0.61} />
                    <form class="w-[85%]" onSubmit={(e) => sendMessage(e)}>
                        <input maxlength="256" onInput={(e) => {setCurrentMsg(e.currentTarget.value); setCharcount(e.target.value.length)}} placeholder="Type a message..." class="outline-none w-[100%] font-sans font-thin text-stone-400 text-opacity-100 bg-transparent"/>
                    </form>
                </div>
                <div class="mb-[22px] ml-3 w-[64px]">
                    <p class="font-sans font-thin text-stone-400">{charcount() + "/256"}</p>
                </div>
            </div>
        </div>
    )
}