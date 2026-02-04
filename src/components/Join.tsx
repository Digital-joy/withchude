import { useRef, useState } from "react";
import SendSvg from "../icons/send";
import { supabase } from "../App";
import gsap from "gsap";
import Loader from "./Loading";

export interface IJoin extends React.ComponentPropsWithoutRef<"section"> {
  onSuccess?: () => void;
}
const Join: React.FC<IJoin> = ({ className, onSuccess, ...sectionProps }) => {
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [showLiked, setShowLiked] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    //function to be carried out when form is submitted
    e.preventDefault();
  }

  return (
    <section className={`Join ${className}`} {...sectionProps}>
      {showLiked !== "" && (
        <div className="Vid__added">
          <p>{showLiked}</p>
        </div>
      )}
      <div className="Join__wrapper">
        <p className="Join__intro">Join our email list</p>
        {/* <h4 className="Join__body">
          Every week, I share videos, quotes, articles and books that have changed my life - and that will strengthen your mental,
          emotional and spiritual health.
        </h4> */}
        <h4 className="Join__body">
          We send special, beautiful newsletters from to time to
          help you smile or get better. If you want to receive them, join our
          mailing list.
        </h4>
        <form
          className="Join__submit"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await supabase
              .from("emails")
              .insert([
                {
                  email: input,
                  name,
                },
              ])
              .then(
                (res) => {
                  setInput("");
                  setName("");
                  let liketimeout;
                  if (res.status === 201) {
                    fetch(`${process.env.SERVER_URL}/email`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: input,
                        name,
                      }),
                    });
                    setShowLiked("You are now in the mailing List");
                    setTimeout(() => {
                      onSuccess && onSuccess();
                    }, 2500);
                  } else if ((res.status = 409)) {
                    setShowLiked("Email already in mailing List");
                    setTimeout(() => {
                      onSuccess && onSuccess();
                    }, 2500);
                  } else {
                    setShowLiked("An Error Occured");
                  }
                  setLoading(false);
                  setDone(true);
                  clearTimeout(liketimeout);
                  liketimeout = setTimeout(() => {
                    gsap.to(".Vid__added", { opacity: 0 });
                    setShowLiked("");
                  }, 2500);
                },
                function (err) {
                  if ((err.status = 409)) {
                    setShowLiked("Email aLready in mailing List");
                  } else {
                    setShowLiked("An Error Occured");
                  }
                  setLoading(false);
                  setInput("");
                }
              );
          }}
        >
          <input
            type="text"
            placeholder="Enter first name"
            value={name}
            required
            onInput={(e) => {
              setName(e.currentTarget.value);
              setDone(false);
            }}
          />
          <input
            type="email"
            placeholder="Enter e-mail address"
            value={input}
            required
            onInput={(e) => {
              setInput(e.currentTarget.value);
              setDone(false);
            }}
          />
          <button data-desktop="">
            <Loader loading={loading}>
              {done ? (
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx={12} cy={12} r={10} fill="white"></circle>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.5 12.5l2 2l5-5"
                    ></path>
                  </g>
                </svg>
              ) : (
                <SendSvg />
              )}
            </Loader>
          </button>
          <button data-mobile="">
            <Loader loading={loading}>
              SUBSCRIBE
              {/* {done ? (
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx={12} cy={12} r={10} fill="white"></circle>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5l2 2l5-5"></path>
                  </g>
                </svg>
              ) : (
                <SendSvg />
              )} */}
            </Loader>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Join;
