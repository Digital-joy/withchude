import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./styles/index.scss"
import Scroll from "./app/classes/scroll.ts"
// import $Header from "./app/classes/header.ts"
import $Header from "./app/classes/header-alt.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)

declare global {
  interface Window {
    // app: App
    $(el: string): HTMLElement
    $$(el: string): HTMLElement[]
    $scroll: Scroll
    $header: $Header
  }
}
