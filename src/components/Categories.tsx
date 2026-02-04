import { useEffect, useState } from "react"
import $Categories from "../app/classes/categories"
import { Fit, Layout, useRive } from "@rive-app/react-canvas-lite"
import gsap from "gsap"
import LeftSvg from "../icons/left"
import { Link } from "react-router-dom"

export default function Categories() {
  gsap.config({ nullTargetWarn: false })
  let tl1 = gsap.timeline({ paused: true }).fromTo(".Header1", { scale: 1 }, { scale: 1, duration: 1 })
  let tl2 = gsap.timeline({ paused: true }).fromTo(".Header2", { scale: 1 }, { scale: 1, duration: 1 })
  let tl3 = gsap.timeline({ paused: true }).fromTo(".Header3", { scale: 1 }, { scale: 1, duration: 1 })
  let tl4 = gsap.timeline({ paused: true }).fromTo(".Header4", { scale: 1 }, { scale: 1, duration: 1 })
  let tl5 = gsap.timeline({ paused: true }).fromTo(".Header5", { scale: 1 }, { scale: 1, duration: 1 })
  let tl6 = gsap.timeline({ paused: true }).fromTo(".Header6", { scale: 1 }, { scale: 1, duration: 1 })

  const { rive: rive1, RiveComponent: RiveComponent1 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `1`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const { rive: rive2, RiveComponent: RiveComponent2 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `2`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const { rive: rive3, RiveComponent: RiveComponent3 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `3`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const { rive: rive4, RiveComponent: RiveComponent4 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `4`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const { rive: rive5, RiveComponent: RiveComponent5 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `5`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const { rive: rive6, RiveComponent: RiveComponent6 } = useRive({
    src: "./categories.riv",
    autoplay: false,
    artboard: `6`,
    layout: new Layout({ fit: Fit.Contain }),
    animations: "Timeline 1",
  })

  const [hover, setHover] = useState("one")

  return (
    <section className="Categories">
      <div className="Categories__wrapper">
        <h2>Stories that strengthen the mind, heart and spirit.</h2>
        <ul className="Categories__list">
          <Link to={"/watch"}>
            <li>
              <figure>
                <RiveComponent1
                  onMouseEnter={async () => {
                    if (!rive1) return
                    setHover("one")
                    await tl1.reverse()
                    tl1.play()
                    rive1.play("Timeline 1")
                    await tl1.play()
                    tl1.reverse()
                    rive1.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category1.png" />
              </figure>
              <h3>Videos</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <Link to={"/podcasts"}>
            <li>
              <figure>
                <RiveComponent2
                  onMouseEnter={async () => {
                    if (!rive2) return
                    setHover("two")
                    await tl2.reverse()
                    tl2.play()
                    rive2.play("Timeline 1")
                    await tl2.play()
                    tl2.reverse()
                    rive2.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category2.png" />
              </figure>
              <h3>Podcasts</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <Link to={"/films"}>
            <li>
              <figure>
                <RiveComponent3
                  onMouseEnter={async () => {
                    if (!rive3) return
                    setHover("three")
                    await tl3.reverse()
                    tl3.play()
                    rive3.play("Timeline 1")
                    await tl3.play()
                    tl3.reverse()
                    rive3.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category3.png" />
              </figure>
              <h3>Films</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <Link to={"/events"}>
            <li>
              <figure>
                <RiveComponent4
                  onMouseEnter={async () => {
                    if (!rive4) return
                    setHover("four")
                    await tl4.reverse()
                    tl4.play()
                    rive4.play("Timeline 1")
                    await tl4.play()
                    tl4.reverse()
                    rive4.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category4.png" />
              </figure>
              <h3>Events</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <Link to={"/masterclass"}>
            <li className="book">
              <figure>
                <RiveComponent5
                  onMouseEnter={async () => {
                    if (!rive5) return
                    setHover("five")
                    await tl5.reverse()
                    tl5.play()
                    rive5.play("Timeline 1")
                    await tl5.play()
                    tl5.reverse()
                    rive5.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category5.png" />
              </figure>
              <h3>Masterclasses</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <Link to={"/studio"}>
            <li>
              <figure>
                <RiveComponent6
                  onMouseEnter={async () => {
                    if (!rive6) return
                    setHover("six")
                    await tl6.reverse()
                    tl6.play()
                    rive6.play("Timeline 1")
                    await tl6.play()
                    tl6.reverse()
                    rive6.play("Timeline 2")
                  }}
                />
                <img data-mobile="" src="/images/category6.png" />
              </figure>
              <h3>Studio</h3>
              <article>
                Explore
                <LeftSvg />
              </article>
            </li>
          </Link>
          <div className={`Categories__aside ${hover}`}></div>
        </ul>
      </div>
    </section>
  )
}
