import { FC, ReactNode } from "react"
import { FooterLite } from "./Footer"

const Sections: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  return (
    <>
      <section className="Sections">
        <div className="Sections__wrapper">{children}</div>
      </section>
      <FooterLite />
    </>
  )
}

export default Sections
