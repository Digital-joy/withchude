import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Scroll from "../../app/classes/scroll"
import { AdminHeader } from "../../components/Header"
import TipTap from "../../components/TipTap"
import WriteSvg from "../../icons/write"
import { supabase } from "../../App"
import BlogPopup from "../../components/BlogPopup"

export default function Upload() {
  useEffect(() => {
    window.$scroll = new Scroll("noscroll")
  }, [])

  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  async function UploadToSupabase(thumbnail: string, category: string, author: string, date: Date) {
    console.log(date, {
      thumbnail: thumbnail,
      category: category,
      title,
      content: note,
      author: author ?? "Chude Jideonwo",
      published: date.toISOString(),
      reads: 0,
    })
    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          thumbnail: thumbnail ?? "",
          category: category,
          title,
          content: note,
          author: author ?? "Chude Jideonwo",
          published: date.toISOString(),
          reads: 0,
        },
      ])
      .select()

    const { data: data2 } = await supabase.from("blogs").select()
    // setBlogs(data2)
    navigate("/admin/blogs")
  }

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
                <button
                  className="Admin__cta"
                  onClick={() => {
                    setShowPopup(true)
                    // UploadToSupabase()
                  }}
                >
                  <WriteSvg />
                  <span>Publish</span>
                </button>
              </div>
            </AdminHeader>
            <main>
              <div className="__admin __blog" id="admin">
                <TipTap title={title} setTitle={setTitle} note={note} setNote={setNote} />
              </div>
            </main>
          </div>
          {showPopup && (
            <BlogPopup
              Close={() => {
                setShowPopup(false)
              }}
              Submit={(...props) => UploadToSupabase(...props)}
            />
          )}
        </div>
      </div>
    </>
  )
}
