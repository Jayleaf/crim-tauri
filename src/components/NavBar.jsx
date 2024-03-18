import { appWindow } from '@tauri-apps/api/window'
export default () =>
<div data-tauri-drag-region class="flex flex-row w-full h-6 bg-red-950 bg-opacity-20">
        <div class="h-6 pl-4">
          <p class="text-xs font-sans font-thin text-stone-400 text-opacity-50">CRIM v0.1 indev</p>
        </div>
        <div class="ml-auto">
          <button
            class="outline-none font-sans w-6 h-6 p-2border-opacity-50 bg-opacity-10 bg-red-950 text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
            onClick={() => appWindow.minimize()}
          >-
          </button>
          <button
            class="outline-none font-sans w-6 h-6 p-2border-opacity-50 bg-opacity-10 bg-red-950 text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
            onClick={() => appWindow.toggleMaximize()}
          >□
          </button>
          <button
            class="outline-none font-sans w-6 h-6 p-2border-opacity-50 bg-opacity-10 bg-red-950 text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
            onClick={() => appWindow.close()}
          >x
          </button>


        </div>
      </div>