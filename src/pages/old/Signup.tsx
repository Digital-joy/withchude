import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowSvg from "../../icons/show";
import CharactersSvg from "../../icons/characters";
import SymbolSvg from "../../icons/symbol";
import { Helmet } from "react-helmet-async";

export default function Signup() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sign up | WithChude</title>
      </Helmet>
      <div className="app preloading" id="smooth-wrapper">
        <div className="__app" id="smooth-content">
          <div className="content" id="content" data-template="signup">
            <main>
              <div className="__signup" id="signup">
                <section className="Signup__form">
                  <img src="/images/logo.png" alt="" className="Nav__logo" />
                  <h1>Create an account.</h1>
                  <p>Gain access to all videos for $8.99/mo.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      navigate("/watch");
                    }}
                  >
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      value="Goodness Urama"
                    />
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your e-mail"
                      value="goody@503.studio"
                    />
                    <label htmlFor="password">
                      Password
                      <div className="Signup__password__show">
                        <ShowSvg />
                      </div>
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Create a password"
                      value="gya7781981!452688"
                    />

                    <div className="Signup__password__restrict">
                      <CharactersSvg />
                      <i>
                        Must be at least <span>8 characters</span>.
                      </i>
                    </div>
                    <div className="Signup__password__restrict">
                      <SymbolSvg />
                      <i>
                        Must include a <span>number</span> or{" "}
                        <span>special character (! . # &)</span>.
                      </i>
                    </div>
                    <button className="Signup__submit__primary" type="submit">
                      Create Account
                    </button>
                    <button className="Signup__submit__secondary" type="submit">
                      <img src="/images/google.svg" alt="" />
                      Sign up with Google
                    </button>
                  </form>
                </section>
                <section className="Signup__illustration"></section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
