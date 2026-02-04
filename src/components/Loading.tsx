import { PropsWithChildren } from "react"

export default function Loader({ children, loading }: PropsWithChildren<{ loading: boolean }>) {
  return <>{loading ? <i className="loading" /> : children}</>
}

export function Loader2({ children, loading }: PropsWithChildren<{ loading: boolean }>) {
  return <>{loading ? <i className="loading2" /> : children}</>
}

export function VidLoader() {
  return (
    <div className="vid__loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
