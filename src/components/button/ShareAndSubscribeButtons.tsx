import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/redux/hooks";
import { setShareShown } from "../../app/redux/reducers/shareSlice";
import SendAltEmoji from "../../icons/send-alt";

export interface IShareAndSubscribeButtons
  extends React.ComponentPropsWithoutRef<"div"> {}

const ShareAndSubscribeButtons: React.FC<IShareAndSubscribeButtons> = ({
  className,
  ...divProps
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className={`share_and_subscribe ${className}`} {...divProps}>
      <button
        className="Share_Button"
        onClick={() => {
          dispatch(setShareShown(true));
        }}
      >
        <span>Share</span>
        <SendAltEmoji />
      </button>
      <Link
        to={"/payment"}
        className="Subscribe_Button"
      >
        <span>Subscribe</span>
        {/* <SendAltEmoji /> */}
      </Link>
    </div>
  );
};

export default ShareAndSubscribeButtons;
