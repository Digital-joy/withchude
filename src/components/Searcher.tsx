import { FC } from "react"
import { Link } from "react-router-dom"

export const Searcher: FC<{ text: string; input?: string; setInput?(x: string): void }> = ({
  text,
  input,
  setInput = () => {},
}) => {
  return (
    <div className="Searcher">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 20L16.05 16.05M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z"
          stroke="#C4C4C4"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input type="text" placeholder={text} value={input} onInput={(e) => setInput(e.currentTarget.value)} />
    </div>
  )
}
