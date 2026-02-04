export default class Nav {
  elements: HTMLElement[]
  pages: {
    home: string
    // longPage: string
  }
  titles: {
    home: string
    // "long-page": string
  }
  constructor() {
    this.create()
    this.pages = {
      home: "",
      // longPage: "long-page",
    }
    this.titles = {
      home: "",
      // "long-page": "",
    }
  }

  create() {
    window.addEventListener("popstate", this.back.bind(this))

    this.elements = window.$$("a[nav]")
    this.elements.forEach((element, index) => {
      if (innerWidth < 760) return
      element.onclick = async (e) => {
        e.preventDefault()
        const target = e.target as HTMLAnchorElement
        await this.ready(target.href, true)
      }
    })
  }

  resize() {}
  destroy() {}

  navigate() {
    this.create()
  }

  async ready(href: string, push = true) {}

  async go({ target }) {
    const { href } = target
    const request = await fetch(href)
    if (request.ok) {
      const html = await request.text()
      const div = document.createElement("div")
      div.innerHTML = html
      const content = div.querySelector(".content")
      const template = content.getAttribute("data-template")
      return [content.innerHTML, template]
    } else {
      console.log(`could not fetch ${href}`)
    }
  }

  async back() {
    if (innerWidth < 760) return
    location.reload()
  }

  menuOpen() {}

  async menuClose() {}
}
