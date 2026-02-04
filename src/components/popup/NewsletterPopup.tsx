import { useContext, useEffect, useRef, useState } from "react";
import CloseSvg from "../../icons/close";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import {
  disableNewsletterPopup,
  extendNewsletterPopup,
  markNewsletterAsCompleted,
  newsletterPopupIsShown,
} from "../../app/helpers/date-utils";
import StarAltIcon from "../../icons/star-alt";
import RightSvg from "../../icons/right";
import { getDeviceId } from "../../app/utils";
import { User } from "@supabase/supabase-js";
import { SessionContext, supabase } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/redux/hooks";
import {
  setToastProps,
  setToastShown,
} from "../../app/redux/reducers/toastSlice";
import Join from "../Join";

export interface INewsletterPopup extends IPopupWrapper {}

const NewsletterPopup: React.FC<INewsletterPopup> = ({
  onClose,
  className,
  children,
  ...popupProps
}) => {
  const dispatch = useAppDispatch();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const session = useContext(SessionContext);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Check if the popup should be shown
    let shouldShowPopup = newsletterPopupIsShown();

    console.log({
      showContact: shouldShowPopup,
      visible: visible,
    });
    setUser(session?.user);
    if (session?.user) {
      // setVisible(!session.user.user_metadata.phone_number ? true : false);

      supabase
        .from("emails")
        .select("email")
        .eq("email", session.user.email)
        .single()
        .then((res) => {
          console.log("phone res", res);
          if (res.data) {
            shouldShowPopup = false;
          }
        });
    }

    setTimeout(() => {
      setVisible(shouldShowPopup);
    }, 10 * 1000);
  }, []);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  const handleCompleteNewsletter = () => {
    markNewsletterAsCompleted();
    setVisible(false);
  };

  const handleSnoozeNewsletter = () => {
    extendNewsletterPopup(7); // Extend by 7 days
    setVisible(false);
  };

  const handleNewsletterSubmit = () => {
    setSubmitting(true);
    dispatch(
      setToastProps({
        message: "Submitting...",
        show: true,
        persist: true,
      })
    );
    const deviceId = getDeviceId();
    // try {
    //   newsletterService
    //     .submit(
    //       user?.user_metadata.name ?? "Anonymous",
    //       rating,
    //       user?.id ?? null,
    //       deviceId,
    //       commentRef.current?.value,
    //       activeNewsletter?.uid || null
    //     )
    //     .then((data) => {
    //       setSubmitting(false);
    //       // disableNewsletterPopup();
    //       handleCompleteNewsletter();
    //       dispatch(
    //         setToastProps({
    //           message: "Review submitted. Thank you for your feedback!",
    //           show: true,
    //           persist: false,
    //           timeout: 3000,
    //         })
    //       );
    //     })
    //     .catch((e) => {
    //       setSubmitting(false);
    //       setToastShown(false);
    //     });
    // } catch (error) {
    //   setSubmitting(false);
    // }
  };

  if (!visible) return null;

  console.log({
    visible,
  });

  return (
    <aside className={`Newsletter__Popup ${className}`} {...popupProps}>
      <div className="Newsletter__Popup__Wrapper">
        <button onClick={handleSnoozeNewsletter}>
          <CloseSvg />
        </button>

        <Join onSuccess={handleCompleteNewsletter} />
      </div>
    </aside>
  );
};

export default NewsletterPopup;
