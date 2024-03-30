import { Modal as cModal }from 'solid-js-modal';
import 'solid-js-modal/dist/style.css';
import { Transition } from "solid-transition-group"
import './modal.css'
export default function Modal(props) {
    let modalRef;

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

    function cancelModal(e) {
        
        e.preventDefault();
        props.setModalConfirmed(false);
        props.setModalFocusAction("");
        e.stopPropagation();
        
    }


    return (
        <div class="absolute h-[90%] z-10 w-full flex items-center align-center justify-center">
            <Transition
            enterActiveClass="transition ease-in-out duration-1000"
            exitActiveClass="transition ease-in-out duration-1000"
            enterClass="opacity-0"
            enterToClass="opacity-1"
            exitToClass="opacity-0"
            >
                {console.log("breakpoint")}
                <cModal ref={modalRef} shouldCloseOnBackgroundClick={true} class={`relative w-[32rem] h-48 rounded-md bg-black bg-opacity-40`}>
                    <div class="flex flex-col p-6 align-center items-start justify-top w-full h-full">
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

                                <button
                                type="button"
                                onClick={(e) => { cancelModal(e)}}
                                class="w-32 h-12 bg-black bg-opacity-30 rounded-md text-stone-300 hover:bg-opacity-70 transition ease-in-out duration-200"
                                >
                                Cancel
                                </button>
                            </div>
                        </div>
                </cModal>
            </Transition>
        </div>
        
    )
}