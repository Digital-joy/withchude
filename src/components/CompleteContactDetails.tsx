import { useRef, useState } from "react";
import SendSvg from "../icons/send";
import { supabase } from "../App";
import gsap from "gsap";
import Loader from "./Loading";
import { User } from "@supabase/supabase-js";
import { AllCountries } from "./Country";
import { formatPhoneNumber } from "../app/utils";

export interface ICompleteContactDetails
  extends React.ComponentPropsWithoutRef<"section"> {
  user: User;
  onSuccess?: () => void;
}
const CompleteContactDetails: React.FC<ICompleteContactDetails> = ({
  user,
  className,
  onSuccess,
  ...sectionProps
}) => {
  const [input, setInput] = useState("");
  const [country, setCountry] = useState<string>(null);
  // const [name, setName] = useState("")
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
        <p className="Join__intro">Complete Details</p>
        <h4 className="Join__body">
          {`Congrats! You are part of the tribe, please enter your number to stay connected.`}
        </h4>
        <form
          className="Join__submit"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const formattedPhonNumber = formatPhoneNumber(
              input,
              country ?? ("NG" as any)
            );
            await supabase
              .from("users")
              .update({ phone_number: formattedPhonNumber })
              .eq("id", user.id)
              .then(
                (res) => {
                  setInput("");
                  // setName("")
                  let liketimeout;

                  if (res.error) {
                    setShowLiked(res.error.message);
                    setTimeout(() => {
                      onSuccess && onSuccess();
                    }, 2500);
                  } else {
                    setShowLiked("Phone number updated");
                  }
                  // if (res.status === 201) {
                  //   fetch(`${process.env.SERVER_URL}/phone`, {
                  //     method: "POST",
                  //     headers: {
                  //       "Content-Type": "application/json",
                  //     },
                  //     body: JSON.stringify({
                  //       phone: input,
                  //       name,
                  //     }),
                  //   })
                  //   setShowLiked("You are now in the mailing List")
                  //   setTimeout(() => {
                  //     onSuccess && onSuccess();
                  //   }, 2500)
                  // } else if ((res.status = 409)) {
                  //   setShowLiked("Email already in mailing List")
                  //   setTimeout(() => {
                  //     onSuccess && onSuccess();
                  //   }, 2500)
                  // } else {
                  //   setShowLiked("An Error Occured")
                  // }
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
                    setShowLiked("Phone number already updated");
                  } else {
                    setShowLiked("An Error Occured");
                  }
                  setLoading(false);
                  setInput("");
                }
              );
          }}
        >
          {/* <input
            type="text"
            placeholder="Enter first name"
            value={name}
            required
            onInput={(e) => {
              setName(e.currentTarget.value)
              setDone(false)
            }}
          /> */}
          <select
            onChange={(e) => {
              setCountry(e.currentTarget.value);
              setDone(false);
            }}
          >
            <option>Select Country</option>
            {AllCountries.countries.map((ctry, i) => (
              <option value={ctry.value} selected={user && user.user_metadata.country == ctry.value }>{ctry.label}</option>
            ))}
          </select>
          <input
            type="tel"
            placeholder="Enter phone number"
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
              SAVE DETAILS
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

export default CompleteContactDetails;
