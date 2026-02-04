import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { ToastStateProps, setToastProps, setToastShown } from "../app/redux/reducers/toastSlice";
import CloseSvg from "../icons/close";

export interface IToast extends React.ComponentPropsWithoutRef<"div"> {}

export const showToaster = (props: ToastStateProps) => {
  setToastProps(props);
  let action: {
    payload: ToastStateProps | boolean;
    type: "toast/setToastProps" | "toast/setToastShown";
} = setToastProps({...props, show: true})
  if (!props.persist) {
    setTimeout(() => {
      action = setToastShown(false)
    }, props.timeout ?? 2500);
  }
  return action;
}

export const showToasterPromise = (props: ToastStateProps) => {
  const showAction = setToastProps({ ...props, show: true });

  const delayedHideAction = () => {
    return new Promise<{ payload: ToastStateProps | boolean; type: string }>((resolve) => {
      if (!props.persist) {
        setTimeout(() => {
          resolve(setToastShown(false)); // Resolve with the hide action
        }, props.timeout ?? 2500);
      } else {
        resolve(null); // No action if persist is true
      }
    });
  };

  return { showAction, delayedHideAction };
};

export const closeToaster = () => {
  return setToastShown(false)
}
const Toast: React.FC<IToast> = ({ className, style, ...divProps }) => {
  const dispatch = useAppDispatch();
  const toastProps = useAppSelector((state) => state.toast);
  const toastRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = useCallback(() => {
    if (toastRef.current) {
      console.log("opening", toastProps);
      gsap
        .timeline({
          onComplete: () => {
            console.log("persist should be true", toastProps);
          },
        })
        .to(toastRef.current, { opacity: 1, display: "flex" });
    }
  }, []);
  const handleClose = useCallback(() => {
    console.log("closing", toastProps);
    if (toastRef.current) {
      gsap
        .timeline({
          onComplete: () => {
            dispatch(setToastShown(false));
          },
        })
        // .to(mapRef.current, { duration: 1, x: '-50%' })
        .to(toastRef.current, { opacity: 0, display: "none" });
    }
  }, []);

  // useEffect(() => {
  //   toastProps.show ? handleOpen() : handleClose();
  // }, [toastProps.show]);

  // useEffect(() => {
  //   handleClose();
  // }, []);

  return (
    <div
      ref={toastRef}
      className={`global-toast ${className}`}
      style={{ display: toastProps.show ? 'flex' : "none", opacity: toastProps.show ? 1 : "auto", ...style }}
      {...divProps}
    >
      <p>{toastProps.message}</p>
      <button onClick={handleClose}>
        <CloseSvg />
      </button>
    </div>
  );
};

export default Toast;
