import { Link } from "react-router-dom"
import LeftSvg from "../icons/left"
import { PropsWithChildren } from "react"
import { PrismicDocument } from "@prismicio/client"

export default function BlogHero({ document }: PropsWithChildren<{ document: PrismicDocument[] }>) {
  return (
    <section className="BlogHero">
      <div className="BlogHero__wrapper">
        <div className="BlogHero__left">
          <figure>
            <img src={document[0]?.data?.thumbnail?.url?.split("?")[0]} alt="" />
          </figure>
          <div>
            <h4>
              <span></span>
              {document[0]?.data.tag}
            </h4>
            <h3>{document[0]?.data.title[0]?.text}</h3>
            <Link to={"/blog/" + document[0]?.uid}>
              Read Article
              <LeftSvg />
            </Link>
          </div>
        </div>
        <ul className="BlogHero__right">
          <li>
            <div>
              <h4>
                <span></span>
                {document[1]?.data.tag}
              </h4>
              <h3>{document[1]?.data.title[0]?.text}</h3>
              <Link to={"/blog/" + document[1]?.uid}>
                Read Article
                <LeftSvg />
              </Link>
            </div>
          </li>
          <li>
            <div>
              <h4>
                <span></span>
                {document[2]?.data.tag}
              </h4>
              <h3>{document[2]?.data.title[0]?.text}</h3>
              <Link to={"/blog/" + document[2]?.uid}>
                Read Article
                <LeftSvg />
              </Link>
            </div>
          </li>
          <li>
            <div>
              <h4>
                <span></span>
                {document[3]?.data.tag}
              </h4>
              <h3>{document[4]?.data.title[0]?.text}</h3>
              <Link to={"/blog/" + document[3]?.uid}>
                Read Article
                <LeftSvg />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
