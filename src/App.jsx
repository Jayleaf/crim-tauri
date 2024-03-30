import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import toast, { Toaster } from 'solid-toast';
import { Store } from "tauri-plugin-store-api";
import NavBar from "./components/NavBar";

const store = new Store(".data.tmp");

function App() {
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [warnUsername, setWarnUsername] = createSignal("");
  const [warnPassword, setWarnPassword] = createSignal("");

  async function transport() {
    // go to messenger page
    console.log("transporting to messenger...")
    window.eval("window.location.assign('messenger.html');");
  }

  async function login() {
    if (username() === "" || password() === "") {
      if (username() === "") {
        setWarnUsername("Please enter your username.");
        setLoading(false);
      }
      if (password() === "") {
        setWarnPassword("Please enter your password.");
        setLoading(false);
      }
      return;
    }
    const loadingToast = toast.loading("Logging in...")
    let data = await invoke("login_f", { username: username(), password: password() })
    switch (data) {
      case 200:
        toast.success(`Successfully logged in as ${username()}! 🎉`, { id: loadingToast })
        setLoading(false);
        transport();
        return;
      case 401:
        toast.error("Invalid username or password.", { id: loadingToast })
        setLoading(false);
        return;
      case 500 || 400:
        toast.error("Server error.", { id: loadingToast })
        setLoading(false);
        return;
    }
  }


  async function register() {
    setLoading(true);
    if (username() === "" || password() === "") {
      if (username() === "") {
        setWarnUsername("Please enter your username.");
        setLoading(false);
      }
      if (password() === "") {
        setWarnPassword("Please enter your password.");
        setLoading(false);
      }
      return;
    }
    let result = await invoke("register_f", { username: username(), password: password() })
    if (result === "Registered.") {
      toast.success("Successfully registered! 🎉")
      return;
    }
  }

  return (
    <div class="flex flex-col w-screen h-screen">
      <NavBar />
      <div class="pb-24 flex flex-col text-center items-start h-full align-center justify-center w-screen text-l pt-24 sm:text-base">
        <Toaster
          toastOptions={{
            duration: 2000,
            position: "top-center",
            style: {
              background: 'rgb(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              top: 20,
            },

          }}

        />
        <div class="pl-8 flex flex-col align-center justify-center items-start ">
        <h1 class="text-2xl lg:text-4xl font-sans font-bold text-stone-300">Welcome to CRIM. 🦀</h1>
        <h2 class="pt-3 text-l lg:leading-7 lg:text-[1.1rem] lg:pt-5 pb-4 text-start font-sans font-bold text-stone-400">Please log in or sign up to access <br/> your messages.</h2>
        <hr class="border-double border-[1.5px] border-white border-opacity-20 w-80"/>
        </div>
        
        <form
          class="flex flex-col items-start justify-center pl-8 w-full h-48 select-none gap-y-4 "
        >
          <input
            id="username-input"
            class={`outline-none font-sans w-64 h-12 lg:h-14 lg:w-72 p-2 border-2 text-s ${warnPassword() ? "border-rose-400" : "border-black"} border-opacity-25 rounded-md bg-opacity-10 bg-black text-stone-300`}
            onChange={(e) => { setUsername(e.currentTarget.value) }}
            onInput={() => setWarnUsername(false)}
            disabled={loading()}
            placeholder={warnUsername() ? warnUsername() : "Enter your username..."}
          />
          <input
            id="pwd-input"
            class={`outline-none font-sans w-64 h-12 p-2 lg:h-14 lg:w-72 border-2 text-s ${warnPassword() ? "border-rose-400" : "border-black"} border-opacity-25 rounded-md bg-opacity-10 bg-black text-stone-300`}
            onChange={(e) => { setPassword(e.currentTarget.value) }}
            onInput={() => setWarnPassword(false)}
            disabled={loading()}
            type="password"
            placeholder={warnPassword() ? warnPassword() : "Enter your password..."}
          />
        </form>
        <div class="pl-8 flex flex-row items-start justify-start w-full pt-0 gap-x-3">
          <button
            class="
          outline-none
          font-sans 
          w-24 
          h-10 p-2
          lg:w-32
          lg:h-12
          border-2 
          border-black
          border-opacity-25
          rounded-md
          bg-black 
          bg-opacity-10
          text-stone-300 
          transition ease-in-out duration-200
          hover:scale-105"
            type="submit"
            onClick={() => login()}
          >Login
          </button>
          <button
            class="
          outline-none
          font-sans 
          w-32 
          h-10 p-2 
          lg:w-32
          lg:h-12
          border-2 
          border-black
          border-opacity-25
          rounded-md
          bg-black 
          bg-opacity-10
          text-stone-300 
          transition ease-in-out duration-200
          hover:scale-105"
            type="submit"
            onClick={() => register()}
          >Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
