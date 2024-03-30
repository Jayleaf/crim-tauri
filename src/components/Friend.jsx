import { Fa } from 'solid-fa'
import { faMessage, faThumbtack, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'solid-js-modal';
import 'solid-js-modal/dist/style.css';
import { createSignal, Show } from 'solid-js';
import { Transition } from "solid-transition-group"
export default function Friend(props) {
    let modalRef;
    const { 0: isVisible, 1: setIsVisibleState } = createSignal(false);

    async function removeFriend(e, username) {
        e.preventDefault();
        setIsVisibleState(false); 
        modalRef.close();
        console.log(`${username} removed.`)
        console.log(isVisible())
    }

    return (
        <div>
            <div class = "w-full h-[64px] min-h-[64px] max-h-[64px] flex flex-row justify-center items-center">
                <div class="w-5/6 h-full flex bg-black bg-opacity-25 rounded-md flex-row justify-start items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-8 h-8 ml-5" />
                    <p class="pl-3 text-l font-sans font-thin text-stone-300 text-opacity-100">{props.name || "UNDEFINED"}</p>
                    <div class = "ml-auto pr-5 flex flex-row gap-x-3">
                        <button class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                            <Fa icon={faMessage} color="#D6D3D1" class="" translateX={-0.01} translateY={0.03} />
                        </button>
                        <button onClick={() => modalRef.showModal()} class="rounded-full w-8 h-8 bg-black bg-opacity-40 justify-center flex text-center items-center transition ease-in-out duration-200 hover:bg-opacity-30">
                            <Fa icon={faTrashCan} color="#D6D3D1" class="" translateX={-0.02} />
                        </button>
                    </div>
                </div>
            </div>
            <Transition
            enterActiveClass="transition ease-in-out duration-1000"
            exitActiveClass="transition ease-in-out duration-1000"
            enterClass="opacity-0"
            enterToClass="opacity-1"
            exitToClass="opacity-0"
            >
            <Show when = {isVisible}>
                <Modal ref={modalRef} shouldCloseOnBackgroundClick={true} class={`w-[32rem] h-48 rounded-md bg-black bg-opacity-40`}>
                    <div class="flex flex-col p-6 align-center items-start justify-top w-full h-full">
                        <p class="text-xl font-sans font-thin text-stone-300 text-opacity-100">Unfriend {props.name}?</p>
                        <p class="text-s pt-2 font-sans font-thin text-stone-400 text-opacity-100">If you unfriend this user, you will be removed from any conversations you are currently in with them.</p>
                            <div class="pt-4">
                                <button
                                type="button"
                                onClick={(e) => { removeFriend(e, props.name)}}
                                class="w-32 h-12 bg-red-400 bg-opacity-50 rounded-md text-stone-300 hover:bg-opacity-70 transition ease-in-out duration-200"
                                >
                                Confirm
                                </button>
                            </div>
                        </div>
                </Modal>
                </Show>
            </Transition>
        </div>
        
    )
}