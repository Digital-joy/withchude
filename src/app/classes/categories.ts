import gsap from "gsap"
import { Rive, Layout, Fit } from "@rive-app/canvas"

export default class $Categories {
  videosTl: gsap.core.Timeline
  constructor(page: string) {
    this.create(page)
  }

  create(page: string) {
    document.querySelectorAll(".Categories__list li").forEach((el, index) => {
      this.createItem(index)
    })
  }

  createItem(i: number) {
    return
    const $canvas = document.getElementById(`categories${i}`) as unknown as HTMLCanvasElement
    const r = new Rive({
      src: "/categories.riv",
      canvas: $canvas,
      autoplay: false,
      artboard: `${i}`,
      layout: new Layout({ fit: Fit.Cover }),
      stateMachines: "bumpy",
      animations: "Timeline 2",
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas()
        r.pause("Timeline 1")
      },
    })

    window.addEventListener(
      "resize",
      () => {
        r.resizeDrawingSurfaceToCanvas()
      },
      false
    )

    const parent = $canvas.parentElement

    const tl = gsap.timeline({ paused: true }).fromTo(parent, { scale: 1 }, { scale: 1 })
    parent.onmouseenter = async () => {
      await tl.reverse()
      tl.play()
      r.play("Timeline 2")
    }
    parent.onmouseleave = async () => {
      await tl.play()
      tl.reverse()
      r.play("Timeline 1")
    }
  }

  navigate(page: string) {}
}
