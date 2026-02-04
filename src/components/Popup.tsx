import { useNavigate, useSearchParams } from "react-router-dom"
import CharactersSvg from "../icons/characters"
import ShowSvg from "../icons/show"
import SymbolSvg from "../icons/symbol"
import CloseSvg from "../icons/close"
import { FC, useEffect, useMemo, useState } from "react"
import { supabase } from "../App"
import HideSvg from "../icons/hide"
import OtpInput from "react-otp-input"
import gsap from "gsap"
import Loading, { Loader2 } from "../components/Loading"
import Countdown from "react-countdown"
import { activityService } from "../app/services/supabse"

const Popup: FC<{ Close(): void; Next?(): void }> = ({ Close = () => {}, Next = () => {} }) => {
  const navigate = useNavigate()
  const [hasAccount, setHasAccount] = useState(true)
  const [show, setShow] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingG, setLoadingG] = useState(false)

  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const [showLiked, setShowLiked] = useState("")

  const $date = useMemo(() => Date.now() + 10000 * 6 * 5, [showOTP])

  return (
    <aside className="Popup" onClick={Close}>
      <div
        className={hasAccount ? "Popup__wrapper active" : "Popup__wrapper"}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button onClick={Close}>
          <CloseSvg />
        </button>

        {showLiked !== "" && (
          <div className="Vid__added">
            <p>{showLiked}</p>
          </div>
        )}

        {showOTP ? (
          <section className="Signup__form">
            <h1>Confirm OTP</h1>
            <p>A 6 digit OTP has been sent to {Email}</p>
            <form
              onSubmit={async (e) => {
                setLoading(true)
                e.preventDefault()
                const { data: data2, error: error2 } = await supabase.auth.verifyOtp({ email: Email, token: otp, type: "email" })
                if (error2) {
                  setShowLiked(error2?.message?.replace("Token", "OTP"))
                  let liketimeout
                  clearTimeout(liketimeout)
                  liketimeout = setTimeout(() => {
                    gsap.to(".Vid__added", { opacity: 0 })
                    setShowLiked("")
                  }, 2500)
                } else {
                  const { error } = await supabase.auth.signInWithPassword({
                    email: Email,
                    password: Password,
                  })

                  if (!error) {
                    setShowLiked("Welcome, " + Name)
                    let liketimeout
                    clearTimeout(liketimeout)
                    liketimeout = setTimeout(() => {
                      // Next()
                      gsap.to(".Vid__added", { opacity: 0 })
                      setShowLiked("")
                      // Close()
                      navigate("/payment")
                    }, 2500)
                  }
                }
                setLoading(false)
              }}
            >
              <label htmlFor="name">Name</label>
              <input type="text" id="$name" placeholder="Enter your name" required value={Name} readOnly />
              <label htmlFor="email">E-mail</label>
              <input type="email" id="$email" placeholder="Enter your e-mail" required value={Email} readOnly />
              <label htmlFor="password">
                Password
                <div className="Signup__password__show" onClick={() => setShow(!show)}>
                  {show ? <HideSvg /> : <ShowSvg />}{" "}
                </div>
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                required
                value={Password}
                readOnly
              />
              <label htmlFor="">OTP</label>
              <OtpInput value={otp} onChange={setOtp} numInputs={6} inputType="number" renderInput={(props) => <input {...props} />} />
              <button
                className="Signup__submit__primary"
                type="submit"
                style={{
                  filter: `grayscale(${otp.length > 5 ? 0 : 1})`,
                  pointerEvents: otp.length > 5 ? "auto" : "none",
                }}
              >
                <Loading loading={loading}>Confirm Signup</Loading>
              </button>
              <h6>
                <Countdown
                  date={$date}
                  zeroPadTime={2}
                  renderer={({ minutes, seconds, completed }) => {
                    if (completed) {
                      // Render a completed state
                      return (
                        <i
                          onClick={async (e) => {
                            const { error } = await supabase.auth.resend({
                              type: "signup",
                              email: Email,
                            })
                            setShowLiked("We’ve sent an OTP to your email address")
                            setOtp("")

                            let liketimeout
                            clearTimeout(liketimeout)
                            liketimeout = setTimeout(() => {
                              gsap.to(".Vid__added", { opacity: 0 })
                              setShowLiked("")
                            }, 2500)
                          }}
                        >
                          Resend OTP
                        </i>
                      )
                    } else {
                      // Render a countdown
                      return (
                        <span style={{ pointerEvents: "auto", filter: "grayscale(0.5)", textDecoration: "unset" }}>
                          Expires in {minutes}:{("0" + seconds.toString()).slice(-2)}
                        </span>
                      )
                    }
                  }}
                ></Countdown>
              </h6>
            </form>
          </section>
        ) : showReset ? (
          <section className="Signup__form">
            <h1>Confirm OTP</h1>
            <p>A 6 digit OTP has been sent to {Email}</p>
            <form
              onSubmit={async (e) => {
                setLoading(true)
                e.preventDefault()
                const { data: data2, error: error2 } = await supabase.auth.verifyOtp({
                  email: Email,
                  token: otp,
                  type: "recovery",
                })

                if (error2) {
                  setShowLiked(error2?.message?.replace("Token", "OTP"))
                  let liketimeout
                  clearTimeout(liketimeout)
                  liketimeout = setTimeout(() => {
                    gsap.to(".Vid__added", { opacity: 0 })
                    setShowLiked("")
                  }, 2500)
                } else {
                  const { data, error } = await supabase.auth.updateUser({ password: Password })

                  if (!error) {
                    setShowLiked("Welcome back, " + data.user.user_metadata.name)
                    let liketimeout
                    clearTimeout(liketimeout)
                    liketimeout = setTimeout(() => {
                      Next()
                      gsap.to(".Vid__added", { opacity: 0 })
                      setShowLiked("")
                      Close()
                    }, 2500)
                  }
                }
                setLoading(false)
              }}
            >
              <p>{Email}</p>
              <label htmlFor="password">
                Enter New Password
                <div className="Signup__password__show" onClick={() => setShow(!show)}>
                  {show ? <HideSvg /> : <ShowSvg />}{" "}
                </div>
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Enter New password"
                required
                value={Password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <div className="Signup__password__restrict" style={{ display: Password.length > 7 ? "none" : "flex" }}>
                <CharactersSvg />
                <i>
                  Must be at least <span>8 characters</span>.
                </i>
              </div>
              <div
                className="Signup__password__restrict"
                style={{
                  display: /[@_!#$%^&*()<>?/|}{~:]/.test(Password) || /\d/.test(Password) ? "none" : "flex",
                }}
              >
                <SymbolSvg />
                <i>
                  Must include a <span>number</span> or <span>special character (! . # &)</span>.
                </i>
              </div>
              <label htmlFor="">Password Reset OTP</label>
              <OtpInput value={otp} onChange={setOtp} numInputs={6} inputType="number" renderInput={(props) => <input {...props} />} />
              <button
                className="Signup__submit__primary"
                type="submit"
                style={{
                  filter: `grayscale(${otp.length > 5 ? 0 : 1})`,
                  pointerEvents: otp.length > 5 ? "auto" : "none",
                }}
              >
                <Loading loading={loading}>Reset Password</Loading>
              </button>
              <h6>
                <Countdown
                  date={$date}
                  zeroPadTime={2}
                  renderer={({ minutes, seconds, completed }) => {
                    if (completed) {
                      // Render a completed state
                      return (
                        <i
                          onClick={async (e) => {
                            const { error } = await supabase.auth.resend({
                              type: "signup",
                              email: Email,
                            })
                            setShowLiked("We’ve sent an OTP to your email address")
                            setOtp("")

                            let liketimeout
                            clearTimeout(liketimeout)
                            liketimeout = setTimeout(() => {
                              gsap.to(".Vid__added", { opacity: 0 })
                              setShowLiked("")
                            }, 2500)
                          }}
                        >
                          Resend OTP
                        </i>
                      )
                    } else {
                      // Render a countdown
                      return (
                        <span style={{ pointerEvents: "auto", filter: "grayscale(0.5)", textDecoration: "unset" }}>
                          Expires in {minutes}:{("0" + seconds.toString()).slice(-2)}
                        </span>
                      )
                    }
                  }}
                ></Countdown>
              </h6>
            </form>
          </section>
        ) : hasAccount ? (
          <section className="Signup__form">
            <h1>Login to your account.</h1>
            <p>Log in to continue watching and listening.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: Email,
                  password: Password,
                })

                if (!error) {
                  setShowLiked("Welcome")
                  let liketimeout
                  clearTimeout(liketimeout)
                  liketimeout = setTimeout(() => {
                    Next()
                    gsap.to(".Vid__added", { opacity: 0 })
                    setShowLiked("")
                    Close()
                  }, 2500)

                  activityService.logSignIn();
                } else {
                  setShowLiked(error.message)
                  let liketimeout
                  clearTimeout(liketimeout)
                  liketimeout = setTimeout(() => {
                    gsap.to(".Vid__added", { opacity: 0 })
                    setShowLiked("")
                  }, 2500)
                }

                setLoading(false)
              }}
            >
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="$email"
                placeholder="Enter your e-mail"
                required
                value={Email}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
              <label htmlFor="password">
                Password
                <div className="Signup__password__show" onClick={() => setShow(!show)}>
                  {show ? <HideSvg /> : <ShowSvg />}{" "}
                </div>
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                required
                value={Password}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <em
                onClick={async () => {
                  console.log(Email, Email.includes("@"))
                  if (!Email.includes("@")) {
                    setShowLiked("Enter a valid email address")
                  } else {
                    const { data, error } = await supabase.auth.resetPasswordForEmail(Email)
                    setShowLiked("We’ve sent an OTP to your email address")
                    setShowReset(true)
                  }
                  let liketimeout
                  clearTimeout(liketimeout)
                  liketimeout = setTimeout(() => {
                    gsap.to(".Vid__added", { opacity: 0 })
                    setShowLiked("")
                  }, 2500)
                  setLoading(false)
                }}
              >
                Forgot Password?
              </em>
              <button className="Signup__submit__primary" type="submit">
                <Loading loading={loading}>Continue</Loading>
              </button>
              <button
                className="Signup__submit__secondary"
                type="button"
                disabled={false}
                onClick={async () => {
                  setLoadingG(true)
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: window.location.href,
                      // redirectTo: 'http://localhost:5173'
                    },
                  })
                }}
              >
                <Loader2 loading={loadingG}>
                  <img src="/images/google.svg" alt="" />
                  Sign in with Google
                </Loader2>
              </button>
              <h6 onClick={() => setHasAccount(!hasAccount)}>Don't have an account? Signup</h6>
            </form>
          </section>
        ) : (
          <section className="Signup__form">
            <h1>Create an account.</h1>
            <p>Gain access to full episodes of all our interviews, films, series, documentaries, and podcasts</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                let country = "unknown"
                let countryCode = "unknown"
                try {
                  const ip = await fetch("http://ip-api.com/json/?fields=status,message,country,countryCode")
                  const json = await ip.json()
                  country = json.country
                  countryCode = json.countryCode
                } catch {
                  country = "unknown"
                }
                const { data, error } = await supabase.auth.signUp({
                  email: Email,
                  password: Password,
                  options: {
                    data: {
                      name: Name,
                      subscription: "none",
                      location: country,
                      countryCode: countryCode,
                      time: 0,
                      videos: [],
                      podcasts: [],
                      likes: [],
                      later: [],
                    },
                  },
                })
                const userAlreadyExists = !data.user?.identities[0]
                const confirmationSent = !!data.user?.confirmation_sent_at

                if(error && error.message) {
                  setShowLiked(error.message)
                } else if (userAlreadyExists) {
                  // set state to userExistsErrorState
                  setShowLiked("User already exists!")
                } else if (confirmationSent) {
                  setShowLiked("We’ve sent an OTP to your email address")
                  setShowOTP(true)
                } else {
                  // set state to registeredState
                }

                let liketimeout
                clearTimeout(liketimeout)
                liketimeout = setTimeout(() => {
                  gsap.to(".Vid__added", { opacity: 0 })
                  setShowLiked("")
                }, 2500)
                setLoading(false)

                // const { data: user, error: error2 } = await supabase.auth.admin.updateUserById(data.user.id, {
                //   email_confirm: true,
                // })
              }}
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="$name"
                placeholder="Enter your name"
                required
                value={Name}
                onInput={(e) => setName(e.currentTarget.value)}
                style={{ borderColor: Name.length > 1 ? "" : "#be342e" }}
              />
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="$email"
                placeholder="Enter your e-mail"
                required
                value={Email}
                onInput={(e) => setEmail(e.currentTarget.value)}
                style={{
                  borderColor: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(Email) ? "" : "#be342e",
                }}
              />
              <label htmlFor="password">
                Password
                <div className="Signup__password__show" onClick={() => setShow(!show)}>
                  {show ? <HideSvg /> : <ShowSvg />}{" "}
                </div>
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                required
                value={Password}
                onInput={(e) => setPassword(e.currentTarget.value)}
                style={{
                  borderColor: /[@_!#$%^&*()<>?/|}{~:]/.test(Password) || /\d/.test(Password) ? "" : "#be342e",
                }}
              />
              <div className="Signup__password__restrict" style={{ display: Password.length > 7 ? "none" : "flex" }}>
                <CharactersSvg />
                <i>
                  Must be at least <span>8 characters</span>.
                </i>
              </div>
              <div
                className="Signup__password__restrict"
                style={{
                  display: /[@_!#$%^&*()<>?/|}{~:]/.test(Password) || /\d/.test(Password) ? "none" : "flex",
                }}
              >
                <SymbolSvg />
                <i>
                  Must include a <span>number</span> or <span>special character (! . # &)</span>.
                </i>
              </div>
              <button
                className="Signup__submit__primary"
                type="submit"
                style={{
                  filter: `grayscale(${
                    (/[@_!#$%^&*()<>?/|}{~:]/.test(Password) || /\d/.test(Password)) &&
                    Password.length > 7 &&
                    Name.length > 1 &&
                    Email.length > 5
                      ? 0
                      : 1
                  })`,
                  pointerEvents:
                    (/[@_!#$%^&*()<>?/|}{~:]/.test(Password) || /\d/.test(Password)) &&
                    Password.length > 7 &&
                    Name.length > 1 &&
                    Email.length > 5
                      ? "auto"
                      : "none",
                }}
              >
                <Loading loading={loading}>Create Account</Loading>
              </button>
              <button
                className="Signup__submit__secondary"
                type="button"
                disabled={false}
                onClick={async () => {
                  setLoadingG(true)
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `https://withchude.com/payment`,
                    },
                  })
                }}
              >
                <Loader2 loading={loadingG}>
                  <img src="/images/google.svg" alt="" />
                  Sign up with Google
                </Loader2>
              </button>
              <h6 onClick={() => setHasAccount(!hasAccount)}>Have an account? Login</h6>
            </form>
          </section>
        )}
      </div>
    </aside>
  )
}

export default Popup
