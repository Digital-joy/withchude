import { motion, usePresence } from "framer-motion"
import gsap from "gsap"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SessionContext, supabase } from "../App"
import Scroll from "../app/classes/scroll"
import { FooterLite } from "../components/Footer"
import Header from "../components/Header"
import Loading from "../components/Loading"
import { NavLite } from "../components/Nav"
import PostPage from "../components/PostPage"
import HideSvg from "../icons/hide"
import ShowSvg from "../icons/show"
import ThreadSvg from "../icons/thread"
import XSvg from "../icons/x"
import FbSvg from "../icons/fb"
import IgSvg from "../icons/ig"
import YoutubeSvg from "../icons/youtube"
import SendSvg from "../icons/send"

export default function DefaultSite() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/")
  }, [])

  return (
    <>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      ></motion.main>
    </>
  )
}

// const conversions = {
//   "Nigeria": "NGN",
//   "United Arab Emirates": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
// }
