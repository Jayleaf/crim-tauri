/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import Messenger from "./MessengerApp";

render(() => <Messenger />, document.getElementById("root"));
