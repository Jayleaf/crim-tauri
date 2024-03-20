/* @refresh reload */
import { render } from "solid-js/web";
import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from '@tauri-apps/api/event'
import { onMount, createSignal } from "solid-js";
import "./styles.css";
import Messenger from "./MessengerApp";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".data.tmp");
let res = await invoke("get_f", { sid: await store.get("sid") });
if (res === 401 || res === 403) {
    window.eval("window.location.replace('index.html')");
}


const [data, setData] = createSignal(null);

const unlisten = await listen('update', async () => {
    console.log('updated')
    const ud = await store.get("userdata");
    setData(ud);
  })

emit('update', { update: true}).then(() =>
{
    render(() => <Messenger data={data()}/>, document.getElementById("root"));
})
