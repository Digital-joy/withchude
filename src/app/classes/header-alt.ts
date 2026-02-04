import gsap from "gsap"
import { MAX_PINNED_VIDEOS, createSnippet } from "../utils"

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

  // createPlayHead() {
  //   const playHead = document.querySelector(".Hero__playhead")
  //   const vids = document.querySelectorAll<HTMLVideoElement>(".Hero__media__active > video")
  //   const videos = document.querySelectorAll(".Hero__media__active")
  //   const details = document.querySelectorAll(".Hero__media__active2")
  //   // vids.forEach((vid) => (vid.volume = 0))

  //   this.videosTl = gsap
  //     .timeline({
  //       repeat: -1,
  //       onRepeat: () => {},
  //     })
  //     .set(".Hero__media:nth-of-type(1)", { border: "0.2rem solid #b2b2b2" })
  //     .set(".Hero__media:nth-of-type(3)", { border: "unset" })
  //     .set(details[0], { autoAlpha: 1 })
  //     .set([details[2], details[1]], { autoAlpha: 0 })
  //     .set(vids[0], { attr: { src: this.data[0].snippet }, currentTime: 0 })
  //     .set(playHead, {
  //       y: "18.8rem",
  //       ease: "none",
  //       delay: 19,
  //     })
  //     .set(".Hero__media:nth-of-type(2)", { border: "0.2rem solid #b2b2b2" })
  //     .set(".Hero__media:nth-of-type(1)", { border: "unset" })
  //     .set(details[1], { autoAlpha: 1 })
  //     .set([details[0], details[2]], { autoAlpha: 0 })
  //     .set(vids[0], { attr: { src: this.data[1].snippet }, currentTime: 0 })
  //     .set(playHead, {
  //       y: "37.6rem",
  //       ease: "none",
  //       delay: 19,
  //     })
  //     .set(".Hero__media:nth-of-type(3)", { border: "0.2rem solid #b2b2b2" })
  //     .set(".Hero__media:nth-of-type(2)", { border: "unset" })
  //     .set(details[2], { autoAlpha: 1 })
  //     .set([details[0], details[1]], { autoAlpha: 0 })
  //     .set(vids[0], { attr: { src: this.data[2].snippet }, currentTime: 0 })
  //     .set(playHead, {
  //       y: "0rem",
  //       ease: "none",
  //       delay: 19,
  //     })
  // }
  
  createPlayHead() {
    const playHead = document.querySelector(".Hero__playhead");
    const vids = document.querySelectorAll<HTMLVideoElement>(".Hero__media__active > video");
    const videos = document.querySelectorAll(".Hero__media__active");
    const details = document.querySelectorAll(".Hero__media__active2");

    const videoCount = MAX_PINNED_VIDEOS; // Number of videos
    const delayTime = 19; // Time before moving to the next video
    const playHeadStep = 29.9; // Playhead step in rem

    this.videosTl = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
        },
    });

    for (let i = 0; i < videoCount; i++) {
       
        const nextIndex = (i + 1) % videoCount;
        const prevIndex = (i - 1 + videoCount) % videoCount;

        // Set borders and details visibility
        this.videosTl
            .set(`.Hero__media:nth-of-type(${i + 1})`, { border: "0.2rem solid #b2b2b2" })
            .set(`.Hero__media:nth-of-type(${prevIndex + 1})`, { border: "unset" })
            .set(details[i], { autoAlpha: 1 })
            .set([...details].filter((_, index) => index !== i), { autoAlpha: 0 });

        // Set video src and current time
        this.videosTl.set(vids[0], { attr: { src: this.data[i].snippet }, currentTime: 0 });

        // Update playhead position
        this.videosTl.set(playHead, {
            x: `${(playHeadStep * (i + 1))}rem`,
            ease: "none",
            delay: delayTime,
        });
    }
}

  navigate(page: string) {}
}
