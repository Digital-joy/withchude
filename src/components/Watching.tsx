import { PrismicDocument } from "@prismicio/client"
import gsap from "gsap"
import { InertiaPlugin } from "gsap-trial/all"
import { Draggable, Observer } from "gsap/all"
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

gsap.registerPlugin(Draggable, InertiaPlugin, Observer)

export default function Watching({ reels }: PropsWithChildren<{ reels: PrismicDocument }>) {
  const [filtered, setFiltered] = useState([
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching1.webp",
      title: "Awaiting Trial",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching2.webp",
      title: "Japa",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching3.webp",
      title: "With Chude",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching4.JPG",
      title: "Is it Your Money",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching5.JPG",
      title: "Where is Chijioke",
      uid: "id",
      url: "",
    },
    {
      thumbnail: "/images/watching6.webp",
      title: "The Joy 150",
      uid: "id",
      url: "",
    },
  ])

  // useEffect(() => {
  //   get("videos").then((data) => {
  //     setFiltered(
  //       data
  //         .filter((x) => x.url !== "")
  //         .slice()
  //         .sort(function (a, b) {
  //           if (a.views > b.views) {
  //             return -1
  //           } else if (a.views < b.views) {
  //             return 1
  //           }
  //           return 0
  //         })
  //     )
  //   })
  // }, [])

  useEffect(() => {
    if (innerWidth < 768) return
    const mm = gsap.matchMedia()
    let tl = gsap.timeline({})
    mm.add("(min-width:768px) and (max-width:2000000px)", () => {
      tl = gsap
        .timeline({ defaults: { ease: "none" }, paused: true })
        .fromTo(".Watching__list", { x: 2.86 * innerWidth }, { x: -2.86 * innerWidth, duration: 150 })

      const tl2 = gsap.fromTo(
        tl,
        { progress: 0 },
        {
          progress: 1,
          duration: 150,
          repeat: -1,
          ease: "none",
          yoyo: true,
        }
      )

      const wrapper = document.querySelector(".Watching__list") as unknown as HTMLDivElement
      wrapper.onmouseenter = () => tl2.pause()
      wrapper.onmouseleave = () => tl2.resume()

      Observer.create({
        target: ".Watching__wrapper",
        onDrag: (e) => {
          gsap.to(tl2, {
            progress: Math.max(Math.min(tl2.progress() - e.deltaX / 600, 1), 0),
            duration: 1,
            ease: "Power1.out",
          })
        },
        onDragEnd: (e) => {
          if (e.deltaX > 1) tl2.reverse()
          else tl2.play()
        },
        onWheel: (e) => {
          gsap.to(tl2, {
            progress: Math.max(Math.min(tl2.progress() + e.deltaX / 600, 1), 0),
            duration: 1,
            ease: "Power1.out",
          })
        },
        onHover: (e) => {
          tl.pause()
        },
      })
      // const x = Draggable.create(".Watching__list", {
      //   type: "x",
      //   bounds: { left: 2.95 * innerWidth, width: -4.9 * innerWidth },
      //   zIndexBoost: false,
      //   cursor: "grab",
      //   activeCursor: "grabbing",
      //   inertia: true,
      //   throwResistance: 8000,
      //   ease: "ease.inout",
      //   duration: "40",
      //   onClick: function () {
      //     console.log("clicked")
      //   },
      //   onDragEnd: (a) => {},
      // })
    })
  }, [])

  return (
    <section className="Watching">
      <div className="Watching__wrapper withchude_live_background">
        <h2>See our films and series.</h2>
        {/* <Link to={"/watch/tags/" + "Most Popular Episodes"} className="Watching__cta">
          View Catalogue
        </Link> */}
        <ul className="Watching__list">
          {Array(6)
            .fill(reels?.data?.reels)
            .flat()
            .map((article, index) => {
              if (index > 30) return <Fragment key={index}></Fragment>
              return <Item vid={article} key={index} />
            })}
        </ul>
      </div>
    </section>
  )
}

const Item = ({ vid }: PropsWithChildren<{ vid: any }>) => {
  const [muted, setMuted] = useState(true)
  const video = useRef<HTMLVideoElement>(null)
  return (
    <Link key={vid.uid} to={"/watch"}>
      <li>
        <figure>
          <img
            src={vid.cover.url}
            // crossOrigin="anonymous"
            // muted={muted}
            // loop={true}
            // ref={video}
            // onMouseEnter={() => {
            //   video.current.play()
            //   setMuted(false)
            // }}
            // onMouseLeave={() => {
            //   video.current.pause()
            //   setMuted(true)
            // }}
          ></img>
        </figure>
        {/* <h3>{vid.title}</h3> */}
      </li>
    </Link>
  )
}
