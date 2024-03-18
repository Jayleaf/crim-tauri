import { For, createSignal, onMount } from "solid-js";
import Fa from 'solid-fa'
import { faMagnifyingGlass, faThumbtack } from '@fortawesome/free-solid-svg-icons'

export default function Message(props) {
    return (
        <li>
            <div class="w-full flex flex-row justify-start items-start p-3 ">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-9 h-9 ml-5"></img>
                <div class="flex flex-col justify-center items-start">
                    <div class="flex flex-row justify-center items-start">
                        <p class="pl-3 text-s font-sans font-thin text-stone-300 text-opacity-100">johnnyappleseed</p>
                        <p class="pl-2 text-xxs font-sans font-thin text-stone-400 text-opacity-100">March 17, 2024 @ 1:35PM</p>
                    </div>
                    <p class="pl-3 text-xs font-sans font-thin text-stone-400 text-opacity-100">{props.text || "ERROR: NO MESSAGE"}</p>
                </div>
            </div>
        </li>
    )
}