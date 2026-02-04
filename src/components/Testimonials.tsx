import gsap from "gsap"
import { PropsWithChildren, useEffect } from "react"
import PrevSvg from "../icons/prev"
import NextSvg from "../icons/next"
import { PrismicDocument } from "@prismicio/client"
import { PrismicRichText, PrismicText } from "@prismicio/react"

export default function Testimonials({ testimonies }: PropsWithChildren<{ testimonies: PrismicDocument }>) {
  let tl: gsap.core.Timeline
  // testimonies.data.testimonials.length
  useEffect(() => {
    tl = gsap
      .timeline({ paused: true })
      .fromTo(
        testimonies.data.testimonials.map((x, i) => `.Testimonials__wrapper ul li:nth-of-type(${i + 1})`).join(", "),
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, stagger: 1, duration: 1, opacity: 5 },
        0
      )
      .fromTo(
        testimonies.data.testimonials.map((x, i) => `.Testimonials__wrapper ul li:nth-of-type(${i})`).join(", "),
        { xPercent: 0, opacity: 1 },
        {
          xPercent: -100,
          stagger: 1,
          duration: 1,
          opacity: 0,
          immediateRender: false,
        },
        1
      )
      .to(".Testimonials__control.next", { opacity: 0 }, testimonies.data.testimonials.length - 1)
      .fromTo(".Testimonials__control.prev", { opacity: 0 }, { opacity: 1 }, 1)
    tl.progress(1 / testimonies.data.testimonials.length)
  })

  return (
    <section className="Testimonials">
      <div className="Testimonials__wrapper">
        <img src="/images/testimony.png" alt="" className="Testimonials__bg" data-desktop />
        <img src="/images/testimony-m.png" alt="" className="Testimonials__bg" data-mobile />
        <p>What the people are saying</p>
        <div
          className="Testimonials__control prev"
          onClick={() => {
            gsap.to(tl, {
              progress: Math.max(
                tl?.progress() - 1 / testimonies.data.testimonials.length,
                1 / testimonies.data.testimonials.length
              ),
            })
          }}
        >
          <PrevSvg />
        </div>
        <ul>
          {testimonies?.data?.testimonials?.map((data, index) => {
            return (
              <li key={index}>
                <h3>
                  <PrismicText field={data.what} />
                </h3>
                <p>
                  <PrismicText field={data.who} />
                </p>
              </li>
            )
          })}
        </ul>
        <div
          className="Testimonials__control next"
          onClick={() => {
            gsap.to(tl, { progress: tl?.progress() + 1 / testimonies.data.testimonials.length })
          }}
        >
          <NextSvg />
        </div>
      </div>
    </section>
  )
}
