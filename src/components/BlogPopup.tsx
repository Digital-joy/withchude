import { useNavigate } from "react-router-dom"
import CharactersSvg from "../icons/characters"
import ShowSvg from "../icons/show"
import SymbolSvg from "../icons/symbol"
import CloseSvg from "../icons/close"
import { FC, useRef, useState } from "react"
import CloudSvg from "../icons/cloud"
import DropSvg from "../icons/drop"
import RightSvg from "../icons/right"
import { CLOUD_NAME, UPLOAD_PRESET, formatFileSize, generateUniqueUploadId } from "../app/utils"
import axios from "axios"

const BlogPopup: FC<{
  Close(): void
  img?: string
  author?: string
  date?: string
  category?: string
  Submit(thumbnail: string, category: string, author: string, date: Date): void
}> = ({ Close = () => {}, Submit = () => {}, img, author: $author, date: $date, category: $category }) => {
  const navigate = useNavigate()

  const uploadFile = async ($file = file) => {
    if (!$file) {
      console.error("Please select a file.")
      return
    }

    const uniqueUploadId = generateUniqueUploadId()
    const chunkSize = 5 * 1024 * 1024
    const totalChunks = Math.ceil($file.size / chunkSize)
    let currentChunk = 0

    const uploadChunk = async (start: number, end: number, file: File) => {
      const formData = new FormData()
      formData.append("file", file.slice(start, end))
      formData.append("cloud_name", CLOUD_NAME)
      formData.append("upload_preset", UPLOAD_PRESET)
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`

      console.log(`Uploading chunk for uniqueUploadId: ${uniqueUploadId}; start: ${start}, end: ${end - 1}`)
      setProgress(start)

      try {
        setUploading(true)

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData, {
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": contentRange,
          },
          onUploadProgress: (p) => {
            setProgress(p.loaded + start)
          },
        })

        console.log(response)

        if (response.statusText !== "OK") {
          throw new Error("Chunk upload failed.")
        }

        currentChunk++

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize
          const nextEnd = Math.min(nextStart + chunkSize, file.size)
          uploadChunk(nextStart, nextEnd, file)
        } else {
          setProgress($file.size)
          setUploadComplete(true)
          setUploading(false)

          const fetchResponse = await response.data
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
    const end = Math.min(chunkSize, $file.size)
    const responseVid = await uploadChunk(start, end, $file)
  }

  const handleVidFileChange = (e) => {
    setUploadingFile(true)
    uploadFile(e.target.files[0])
    setFile(e.target.files[0])
  }

  // drag state
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(img ? true : false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [cldResponse, setCldResponse] = useState<any>({ url: img ?? "" })
  const [file, setFile] = useState<File>(null)
  const [progress, setProgress] = useState(0)
  const category = useRef<HTMLSelectElement>(null)
  const author = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)

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
      setUploadingFile(true)
      uploadFile(e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0])
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <aside className="Popup" onClick={Close}>
      <div
        className="Popup__wrapper"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button onClick={Close}>
          <CloseSvg />
        </button>
        <section className="Signup__form">
          <div className="Upload__form__mid">
            <p>Upload Blog Thumbnail</p>
            {uploadingFile ? (
              <aside>
                <div>
                  <img src={cldResponse.url} alt="" />
                  <article>
                    <h5>{file?.name ?? "Thumbnail"}</h5>
                    <h6>{file?.size && formatFileSize(file?.size)}</h6>
                  </article>
                </div>
                <div
                  onClick={() => {
                    setCldResponse({})
                    setFile(null)
                    setProgress(0)
                    setUploadComplete(false)
                    setUploading(false)
                    setUploadingFile(false)
                  }}
                >
                  <CloseSvg />
                </div>
                <div>
                  <em>
                    <span
                      style={{
                        width: `${
                          isNaN(Math.round((progress / file?.size) * 100)) ? 100 : Math.round((progress / file?.size) * 100)
                        }%`,
                      }}
                    ></span>
                  </em>
                  <p>{`${
                    isNaN(Math.round((progress / file?.size) * 100)) ? 100 : Math.round((progress / file?.size) * 100)
                  }%`}</p>
                </div>
              </aside>
            ) : (
              <label htmlFor="file" onDragEnter={handleDrag}>
                <CloudSvg />
                Drag and drop here or &nbsp;<i>choose file</i>
                {dragActive && (
                  <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>
                )}
              </label>
            )}
            <input type="file" onChange={(e) => handleVidFileChange(e)} accept="image/*" id="file" />
            <p>Blog Author</p>
            <input type="text" placeholder="e.g. Chude Jideonwo" defaultValue={$author ?? "Chude Jideonwo"} ref={author} />
            <p>Blog Tag</p>
            <DropSvg />
            <select name="tags" id="tags" ref={category} defaultValue={$category}>
              <option value="">-Select Option-</option>
              <option value="WILT">WILT</option>
              <option value="Interview">Interview</option>
            </select>
            <p>Publish Date</p>
            <input
              type="date"
              placeholder=""
              ref={date}
              defaultValue={$date ? new Date($date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
            />
            <button
              onClick={() => Submit(cldResponse?.url, category.current.value, author.current.value, date.current.valueAsDate)}
              disabled={uploading}
              className="Upload__submit"
            >
              {uploading ? "Uploading..." : "Upload"}
              <RightSvg />
            </button>
          </div>
        </section>
      </div>
    </aside>
  )
}

export default BlogPopup
