import { appWindow } from '@tauri-apps/api/window'
export default () =>
<div>
<div class="w-full h-1 bg-black bg-opacity-70"/> {/* Without this, you wouldn't be able to resize the window from the top, because tauri's drag region is busted */}
  <div data-tauri-drag-region class="h-5 w-full">
    <div data-tauri-drag-region class="flex flex-row justify-end items-end w-full h-full bg-black bg-opacity-70">
          <div class="h-6 pl-4 pt-0.5">
            <p class="text-xs font-sans font-thin text-stone-400">CRIM v0.1 indev</p>
          </div>
          <div class="ml-auto bg-transparent flex flex-row items-start justify-start">
            <button
              class="outline-none font-sans w-6 h-6 border-opacity-50 bg-transparent text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
              onClick={() => appWindow.minimize()}
            >-
            </button>
            <button
              class="outline-none font-sans w-6 h-6 border-opacity-50 bg-transparent text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
              onClick={() => appWindow.toggleMaximize()}
            >□
            </button>
            <button
              class="outline-none font-sans w-6 h-6 border-opacity-50 bg-transparent text-stone-400 transition ease-in-out duration-200 hover:bg-red-900"
              onClick={() => appWindow.close()}
            >x
            </button>


          </div>
        </div>
      </div>
    </div>