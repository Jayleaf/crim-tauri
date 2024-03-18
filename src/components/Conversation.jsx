import { For, createSignal, onMount } from "solid-js";
import Fa from 'solid-fa'
import { faEnvelope, faMagnifyingGlass, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Message from "./Message";

export default function Conversation(props) {
    const [query, setQuery] = createSignal("");
    const [messages, setMessages] = createSignal([]);
    const loremipsums = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Est lorem ipsum dolor sit amet. Integer quis auctor elit sed vulputate mi sit. Fames ac turpis egestas integer eget aliquet nibh praesent. ",
        "At consectetur lorem donec massa sapien faucibus et molestie ac. Donec et odio pellentesque diam volutpat commodo. Vulputate enim nulla aliquet porttitor. Amet est placerat in egestas erat imperdiet sed euismod.",
        "Lobortis mattis aliquam faucibus purus in massa. Nisi est sit amet facilisis magna etiam. In fermentum posuere urna nec. Accumsan tortor posuere ac ut consequat semper. Luctus accumsan tortor posuere ac ut consequat semper viverra. Id cursus metus aliquam eleifend mi in nulla. Libero nunc consequat interdum varius sit. Sed pulvinar proin gravida hendrerit lectus. Ornare arcu odio ut sem nulla pharetra diam. Donec enim diam vulputate ut pharetra.",
        "Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Sed odio morbi quis commodo odio aenean. Nec ultrices dui sapien eget mi proin sed.",
        "Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas. Tristique senectus et netus et malesuada fames ac.",
        "Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Et tortor consequat id porta nibh venenatis cras sed. Habitasse platea dictumst vestibulum rhoncus est pellentesque.",
        "Eget mauris pharetra et ultrices neque ornare. Faucibus a pellentesque sit amet. Enim tortor at auctor urna nunc id cursus. Quis risus sed vulputate odio ut enim blandit volutpat. Nisl nunc mi ipsum faucibus vitae aliquet nec. Nibh sit amet commodo nulla facilisi nullam vehicula. ",
        "Tempus iaculis urna id volutpat lacus laoreet non curabitur. Diam sit amet nisl suscipit adipiscing bibendum est ultricies integer. Sagittis id consectetur purus ut faucibus pulvinar elementum integer enim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Justo eget magna fermentum iaculis eu non diam. Mattis molestie a iaculis at erat pellentesque adipiscing."
    ]
    onMount(async () => {
        // load the first 50 messages from the conversation
        for(let i = 0; i < 50; i++) {
            // messages need to be added to the start of the list so they're rendered right.
            setMessages([<Message text={loremipsums[Math.floor(Math.random() * loremipsums.length)]} />, ...messages()]);       
        }
    })
    return (
        <div class="w-full h-screen bg-black bg-opacity-5 flex flex-col justify-start items-center">
            <div class="w-full min-h-[56px] max-h-[56px] h-[56px] bg-black bg-opacity-30 flex flex-row justify-end items-center shadow-2xl">
                <div class="flex flex-row justify-center text-center pl-5">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-8 h-8"></img>
                    <p class="pl-3 pt-1 font-sans font-thin text-stone-400 text-opacity-100">johnnyappleseed</p>
                </div>
                <div class="ml-auto flex flex-row justify-end items-center">
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-30">
                        <Fa icon={faThumbtack} color="#D6D3D1" class="" translateX={0.61} />
                    </button>
                    <form class="pl-5 pr-3">
                        <input
                            id="search-query"
                            class={"outline-none font-sans w-48 h-5/6 border-2 p-1 pl-2 text-xs border-rose-950 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
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
                <div class="mb-[22px] flex flex-row items-center justify-start w-2/3 h-[40px] rounded-lg bg-black bg-opacity-25">
                    <Fa icon={faEnvelope} color="#D6D3D1" class="w-8 h-8"  translateX={0.61} />
                    <p class="pl-3 font-sans font-thin text-stone-400 text-opacity-100">Type a message...</p>
                </div>
            </div>
        </div>
    )
}