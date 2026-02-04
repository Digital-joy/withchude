import gsap from "gsap"
import { createSnippet } from "../utils"

export default class $Header {
  videosTl: gsap.core.Timeline
  data: any[]
  constructor(data: any[]) {
    this.data = data?.map((datum) => ({ ...datum, snippet: createSnippet(datum.snippet, datum.url) }))
    this.create(data)
  }

  create(data: any[]) {
    this.createPlayHead()
  }

  createPlayHead() {
    const playHead = document.querySelector(".Hero__playhead")
    const vids = document.querySelectorAll<HTMLVideoElement>(".Hero__media__active > video")
    const videos = document.querySelectorAll(".Hero__media__active")
    const details = document.querySelectorAll(".Hero__media__active2")
    // vids.forEach((vid) => (vid.volume = 0))

    this.videosTl = gsap
      .timeline({
        repeat: -1,
        onRepeat: () => {},
      })
      .set(".Hero__media:nth-of-type(1)", { border: "0.2rem solid #b2b2b2" })
      .set(".Hero__media:nth-of-type(3)", { border: "unset" })
      .set(details[0], { autoAlpha: 1 })
      .set([details[2], details[1]], { autoAlpha: 0 })
      .set(vids[0], { attr: { src: this.data[0].snippet }, currentTime: 0 })
      .set(playHead, {
        y: "18.8rem",
        ease: "none",
        delay: 19,
      })
      .set(".Hero__media:nth-of-type(2)", { border: "0.2rem solid #b2b2b2" })
      .set(".Hero__media:nth-of-type(1)", { border: "unset" })
      .set(details[1], { autoAlpha: 1 })
      .set([details[0], details[2]], { autoAlpha: 0 })
      .set(vids[0], { attr: { src: this.data[1].snippet }, currentTime: 0 })
      .set(playHead, {
        y: "37.6rem",
        ease: "none",
        delay: 19,
      })
      .set(".Hero__media:nth-of-type(3)", { border: "0.2rem solid #b2b2b2" })
      .set(".Hero__media:nth-of-type(2)", { border: "unset" })
      .set(details[2], { autoAlpha: 1 })
      .set([details[0], details[1]], { autoAlpha: 0 })
      .set(vids[0], { attr: { src: this.data[2].snippet }, currentTime: 0 })
      .set(playHead, {
        y: "0rem",
        ease: "none",
        delay: 19,
      })
  }

  navigate(page: string) {}
}
