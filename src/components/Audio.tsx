import VidForward from "/public/images/vidForward.svg?raw"
import VidRewind from "/public/images/vidRewind.svg?raw"
import VidAdd from "/public/images/vidadd.svg?raw"
import VidComments from "/public/images/vidcomment.svg?raw"
import VidPause from "/public/images/vidpause.svg?raw"
import VidPlay from "/public/images/vidplay.svg?raw"
import VidShare from "/public/images/vidshare.svg?raw"
import VidVol0 from "/public/images/vidvol0.svg?raw"
import VidVol1 from "/public/images/vidvol1.svg?raw"
import VidVol2 from "/public/images/vidvol2.svg?raw"
import VidVol3 from "/public/images/vidvol3.svg?raw"

import gsap from "gsap"
import React, { FC, useState } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import { openTwitterWindow } from "../app/utils"
import CloseSvg from "../icons/close"
import ShareFbSvg from "../icons/sharefb"
import ShareTikSvg from "../icons/sharetik"
import ShareXSvg from "../icons/sharex"

const Audio: FC<{
  options: { autoplay: boolean; sources: string }
  podcast: any
  onReady?: any
}> = ({ options, onReady, podcast }) => {
  const videoRef = React.useRef(null)
  const playerRef = React.useRef(null)

  const [showDesc, setShowDesc] = useState(false)
  const [showLiked, setShowLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [Copy, setCopy] = useState(false)

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js")

      videoElement.classList.add("vjs-big-play-centered")
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready")
        onReady && onReady(player)
      }))

      player.isAudio(true)

      document.querySelector(".vjs-volume-panel button").innerHTML = `${VidVol0} ${VidVol1} ${VidVol2} ${VidVol3} `
      document.querySelector(".vjs-skip-backward-10").innerHTML = VidRewind
      document.querySelector(".vjs-skip-forward-10").innerHTML = VidForward
      document.querySelector(".vjs-big-play-button").innerHTML = VidPlay
      document.querySelector(".vjs-play-control").innerHTML = `${VidPlay} ${VidPause}`
      player.one("loadedmetadata", () => {
        console.log(player.duration())
        var duration = player.duration()
        if (duration === Infinity) {
          document.querySelector(".vjs-play-progress .vjs-time-tooltip").setAttribute("data-length", `-`)
          return
        }
        var mzminutes = Math.floor(duration / 60)
        var mzseconds = Math.floor(duration - mzminutes * 60)
        console.log(mzminutes + ":" + mzseconds)
        document
          .querySelector(".vjs-play-progress .vjs-time-tooltip")
          .setAttribute(
            "data-length",
            `${mzminutes < 10 ? "0" + mzminutes : mzminutes}` + ":" + `${mzseconds < 10 ? "0" + mzseconds : mzseconds}`
          )
        // console.log(`Duration of Video ${duration}`)
      })
      player.one("durationchange", () => {
        console.log(player.duration())
        var duration = player.duration()
        if (duration === Infinity) {
          document.querySelector(".vjs-play-progress .vjs-time-tooltip").setAttribute("data-length", `-`)
          return
        }
        var mzminutes = Math.floor(duration / 60)
        var mzseconds = Math.floor(duration - mzminutes * 60)
        console.log(mzminutes + ":" + mzseconds)
        if (document.querySelector(".vjs-play-progress .vjs-time-tooltip"))
          document
            .querySelector(".vjs-play-progress .vjs-time-tooltip")
            .setAttribute(
              "data-length",
              `${mzminutes < 10 ? "0" + mzminutes : mzminutes}` + ":" + `${mzseconds < 10 ? "0" + mzseconds : mzseconds}`
            )
      })

      const vidadd = document.createElement("figure")
      let liketimeout
      vidadd.onclick = () => {
        setShowLiked((val) => {
          if (!val) {
            clearTimeout(liketimeout)
            liketimeout = setTimeout(() => {
              gsap.to(".Vid__added", { opacity: 0 })
            }, 1000)
          }
          return !val
        })
        vidadd.classList.toggle("liked")
      }
      vidadd.className = "Vid__add"
      vidadd.innerHTML = VidAdd

      const vidcomments = document.createElement("figure")
      vidcomments.className = "Vid__comments"
      vidcomments.onclick = () => setShowComments(true)
      vidcomments.innerHTML = VidComments

      const vidshare = document.createElement("figure")
      vidshare.className = "Vid__share"
      vidshare.onclick = () => setShowShare(true)
      vidshare.innerHTML = VidShare

      const vidtagWrapper = document.createElement("div")
      vidtagWrapper.className = "vidtagWrapper"
      vidtagWrapper.onclick = () => setShowDesc(!showDesc)
      const vidtag = document.createElement("div")
      const vidname = document.createElement("h3")
      vidname.textContent = podcast?.title
      vidtag.append(vidname)
      vidtagWrapper.append(vidtag)

      document.querySelector(".vjs-control-bar").append(vidadd, vidshare, vidcomments, vidtagWrapper)

      const vid = document.querySelector(".Aud__wrapper") as unknown as HTMLElement
      let timeout = 0
      vid.onmousemove = function () {
        clearTimeout(timeout)
        timeout = window.setTimeout(() => {
          player.userActive(false)
        }, 2000)
      }
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      if (player.src() === options.sources) return
      player.src(options.sources)
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player className="Aud__wrapper">
      <div ref={videoRef} />
      {showShare && (
        <div className="Vid__Share__wrapper">
          <div className="Vid__Share">
            <h4>Share this</h4>
            <figure onClick={() => setShowShare(false)}>
              <CloseSvg />
            </figure>
            <div>
              {/* <i
                  onClick={(e) => {
                    e.preventDefault()
                  const text = podcast?.title?.replaceAll("#", "%23")
                    const link = window.location.href.split("?")[0] + "?q=" + podcast?.uid
                    openTwitterWindow(text, link)
                  }}
                >
                  <ShareIgSvg />
                </i> */}
              <i
                onClick={(e) => {
                  e.preventDefault()
                  const text = podcast?.title?.replaceAll("#", "%23")
                  const link = window.location.href.split("?")[0] + "?q=" + podcast?.uid
                  openTwitterWindow(text, link)
                }}
              >
                <ShareXSvg />
              </i>
              <i
                onClick={(e) => {
                  e.preventDefault()
                  const text = podcast?.title?.replaceAll("#", "%23")
                  const link = window.location.href.split("?")[0] + "?q=" + podcast?.uid
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${text} ${link}`, "_blank").focus()
                }}
              >
                <ShareFbSvg />
              </i>
              <i
                onClick={(e) => {
                  e.preventDefault()
                  const text = podcast?.title?.replaceAll("#", "%23")
                  const link = window.location.href.split("?")[0] + "?q=" + podcast?.uid
                  window.open(`https://wa.me/?text=${text} ${link}`, "_blank").focus()
                }}
              >
                <ShareTikSvg />
              </i>
            </div>
            ?{" "}
            <p>
              <i>{window.location.href.split("?")[0] + "?q=" + podcast?.uid}</i>
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  await navigator.clipboard.writeText(window.location.href.split("?")[0] + "?q=" + podcast.uid)
                  setCopy(true)
                }}
              >
                {Copy ? (
                  <svg className="svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx={12} cy={12} r={10}></circle>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5l2 2l5-5"></path>
                    </g>
                  </svg>
                ) : (
                  "Copy"
                )}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Audio
