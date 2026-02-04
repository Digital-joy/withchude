import { useContext, useEffect, useRef, useState } from "react";
import CloseSvg from "../../icons/close";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import {
  disableContactDetailsPopup,
  extendContactDetailsPopup,
  markContactDetailsAsCompleted,
  contactDetailsPopupIsShown,
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
import CompleteContactDetails from "../CompleteContactDetails";

export interface IContactDetailsPopup extends IPopupWrapper {}

const ContactDetailsPopup: React.FC<IContactDetailsPopup> = ({
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

  const [user, setUser] = useState<User>();
  const session = useContext(SessionContext);

  useEffect(() => {
    // Check if the popup should be shown
    let shouldShowPopup = contactDetailsPopupIsShown();

    console.log({
      showContact: shouldShowPopup,
      visible: visible
    });
    setUser(session?.user);
    if (session?.user) {
      // setVisible(!session.user.user_metadata.phone_number ? true : false);

      supabase
        .from("users")
        .select("phone_number")
        .eq("id", session.user.id)
        .single()
        .then((res) => {
          console.log("phone res", res);
          if (res.error) {
            shouldShowPopup = false;
          } else {
            shouldShowPopup = res.data.phone_number ? false : shouldShowPopup
          }
        });
    } else {
      shouldShowPopup = false
    }


    setTimeout(() => {
      setVisible(shouldShowPopup);
    }, 15 * 1000);
  }, [session?.user]);


  const handleCompleteContactDetails = () => {
    markContactDetailsAsCompleted();
    setVisible(false);
  };

  const handleSnoozeContactDetails = () => {
    extendContactDetailsPopup(1); // Extend by 1 day
    setVisible(false);
  };

  const handleContactDetailsSubmit = () => {
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
    //   contactDetailsService
    //     .submit(
    //       user?.user_metadata.name ?? "Anonymous",
    //       rating,
    //       user?.id ?? null,
    //       deviceId,
    //       commentRef.current?.value,
    //       activeContactDetails?.uid || null
    //     )
    //     .then((data) => {
    //       setSubmitting(false);
    //       // disableContactDetailsPopup();
    //       handleCompleteContactDetails();
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
        <button onClick={handleSnoozeContactDetails}>
          <CloseSvg />
        </button>

        <CompleteContactDetails
          user={user}
          onSuccess={handleCompleteContactDetails}
        />
      </div>
    </aside>
  );
};

export default ContactDetailsPopup;
