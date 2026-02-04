import { useNavigate, useSearchParams } from "react-router-dom"
import CharactersSvg from "../icons/characters"
import ShowSvg from "../icons/show"
import SymbolSvg from "../icons/symbol"
import CloseSvg from "../icons/close"
import { FC, useEffect, useState } from "react"
import { supabase } from "../App"
import HideSvg from "../icons/hide"

const Checkout: FC<{ Close(): void }> = ({ Close = () => {} }) => {
  const navigate = useNavigate()
  const [hasAccount, setHasAccount] = useState(false)
  const [show, setShow] = useState(false)

  return (
    <aside className="Popup" onClick={Close}>
      <div
        className={hasAccount ? "Popup__wrapper active" : "Popup__wrapper"}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button onClick={Close}>
          <CloseSvg />
        </button>
        <section className="Signup__form">
          <h1>Create an account.</h1>
          <p>Gain access to all videos for $8.99/mo.</p>
          <div>
            <br />
          </div>
        </section>
      </div>
    </aside>
  )
}

export default Checkout
