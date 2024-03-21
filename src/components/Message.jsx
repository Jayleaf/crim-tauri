import { For, createSignal, onMount } from "solid-js";
export default function Message(props) {
    // javascript SUCKS
    const [formatteddatestring, setFormatteddatestring] = createSignal("");
    onMount(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    let date = new Date(parseInt(props.time));
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    let formattedTime = hours + ':' + minutes + ' ' + ampm;
    let formattedDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    setFormatteddatestring(formattedDate + " " + formattedTime);
})
    return (
        <li>
            <div class="w-full flex flex-row justify-start items-start p-3 ">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-9 h-9 ml-5" />
                <div class="flex flex-col justify-start items-start">
                    <div class="flex flex-row justify-center items-start">
                        <p class="pl-3 text-s font-sans font-thin text-stone-300 text-opacity-100">{props.username || "UNDEFINED"}</p>
                        <p class="pl-2 text-xxs font-sans font-thin text-stone-400 text-opacity-100">{formatteddatestring() || "UNDEFINED TIME"}</p>
                    </div>
                    <p class="pl-3  text-xs font-sans font-thin text-stone-400 text-opacity-100">{props.text || "ERROR: NO MESSAGE"}</p>
                </div>
            </div>
        </li>
    )
}