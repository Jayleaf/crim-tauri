import { Fa } from 'solid-fa'
import { faThumbtack, faWrench } from '@fortawesome/free-solid-svg-icons'
import { createSignal, For } from 'solid-js'
import Friend from './Friend'

export default function FriendMgmt(props) {
const [query, setQuery] = createSignal("");

    return (
        <div class = "w-full h-screen bg-black bg-opacity-5 flex flex-col justify-start items-center">
            <div class="w-full min-h-[90px] max-h-[90px] h-[90px] bg-black bg-opacity-30 flex flex-col justify-center items-center shadow-2xl">
                <div class="w-full h-full flex flex-row justify-center items-center">
                    <div class="flex flex-row justify-center text-center pt-2">

                        <div class="flex rounded-full w-8 h-8 bg-transparent justify-center text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                            <Fa icon={faWrench} color="#D6D3D1" class="" />
                        </div>
                        <p class="pl-3 pt-1 font-sans text-xl text-stone-400 text-opacity-100">Friend Management</p>
                    </div> 
                </div>
                <form class="p-2 w-full h-full flex items-center justify-center ">
                    <input
                        id="search-query"
                        class={"outline-none font-sans w-5/6 h-5/6 border-2 p-1 pl-2 text-xs border-transparent border-opacity-0 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
                        onChange={(e) => { setQuery(e.currentTarget.value) }}
                        placeholder={"Search..."}
                    />
                </form>
            </div>
            <div class="relative flex object-center w-full h-[calc(100vh-117px)] pt-0.5 justify-start items-start">
                <ul class = "absolute w-full h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll">
                    <For each={props.friends}>{(friend) => (
                            <li class="py-2"><Friend name={friend}/></li>
                    )}</For>               
                </ul>
            </div>
        </div>
    )
}