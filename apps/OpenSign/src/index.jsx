import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/dark-theme-improvements.css";
import "./styles/swurv-overrides.css";
import App from "./App";
import { showUpgradeProgress, hideUpgradeProgress } from "./utils";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Parse from "parse";
import "./polyfills";
import { serverUrl_fn } from "./constant/appinfo";
import "./i18n";
import { ScrollProvider } from "./context/ScrollPdfContext";

const appId =
  import.meta.env.VITE_APPID || process.env.REACT_APP_APPID || "opensign";
const serverUrl = serverUrl_fn();
Parse.initialize(appId);
Parse.serverURL = serverUrl;

if (localStorage.getItem("showUpgradeProgress")) {
  showUpgradeProgress();
}

// SWURV: index.html ships data-theme="opensigndark" as the default, so only an
// explicit "light" preference needs applying here -- doing it before React mounts
// avoids a flash of the dark theme for users who chose light.
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "opensigncss");
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ScrollProvider>
      <App />
    </ScrollProvider>
  </Provider>
);

hideUpgradeProgress();
localStorage.removeItem("showUpgradeProgress");
