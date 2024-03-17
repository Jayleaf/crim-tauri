
export default function ConversationButtonSidebar(props) {
    return (
    <li class="flex flex-row w-full items-center bg-black  bg-opacity-10 rounded-md h-12 mt-2 mb-2 pr-5">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-6 h-6 ml-2"></img>
        <p class="truncate text-xs pl-2 font-sans text-stone-300 text-center align-middle justify-center w-fit">{props.name || "error"}</p>
    </li>
    )
}