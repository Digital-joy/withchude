import Lenis from "@studio-freight/lenis"
import gsap from "gsap"
import { Observer, ScrollTrigger } from "gsap/all"
import SplitType from "split-type"
gsap.registerPlugin(ScrollTrigger, Observer)

interface LenisEvent {
  animate: {
    value: number
    from: number
    to: number
    lerp: number
    duration: number
    isRunning: boolean
  }
  animatedScroll: number
  dimensions: { wrapper: Window; content: HTMLElement }
  direction: 1 | -1
  options: { wrapper: Window; content: HTMLElement }
  targetScroll: number
  time: number
  velocity: number
  __isLocked: boolean
  __isScrolling: boolean
  __isSmooth: true
  __isStopped: boolean
  actualScroll: number
  className: string
  isHorizontal: boolean
  isLocked: boolean
  isScrolling: boolean
  isSmooth: boolean
  isStopped: boolean
  limit: number
  progress: number
  scroll: number
}

export default class Scroll {
  lenis: Lenis
  scrollbar: gsap.core.Timeline
  observer: Observer
  main: gsap.core.Timeline
  navbar: gsap.core.Timeline
  constructor(page: string) {
    this.create(page)
  }

  create(page: string) {
    this.lenis = new Lenis({
      // wrapper: innerWidth >= 768 ? window : window.$(".app"),
      // smoothTouch: true,
      lerp: 0,
    })

    document.querySelector("body").classList.add("active")

    if (page === "home") createHome()
    if (page === "noscroll") createNoScroll(this.lenis)
    if (page === "watch") createWatch()
    if (page === "blog") createNoVideo()
    if (page === "about") createAbout()
    if (page === "studio") createStudio()

    this.scrollbar = gsap.timeline({ paused: true }).to(".header__nav", {
      y: "91vh",
      ease: "linear",
      duration: 5,
    })

    this.main = gsap.timeline({ paused: true }).to(".header__nav", {
      y: "91vh",
      ease: "linear",
      duration: 5,
    })

    this.observer = Observer.create({
      target: ".header__nav__track",
      onDrag: this.onDrag.bind(this),
      onDragStart: (e) => e.target.classList.add("active"),
      onDragEnd: (e) => e.target.classList.remove("active"),
    })

    this.lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)
    requestAnimationFrame(this.raf.bind(this))

    // let isPlayingNav = false
    // let isReversingNav = false
    // this.lenis.on("scroll", ({ direction }: LenisEvent) => {
    //   if (direction > 0 && innerWidth >= 768) {
    //     this.navbar.play()
    //   }
    //   if (direction < 0 && innerWidth >= 768) {
    //     this.navbar.reverse()
    //   }
    // })

    // this.navbar = gsap.timeline({ paused: true }).fromTo(
    //   ".Nav",
    //   {
    //     y: "0rem",
    //     duration: 0.2,
    //   },
    //   {
    //     y: "-8rem",
    //     ease: "expo.in",
    //     duration: 1.75,
    //   }
    // )
  }

  navigate(page: string) {
    this.lenis.reset()
    this.create(page)
  }

  raf(time: number) {
    this.lenis.raf(time)
    this.scrollbar.progress(this.lenis.progress)
    requestAnimationFrame(this.raf.bind(this))
  }

  onDrag(e: globalThis.Observer) {
    this.lenis.scrollTo((e.y / innerHeight) * this.lenis.dimensions.scrollHeight)
  }
}

function createHome() {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()

  new SplitType(".Categories__wrapper h2, .Updates__wrapper h2, .Watching__wrapper h2, .Faq__wrapper h2")
  const vids = document.querySelectorAll<HTMLVideoElement>(".Hero__media__active > video")

  mm.add("(min-width:0px)", () => {
    tl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".Join",
          scrub: true,
          endTrigger: "body",
          start: "25% 100%",
          end: "100% 100%",
        },
      })
      .to(".Footer-x", { y: 0 })

    const x = gsap
      .timeline({
        paused: true,
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          scrub: true,
          end: `+=${innerHeight}`,
        },
      })
      .fromTo(".Nav__logo, .Nav__search, .Nav__ham", { filter: "invert(1)" }, { filter: "invert(0)", delay: 10 }, 0)
      .to(".Nav__links, .Nav", { color: "#090908", "--bg": "#090908", delay: 10 }, 0)
      .to(".Nav", { backgroundColor: "#F5F5F5cc", delay: 10 }, 0)
    if (innerWidth < 768) return
    x.to(".Hero", { y: "50vh", duration: 10.5 }, 0)

    // gsap
    //   .timeline({
    //     paused: true,
    //     defaults: { ease: "none", duration: 1 },
    //     scrollTrigger: {
    //       scrub: true,
    //       start: `+=${innerHeight / 4}`,
    //       once: true,
    //     },
    //     once: true,
    //   })
    //   .fromTo(
    //     ".Categories__wrapper h2 .line",
    //     { yPercent: 100, clipPath: "inset(0% -100% 100% 0%)" },
    //     { yPercent: 10, clipPath: "inset(0% -100% 0% 0%)", duration: 5, stagger: { amount: 3.5 } },
    //     0
    //   )
    //   .from(".header__nav", { background: "#ffffff", duration: 5, stagger: { amount: 3.5 } }, 0)
    //   .from(".Categories__wrapper li", { yPercent: 100, duration: 10, stagger: { amount: 7.5 } }, 5)
    //   .fromTo(".Categories__aside", { autoAlpha: 0 }, { autoAlpha: 1, duration: 5 }, 15)
    //   .fromTo(
    //     ".Updates__wrapper h2 .line",
    //     { yPercent: 100, clipPath: "inset(0% -100% 100% 0%)" },
    //     { yPercent: 10, clipPath: "inset(0% -100% 0% 0%)", duration: 5, stagger: { amount: 3.5 } },
    //     20
    //   )
    //   .fromTo(
    //     ".Watching__wrapper h2 .line",
    //     { yPercent: 100, clipPath: "inset(0% -100% 100% 0%)" },
    //     { yPercent: 10, clipPath: "inset(0% -100% 0% 0%)", duration: 5, stagger: { amount: 3.5 } },
    //     40
    //   )
    //   .fromTo(
    //     ".Faq__wrapper h2 .line",
    //     { yPercent: 100, clipPath: "inset(0% -100% 100% 0%)" },
    //     { yPercent: 10, clipPath: "inset(0% -100% 0% 0%)", duration: 5, stagger: { amount: 3.5 } },
    //     55
    //   )
    //   // .from(".Updates__wrapper ul", { x: "-36rem", overflow: "visible", duration: 10, ease: "ease.out" }, 25)
    //   .to("body", { opacity: 1, duration: innerWidth < 768 ? 240 : 120 }, 0)
  })
}

function createNoVideo() {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()
  mm.add("(min-width:0px)", () => {
    tl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".Join",
          scrub: true,
          endTrigger: "body",
          start: "25% 100%",
          end: "100% 100%",
        },
      })
      .to(".Footer", { yPercent: -100 })

    gsap
      .timeline({})
      .set(".Nav__logo, .Nav__search, .Nav__ham", { filter: "invert(0)" }, 0)
      .set(".Nav__links, .Nav", { color: "#090908", "--bg": "#090908" }, 0)
      .set(".Nav", { backgroundColor: "#F5F5F5cc" }, 0)
  })
}

function createAbout() {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()
  mm.add("(min-width:0px)", () => {
    tl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".Join",
          scrub: true,
          endTrigger: "body",
          start: "25% 100%",
          end: "100% 100%",
        },
      })
      // .to(".Footer", { yPercent: -100 })

    gsap
      .timeline({})
      .set(".Nav__logo, .Nav__search, .Nav__ham", { filter: "invert(0)" }, 0)
      .set(".Nav__links, .Nav", { color: "#090908", "--bg": "#090908" }, 0)
      .set(".Nav", { backgroundColor: "#F5F5F5cc" }, 0)
  })
}

function createNoScroll(lenis: Lenis) {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()
  mm.add("(min-width:0px)", () => {
    lenis.destroy()
    gsap
      .timeline({})
      .set("html", { overflow: "hidden" }, 0)
      .set(".Nav__logo, .Nav__search, .Nav__ham", { filter: "invert(0)" }, 0)
      .set(".Nav__links, .Nav", { color: "#090908", "--bg": "#090908" }, 0)
      .set(".Nav", { backgroundColor: "#F5F5F5cc" }, 0)
      .set(".header__nav__track, .header__nav", { display: "none" }, 0)
  })
}

function createStudio() {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()
  mm.add("(min-width:0px)", () => {
    gsap.set(".Footer", { position: "static", y: 0 })

    gsap
      .timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".Footer__top",
          scrub: true,
          endTrigger: "body",
          start: "25% 100%",
          end: "100% 100%",
        },
      })
      .to(".Aud__wrapper", { yPercent: 100 })

    gsap
      .timeline({})
      .set(".Nav__logo, .Nav__search, .Nav__ham", { filter: "invert(0)" }, 0)
      .set(".Nav__links, .Nav", { color: "#090908", "--bg": "#090908" }, 0)
      .set(".Nav", { backgroundColor: "#F5F5F5cc" }, 0)
  })
}

function createWatch() {
  const mm = gsap.matchMedia()
  let tl: gsap.core.Timeline
  tl = gsap.timeline()
  mm.add("(min-width:0px)", () => {
    tl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".Join",
          scrub: true,
          endTrigger: "body",
          start: "25% 100%",
          end: "100% 100%",
        },
      })
      .fromTo(".Footer", { yPercent: 50 }, { yPercent: -100 })

    gsap
      .timeline({
        paused: true,
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          scrub: true,
          end: `+=${innerHeight}`,
        },
      })
      .to(".Nav", { backgroundColor: "#0c0c0fcc", delay: 10 }, 0)
  })
}
