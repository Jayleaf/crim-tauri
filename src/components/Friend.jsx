import { Fa } from 'solid-fa'
import { faMessage, faThumbtack, faTrashCan } from '@fortawesome/free-solid-svg-icons'
export default function Friend(props) {


    return (
        <div class = "w-full h-[64px] min-h-[64px] max-h-[64px] flex flex-row justify-center items-center">
            <div class="w-5/6 h-full flex bg-black bg-opacity-25 rounded-md flex-row justify-start items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-8 h-8 ml-5" />
                <p class="pl-3 text-l font-sans font-thin text-stone-300 text-opacity-100">{props.name || "UNDEFINED"}</p>
                <div class = "ml-auto pr-5 flex flex-row gap-x-3">
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                        <Fa icon={faMessage} color="#D6D3D1" class="" translateX={-0.01} translateY={0.03} />
                    </button>
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                        <Fa icon={faTrashCan} color="#D6D3D1" class="" translateX={-0.02} />
                    </button>
                </div>
            </div>
        </div>
    )
}