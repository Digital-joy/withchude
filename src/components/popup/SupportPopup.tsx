import { useEffect, useRef, useState } from "react";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import {
  disableSupportPopup,
  supportPopupDisabled,
} from "../../app/helpers/date-utils";
import RightSvg from "../../icons/right";
import { useAppDispatch } from "../../app/redux/hooks";
import { PrismicRichText, useSinglePrismicDocument } from "@prismicio/react";
import { PrismicDocument } from "@prismicio/client";

export interface ISupportPopup extends IPopupWrapper {
  actionText?: string;
  document?: PrismicDocument;
}

const SupportPopup: React.FC<ISupportPopup> = ({
  document,
  actionText = "Proceed",
  onClose,
  className,
  children,
  ...popupProps
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if the popup should be shown
    const shouldShowPopup = !supportPopupDisabled();
    setVisible(shouldShowPopup);
  }, []);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const handlePopupDisable = () => {
    disableSupportPopup();
    setVisible(false);
  };

  if (!visible || !document) return null;

  return (
    <PopupWrapper
      onClose={handleClose}
      className={`Popup Support_Popup ${className}`}
      {...popupProps}
    >
      <section className="Support_Popup__wrapper Signup__form">
        <div className="Support_Popup__heading">
          {/* <h1>Contribute</h1> */}
          <h1>Contribute</h1>
        </div>

        <div className="Support_Popup__content support__body__left">
          <PrismicRichText field={document.data.content} />
          {/* <p style={{ fontSize: "2rem" }}>
            Use coupon code WITHCHUDELIVE to get a 25% discount on your
            subscription today only and don&apos;t miss out on all the other
            amazing interviews, documentaries, podcasts and so much more only on
            withchude.com
          </p> */}
        </div>

        <div className="Support_Popup__action_panel">
          <button
            type="button"
            onClick={handleClose}
            className="survey__cta"
            style={{ color: "white" }}
          >
            {actionText}
            {/* <RightSvg /> */}
          </button>
          <button
            type="button"
            onClick={handlePopupDisable}
            className="survey__cta later"
          >
            {"Skip"}
          </button>
        </div>
      </section>
    </PopupWrapper>
  );
};

export default SupportPopup;
