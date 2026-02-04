import { PrismicDocument } from "@prismicio/client"
import { PrismicRichText, PrismicText } from "@prismicio/react"
import gsap from "gsap"
import { InertiaPlugin } from "gsap-trial/all"
import { Draggable } from "gsap/all"
import { PropsWithChildren, useState } from "react"

gsap.registerPlugin(Draggable, InertiaPlugin)

export default function FAQ({ faqs }: PropsWithChildren<{ faqs: PrismicDocument }>) {
  const [open, setOpen] = useState(1)

  return (
    <section className="Faq">
      <div className="Faq__wrapper withchude_live_background">
        <h2>Frequently Asked Questions</h2>
        <ul className="Faq__list">
          {faqs?.data?.faq?.map((data, index) => {
            return (
              <FaqItem key={index} title={data.question && data.question[0]?.text} index={index} open={open} setOpen={setOpen}>
                <PrismicRichText field={data.answer} />
              </FaqItem>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const FaqItem = ({ title, children, index, open, setOpen }) => {
  return (
    <li className={open === index ? "open" : ""}>
      <h3 onClick={() => setOpen(open === index ? -1 : index)}>
        {title}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 7.91699L10 12.917L15 7.91699"
            stroke="black"
            strokeWidth="2.63077"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
      </h3>
      {children}
    </li>
  )
}
