import { useContext, useEffect, useRef, useState } from "react";
import CloseSvg from "../../icons/close";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import {
  disableSurveyPopup,
  extendSurveyPopup,
  markSurveyAsCompleted,
  surveyPopupIsShown,
} from "../../app/helpers/date-utils";
import StarAltIcon from "../../icons/star-alt";
import RightSvg from "../../icons/right";
import { getDeviceId } from "../../app/utils";
import { surveyService } from "../../app/services/supabse";
import { User } from "@supabase/supabase-js";
import { SessionContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/redux/hooks";
import {
  setToastProps,
  setToastShown,
} from "../../app/redux/reducers/toastSlice";

export interface ISurveyPopup extends IPopupWrapper {}

const SurveyPopup: React.FC<ISurveyPopup> = ({
  onClose,
  className,
  children,
  ...popupProps
}) => {
  const dispatch = useAppDispatch();
  const activeSurvey = useAppSelector((state) => state.survey.activeSurvey);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const session = useContext(SessionContext);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Check if the popup should be shown
    const shouldShowPopup = surveyPopupIsShown();

    setTimeout(() => {
      setVisible(shouldShowPopup);
    }, 30 * 1000)
  }, []);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  const handleCompleteSurvey = () => {
    markSurveyAsCompleted();
    setVisible(false);
  };

  const handleSnoozeSurvey = () => {
    extendSurveyPopup(7); // Extend by 7 days
    setVisible(false);
  };

  const handleSurveySubmit = () => {
    setSubmitting(true);
    dispatch(
      setToastProps({
        message: "Submitting...",
        show: true,
        persist: true,
      })
    );
    const deviceId = getDeviceId();
    try {
      surveyService
        .submit(
          user?.user_metadata.name ?? "Anonymous",
          rating,
          user?.id ?? null,
          deviceId,
          commentRef.current?.value,
          activeSurvey?.uid || null
        )
        .then((data) => {
          setSubmitting(false);
          disableSurveyPopup();
          handleCompleteSurvey();
          dispatch(
            setToastProps({
              message: "Review submitted. Thank you for your feedback!",
              show: true,
              persist: false,
              timeout: 3000,
            })
          );
        })
        .catch((e) => {
          setSubmitting(false);
          setToastShown(false);
        });
      // if (result.error) {
      //   console.log(result.error) // Update state to show error
      // }
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (!visible || (activeSurvey && !activeSurvey.enabled)) return null;

  return (
    <PopupWrapper
      onClose={handleSnoozeSurvey}
      className={`Popup Survey_Popup ${className}`}
      {...popupProps}
    >
      <section className="Signup__form">
        <h1>Kindly let us know</h1>
        <p>{activeSurvey.question}</p>

        <div className="rating">
          {[1, 2, 3, 4, 5].map((number, i) => (
            <StarAltIcon
              className="star"
              pathFill={rating && number <= rating ? "#f8a519" : undefined}
              onClick={() => {
                setRating(number);
              }}
            />
          ))}
        </div>
        <form>
          <label htmlFor="">Additional Comment (optional)</label>
          <textarea placeholder="Start typing here..." ref={commentRef} />
          <div className="action_panel">
            <button
              type="button"
              onClick={handleSurveySubmit}
              disabled={submitting}
              className="survey__cta"
              style={{ color: "white" }}
            >
              {submitting ? "Submitting..." : "Submit"}
              <RightSvg />
            </button>
            <button
              type="button"
              onClick={handleSnoozeSurvey}
              disabled={submitting}
              className="survey__cta later"
            >
              {"Remind me later"}
            </button>
          </div>
        </form>
      </section>
    </PopupWrapper>
  );
};

export default SurveyPopup;
