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
    window.eval("window.location.replace('messenger.html')");
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
      <div class="flex flex-col text-center items-center w-screen text-l pt-24 sm:text-base">
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
        <h1 class="text-4xl font-sans font-bold text-stone-300">Welcome to CRIM.</h1>
        <h2 class="pt-3 text-xl font-sans font-bold text-stone-400">Please log in or sign up to access your messages.</h2>

        <form
          class="flex flex-col items-center pt-24 w-full h-80 select-none gap-y-4 "
        >
          <input
            id="username-input"
            class={`outline-none font-sans w-96 h-20 p-2 border-2 text-xl ${warnPassword() ? "border-rose-400" : "border-black"} border-opacity-25 rounded-md bg-opacity-10 bg-black text-stone-300`}
            onChange={(e) => { setUsername(e.currentTarget.value) }}
            onInput={() => setWarnUsername(false)}
            disabled={loading()}
            placeholder={warnUsername() ? warnUsername() : "Enter your username..."}
          />
          <input
            id="pwd-input"
            class={`outline-none font-sans w-96 h-20 p-2 border-2 text-xl ${warnPassword() ? "border-rose-400" : "border-black"} border-opacity-25 rounded-md bg-opacity-10 bg-black text-stone-300`}
            onChange={(e) => { setPassword(e.currentTarget.value) }}
            onInput={() => setWarnPassword(false)}
            disabled={loading()}
            type="password"
            placeholder={warnPassword() ? warnPassword() : "Enter your password..."}
          />
        </form>
        <div class="flex flex-row items-center justify-center w-full pt-0 gap-x-10">
          <button
            class="
          outline-none
          font-sans 
          w-40 
          h-10 p-2 
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
          w-40 
          h-10 p-2 
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
