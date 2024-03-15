import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import toast from 'solid-toast';

function App() {
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [warnUsername, setWarnUsername] = createSignal("");
  const [warnPassword, setWarnPassword] = createSignal("");

  async function transport()
  {
    // go to messenger page
    window.location.href = "messenger.html";
  }

  async function login()
  {
    if(username() === "" || password() === "")
    {
      if(username() === "")
      {
        setWarnUsername("Please enter your username.");
        setLoading(false);
      }
      if(password() === "")
      {
        setWarnPassword("Please enter your password.");
        setLoading(false);
      }
      return;
    }
    let result = await invoke("login", { username: username(), password: password() })
    toast.promise(result, {
      loading: 'Loading',
      success: <b>Got the data</b>,
      error: 'An error occurred 😔',
    });
    setLoading(false);
  }


  async function register()
  {
    setLoading(true);
    if(username() === "" || password() === "")
    {
      if(username() === "")
      {
        setWarnUsername("Please enter your username.");
        setLoading(false);
      }
      if(password() === "")
      {
        setWarnPassword("Please enter your password.");
        setLoading(false);
      }
      return;
    }
    let result = await invoke("register", { username: username(), password: password() })
    if(result === "Registered.")
    {
      setLoading(false);
      return;
    }
  }

  return (
    <div class="flex flex-col text-center items-center w-screen text-l pt-24 sm:text-base">
      <h1 class="text-4xl font-sans font-bold text-stone-300">Welcome to CRIM.</h1>
      <h2 class="text-xl font-sans font-bold text-stone-400">Please log in or sign up to access your messages.</h2>

      <form
        class="flex flex-col items-center pt-24 w-full h-80 select-none gap-y-4 "
      >
        <input
          id="username-input"
          class={warnUsername()? "animate-pulse outline-none font-sans w-96 h-20 p-2 border-rose-500 border-2 text-xl border-opacity-50 rounded-md bg-opacity-10 bg-stone-300" : "outline-none font-sans w-96 h-20 p-2 border-2 text-xl border-rose-950 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
          onChange={(e) => {setUsername(e.currentTarget.value)}}
          onInput={() => setWarnUsername(false)}
          disabled={loading()}
          placeholder={warnUsername()? warnUsername() : "Enter your username..."}
        />
        <input
          id="pwd-input"
          class={warnPassword()? "animate-pulse outline-none font-sans w-96 h-20 p-2 border-rose-500 border-2 text-xl border-opacity-50 rounded-md bg-opacity-10 bg-stone-300" : "outline-none font-sans w-96 h-20 p-2 border-2 text-xl border-rose-950 border-opacity-50 rounded-md bg-opacity-10 bg-stone-300 text-stone-400"}
          onChange={(e) => {setPassword(e.currentTarget.value)}}
          onInput={() => setWarnPassword(false)}
          disabled={loading()}
          type="password"
          placeholder={warnPassword()? warnPassword() : "Enter your password..."}
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
          border-rose-950 
          border-opacity-50 
          rounded-md bg-opacity-10 
          bg-stone-300 
          text-stone-400 
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
          border-rose-950 
          border-opacity-50 
          rounded-md bg-opacity-10 
          bg-stone-300 
          text-stone-400 
          transition ease-in-out duration-200
          hover:scale-105" 
        type="submit"
        onClick={() => register()}
        >Register
        </button>
      </div>
      <div>
      <button onClick={transport()}>
        test move to messenger
      </button>
    </div>
    </div>
  );
}

export default App;
