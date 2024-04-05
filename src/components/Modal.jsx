import { Modal as cModal }from 'solid-js-modal';
import 'solid-js-modal/dist/style.css';
import { Transition } from "solid-transition-group"
import './modal.css'
import { onMount, onCleanup, createSignal } from "solid-js";
import {Motion, Presence} from "solid-motionone"
export default function Modal(props) {
    let ref;
    let modalLength = 0.2;
    let [triggerEnd, setTriggerEnd] = createSignal(false);

    const defaultModals = 
    [
        {
            "logout": {
                title: "Logout",
                subtext: "Are you sure you want to log out?"
            }
        }
    ]


    function confirmModal(e) {
        e.preventDefault();
        props.setModalConfirmed(true);
        console.log("confirming modal")
        e.stopPropagation();
        
    }

    async function cancelModal(e) {
        
        e.preventDefault();
        props.setModalConfirmed(false);
        console.log("cancelling modal")
        props.setModalFocusAction("");
        e.stopPropagation();

        
    }

    const handleClick = async (event) => {
        if(!ref.contains(event.target)) {
            try{
            setTriggerEnd(true);
            } catch(e) { console.log(e)}
            setTimeout(() => {
                cancelModal(event);
            }, (modalLength + 0.1) * 1000)
        }
      };

      onMount(() => {
        document.addEventListener('click', handleClick);
      });
      
      onCleanup(() => {
        document.removeEventListener('click', handleClick);
      });



    return (
        <div class="absolute bg-black bg-opacity-50 h-[96%] z-10 w-full flex items-center align-center justify-center">
            <Presence exitBeforeEnter>
                <Show when={!triggerEnd()}>
                <div ref={ref} class={`relative w-[32rem] h-48`}>
                    <Motion style={{"transform-origin": "bottom left"}}class="flex flex-col p-6 align-center items-start justify-top w-full  rounded-md h-full bg-black bg-opacity-40"
                    initial={{opacity: 0, scale: 0}}
                    animate={{opacity: 1, scale: [0, 1.02, 1]}}
                    exit={{opacity: 0, scale: 0}}
                    transition={{duration: modalLength, easing:"ease-in"}}>
                        <p class="text-xl font-sans font-thin text-stone-300 text-opacity-100">{defaultModals[0][props.modalFocusAction()].title || "UNDEFINED"}</p>
                        <p class="text-s pt-2 font-sans font-thin text-stone-400 text-opacity-100">{defaultModals[0][props.modalFocusAction()].subtext  || "UNDEFINED"}</p>
                            <div class="pt-12 w-72 flex flex-row gap-x-8">
                                <button
                                type="button"
                                onClick={(e) => { confirmModal(e)}}
                                class="w-32 h-12 bg-red-400 bg-opacity-50 rounded-md text-stone-300 hover:bg-opacity-70 transition ease-in-out duration-200"
                                >
                                Confirm
                                </button>
                            </div>
                        </Motion>
                    </div>
                </Show>
            </Presence>
        </div>
        
    )
}