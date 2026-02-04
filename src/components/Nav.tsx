import { FC } from "react"
import { Link } from "react-router-dom"

export const NavLite: FC<{ page: string, pageLink?: string }> = ({ page, pageLink }) => {
  return (
    <div className="NavLite">
      <Link to={"/"}>WithChude</Link>/{pageLink ? <Link to={pageLink}>{page}</Link> : page}
    </div>
  )
}

export const NavLiteBlog: FC<{ page1: string; page2: string }> = ({ page1, page2 }) => {
  return (
    <div className="NavLite">
      <Link to={"/"}>WithChude</Link> <Link to={"/" + page1.toLowerCase()}>/{page1}</Link> /{page2}
    </div>
  )
}

export const AdminNavLite: FC<{ page: string }> = ({ page }) => {
  return (
    <div className="NavLite">
      <Link to={"/admin"}>Admin</Link>/{page}
    </div>
  )
}
