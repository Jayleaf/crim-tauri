import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import toast from 'solid-toast';
import NavBar from "./components/NavBar";
import ConversationButtonSidebar from "./components/ConversationButtonSidebar";
import Fa from 'solid-fa'
import { faArrowRightFromBracket, faBell, faFlag, faGear, faGears } from '@fortawesome/free-solid-svg-icons'

function Messenger() {


  return (
    <div>
      <div class="flex flex-col h-[100vh] overflow-hidden">
        <NavBar />
        <div class="flex flex-row h-[100vh]">
          <div class="w-[200px] max-w-[200px] min-w-[200px] bg-black bg-opacity-25 h-full">
            <div class="flex flex-col h-full">
              <div class="align-middle text-center justify-center pt-2 h-[50x]">
                <h1 class="text-4xl font-sans font-bold text-stone-300">CRIM</h1>
              </div>

              <div class="pt-2">
                <hr class="border-double border-2 border-white border-opacity-5"></hr>
              </div>

              <div class="pl-3 flex items-center w-full h-[835px] max-h-[835px] min-h-[400px] object-center justify-center">
                <ul class="pt-5 w-full h-full text-center items-center overflow-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-y-scroll">

                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                  <ConversationButtonSidebar />
                </ul>
              </div>
              <div class="flex flex-col w-full h-[125px] max-h-[125px] min-h-[125px] bg-black bg-opacity-25 border-black border-3 border-opacity-10 items-center">
                <div class="flex flex-col h-16 items-center pt-[2.5vh]">
                  <div class="flex flex-row justify-center gap-x-5 w-full h-12 items-center ">
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-10 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-25">
                      <Fa icon={faGear} color="#D6D3D1" class="" translateX={0.5} />
                    </button>
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-10 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-25">
                      <Fa icon={faBell} color="#D6D3D1" class="" translateX={0.55} />
                    </button>
                    <button class="rounded-full w-8 h-8 bg-black bg-opacity-10 justify-center text-center transition ease-in-out duration-200 hover:bg-opacity-25">
                      <Fa icon={faArrowRightFromBracket} color="#D6D3D1" class="" translateX={0.55} />
                    </button>
                  </div>
                  <div class="flex flex-row pt-2">
                    <img img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" class="w-6 h-6"></img>
                    <h1 class="w-28 truncate pl-2 pt-1 text-xs font-sans text-stone-300">user340dfgfddfgdfgg</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full bg-black bg-opacity-20 h-full">
            <div class="bg-slate-500">
              chat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
