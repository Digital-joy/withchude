import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../App"
import Scroll from "../app/classes/scroll"
import { AdminHeader } from "../components/Header"
import { AdminNavLite } from "../components/Nav"
import CommentSvg from "../icons/comment"
import DropSvg from "../icons/drop"
import WriteSvg from "../icons/write"
import ClockSvg from "../icons/clock"

const url = "https://api.cloudinary.com/v1_1/hzxyensd5/image/upload"
const CLOUD_NAME = "dllm7gfit"
const UPLOAD_PRESET = "v0vneg9h"

function figure(cash: number) {
  let cashE: number | string = cash
  if (cash >= 1e3) {
    cashE = (cash / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
  }
  if (cash >= 1e6) {
    cashE = (cash / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (cash >= 1e9) {
    cashE = (cash / 1e9).toFixed(1).replace(/\.0$/, "") + "B"
  }
  return cashE
}

export default function AdminBlog() {
  const [imgFile, setImgFile] = useState(null)
  const [vidFile, setVidFile] = useState(null)
  const [vidSnippetFile, setVidSnippetFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [cldResponse, setCldResponse] = useState(null)

  const episode = useRef<HTMLInputElement>(null)
  const title = useRef<HTMLInputElement>(null)

  const handleImgFileChange = (event) => {
    setImgFile(event.target.files[0])
  }

  const handleVidFileChange = (event) => {
    setVidFile(event.target.files[0])
  }

  const handleVidSnippetFileChange = (event) => {
    setVidSnippetFile(event.target.files[0])
  }

  const uploadFile = async () => {
    if (!vidFile || !imgFile) {
      console.error("Please select a file.")
      return
    }

    const uniqueUploadId = generateUniqueUploadId()
    const chunkSize = 5 * 1024 * 1024
    const totalChunks = Math.ceil(vidFile.size / chunkSize)
    let currentChunk = 0

    const uploadChunk = async (start, end, file) => {
      const formData = new FormData()
      formData.append("file", file.slice(start, end))
      formData.append("cloud_name", CLOUD_NAME)
      formData.append("upload_preset", UPLOAD_PRESET)
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`

      console.log(`Uploading chunk for uniqueUploadId: ${uniqueUploadId}; start: ${start}, end: ${end - 1}`)

      try {
        setUploading(true)
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": contentRange,
          },
        })

        if (!response.ok) {
          throw new Error("Chunk upload failed.")
        }

        currentChunk++

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize
          const nextEnd = Math.min(nextStart + chunkSize, file.size)
          uploadChunk(nextStart, nextEnd, file)
        } else {
          setUploadComplete(true)
          setUploading(false)

          const fetchResponse = await response.json()
          setCldResponse(fetchResponse)
          console.info("File upload complete.")
          return fetchResponse
        }
      } catch (error) {
        console.error("Error uploading chunk:", error)
        setUploading(false)
      }
    }

    const start = 0
    const end = Math.min(chunkSize, vidFile.size)
    const responseVid = await uploadChunk(start, end, vidFile)
    const start2 = 0
    const end2 = Math.min(chunkSize, vidSnippetFile.size)
    const responseVidSnippet = await uploadChunk(start2, end2, vidSnippetFile)
    const start3 = 0
    const end3 = Math.min(chunkSize, imgFile.size)
    const responseImg = await uploadChunk(start3, end3, imgFile)

    UploadToSupabase({
      url: responseVid.playback_url,
      snippet: responseVidSnippet.playback_url,
      thumbnail: responseImg.url,
      episode: episode.current.value,
      title: title.current.value,
    })
  }

  const generateUniqueUploadId = () => {
    return `uqid-${Date.now()}`
  }

  async function UploadToSupabase({ title = "", url = "", thumbnail = "", snippet = "", episode = "" }) {
    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          url,
          thumbnail,
          snippet,
          episode,
          comments: [],
        },
      ])
      .select()

    const { data: data2 } = await supabase.from("blogs").select()
    setBlogs(data2)
  }

  // drag state
  const [dragActive, setDragActive] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadingVideo(true)
      console.log(e.dataTransfer.files[0])
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  }

  const [search, setSearch] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [scroll, setScroll] = useState(-1)
  const [blogs, setBlogs] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    supabase
      .from("blogs")
      .select()
      .neq("content", "")
      .neq("title", "")
      .then((data) => {
        setBlogs(data.data)
        setFiltered(
          data.data.sort(function (a, b) {
            if (a.published < b.published) {
              return 1
            }
            if (a.published > b.published) {
              return -1
            }
            return 0
          })
        )
      })
  }, [])

  useEffect(() => {
    if (filterBy === "newest") {
      setFiltered(
        blogs.slice().sort(function (a, b) {
          if (a.published < b.published) {
            return 1
          }
          if (a.published > b.published) {
            return -1
          }
          return 0
        })
      )
    }
    if (filterBy === "oldest") {
      setFiltered(
        blogs.slice().sort(function (a, b) {
          if (a.published < b.published) {
            return -1
          }
          if (a.published > b.published) {
            return 1
          }
          return 0
        })
      )
    }
    if (filterBy === "popular") {
      setFiltered(
        blogs.slice().sort(function (a, b) {
          if (a.reads < b.reads) {
            return 1
          }
          if (a.reads > b.reads) {
            return -1
          }
          return 0
        })
      )
    }
    if (filterBy === "least") {
      setFiltered(
        blogs.slice().sort(function (a, b) {
          if (Number(a.reads) < Number(b.reads)) {
            return -1
          }
          if (Number(a.reads) > Number(b.reads)) {
            return 1
          }
          return 0
        })
      )
    }
    if (filterBy === "alpha") {
      setFiltered(
        blogs.slice().sort(function (a, b) {
          if (a.title < b.title) {
            return -1
          }
          if (a.title > b.title) {
            return 1
          }
          return 0
        })
      )
    }
  }, [filterBy])

  useEffect(() => {
    window.$scroll = new Scroll("noscroll")
  }, [])

  return (
    <>
      <div className="app preloading" id="smooth-wrapper">
        <div className="__app" id="smooth-content">
          <div className="content" id="content" data-template="admin">
            <AdminHeader>
              <div className="Nav__links">
                <Link className={location.pathname.includes("videos") ? "Nav__link active" : "Nav__link"} to="/admin/videos">
                  Videos
                </Link>
                <Link className={location.pathname.includes("podcasts") ? "Nav__link active" : "Nav__link"} to="/admin/podcasts">
                  Podcasts
                </Link>
                <Link className={location.pathname.includes("users") ? "Nav__link active" : "Nav__link"} to="/admin/users">
                  Users
                </Link>
                <Link className={location.pathname.includes("blogs") ? "Nav__link active" : "Nav__link"} to="/admin/blogs">
                  Blogs
                </Link>
                <Link to={"/admin/blogs/new"} className="Admin__cta">
                  <WriteSvg />
                  <span>Write New Article</span>
                </Link>
              </div>
            </AdminHeader>
            <main>
              <div className="__admin __blog" id="admin">
                <AdminNavLite page="Blogs" />
                {blogs && (
                  <div className="Upload__others">
                    <div className="Upload__others__wrapper">
                      <form action="">
                        <div>
                          <label htmlFor="">Search for article</label>
                          <input
                            type="text"
                            placeholder="Enter  title..."
                            value={search}
                            onInput={(e) => setSearch(e.currentTarget.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="">Sort</label>
                          <DropSvg />
                          <select name="tags" id="tags" onChange={(e) => setFilterBy(e.currentTarget.value)}>
                            <option value="newest">Date (Newest to Oldest)</option>
                            <option value="oldest">Date (Oldest to Newest)</option>
                            <option value="popular">Reads (More to Less)</option>
                            <option value="least">Reads (Less to More)</option>
                            <option value="alpha">Alphabetically</option>
                          </select>
                        </div>
                      </form>
                      <div className="Upload__others__head">
                        <p>Name</p>
                        <p>Reads</p>
                        <p>Published</p>
                      </div>
                      <div
                        className="Upload__others__body"
                        data-lenis-prevent=""
                        onScroll={(e) => {
                          setScroll(e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight))
                        }}
                      >
                        {filtered
                          .filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()))
                          .map((blog) => (
                            <Link to={blog.uid} key={blog.uid}>
                              <p>
                                <img src={blog.thumbnail} alt="" />
                                <span> {blog.title}</span>
                              </p>
                              <p>
                                <CommentSvg />
                                {figure(blog.reads) ?? 0}
                              </p>
                              <p>
                                <ClockSvg />
                                {new Date(blog.published).toLocaleDateString("en-GB")}
                              </p>
                            </Link>
                          ))}
                      </div>
                      {scroll !== -1 && (
                        <div className="Upload__others__track">
                          <div
                            className="Upload__others__bar"
                            style={{
                              height: `${100 / blogs.length}%`,
                              top: `${(100 - 100 / blogs.length) * scroll}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
