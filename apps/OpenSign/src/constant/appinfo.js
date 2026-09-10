import logo from "../assets/images/logo.png";
import { getEnv } from "./Utils";

export function serverUrl_fn() {
  const env = getEnv();
  const serverurl = env?.REACT_APP_SERVERURL
    ? env.REACT_APP_SERVERURL // env.REACT_APP_SERVERURL is used for prod
    : process.env.REACT_APP_SERVERURL; //  process.env.REACT_APP_SERVERURL is used for dev (locally)
  let baseUrl = serverurl ? serverurl : window.location.origin + "/api/app";
  return baseUrl;
}
export const appInfo = {
  applogo: logo,
  appId: process.env.REACT_APP_APPID ? process.env.REACT_APP_APPID : "opensign",
  baseUrl: serverUrl_fn(),
  defaultRole: "contracts_User",
  fev_Icon:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACgklEQVRYR2P88enZfwYg+A8iGRmBDBANFwAxQNI4AFghVB+yOqA4ihlgG6BiIAkIAFnH+P3T8/8Q28FCUAthNB67yZZCNpsR6ICPkBBAAVSxHxY66IGIajh2B5DtO1I14goBUs0hSj32YKVRCBAfhzRyAL4gISYREhWk1FFEQQgwMhw/eZqBhYWZwdTYCD2p43YduKxBZDyiHfD9x0+Gl69eMTx48Ijh/MVLDDt272W4dv0GuOjQ1dZmcHV2ZDDQ02FQlJdnkJAQZ+BgZyMqiIhywJVr1xk8/UPx+AopAMCFICPD3m0bGVRVlAg6gigHnD1/iSEgLArDMFipja0g27ZuFYOujhZ1HHDx8lUGn6BwREkNNRbZASiOAYbC7i3rGTTUVKnjgHsPHjLYu3qjGIZIRhCrEVUMRNnJQ3sYpCQlqOOAb9+/M6jrm4IrNFx1I7IDmJiZGe5cPsvAyspCHQeATLFydGd4/OQp1lBA972SogLDwV1bCFoODjmstSEWrfkllQzrNm6Gy6DV/ig6wkOCGHram4hwAKg9gK06xqIVlO9Ts/IxQgC5BQGTnD9rGoOLox11HfD7zx8GG2dPhmfPnuM1WF5ejuHgzi0MzMxM1HUAyLS1G7cw5JdUwFM8tnJgxuR+Bm8PV6IsBykiOgpAikEWZheUMmzeuh2rBSFB/gz9na1EW06yA0Aafvz8yZCSmc9w8PARsEXABiW4FHB2dGCYNaWPgY2NuDoA4koScgGyt0Dpob27n2HO/EXAli0jQ1pyIkN5cR4DCzD/kwpIigJ0wy9fvcbAxMTMoK2pTqq9cPUUOYBsW5E0jjpgNARGQ4DOIQCpO0ElJ6Q6/88AAL7lGNhsT8fQAAAAAElFTkSuQmCC",
  googleClientId: process.env.REACT_APP_GOOGLECLIENTID
    ? `${process.env.REACT_APP_GOOGLECLIENTID}`
    : "",
  metaDescription:
    "Secure document signing for Swurv clients.",
  settings: [
    {
      role: "contracts_Admin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_OrgAdmin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_Editor",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_User",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    }
  ]
};
