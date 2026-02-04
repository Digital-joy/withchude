import { PrismicDocument } from "@prismicio/client"
import { PropsWithChildren, useEffect, useState } from "react"
import Scroll from "../../app/classes/scroll"
import BlogHero from "../../components/BlogHero"
import BlogSection from "../../components/BlogSection"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Join from "../../components/Join"
import { NavLite } from "../../components/Nav"
import { Searcher } from "../../components/Searcher"

export default function Updates({ document }: PropsWithChildren<{ document: PrismicDocument[] }>) {
  useEffect(() => {
    if (!document) return
    window.$scroll = new Scroll("blog")
  }, [document])

  const [Search, setSearch] = useState("")

  if (!document) return <></>

  return (
    <>
      <div className="app preloading" id="smooth-wrapper">
        <div className="__app" id="smooth-content">
          <div className="content" id="content" data-template="blog">
            <Header />
            <main>
              <div className="__blog" id="blog" style={{ height: "unset" }}>
                <NavLite page="Blog" />
                <Searcher text="Search for an article..." input={Search} setInput={setSearch} />
                {Search === "" && (
                  <BlogHero
                    document={document.sort(
                      (a, b) => new Date(b.data.publish_date).getTime() - new Date(a.data.publish_date).getTime()
                    )}
                  />
                )}
                <BlogSection
                  title={Search === "" ? "Explore all" : `Search Results for '${Search}'`}
                  document={document
                    .sort((a, b) => new Date(b.data.publish_date).getTime() - new Date(a.data.publish_date).getTime())
                    .filter((x) => x.data?.title[0]?.text.toLowerCase()?.includes(Search?.toLowerCase()))}
                  type="update"
                />
                <button className="blog__more"></button>
                <Join />
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
