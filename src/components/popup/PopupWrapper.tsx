import CloseSvg from "../../icons/close";

export interface IPopupWrapper extends React.ComponentPropsWithoutRef<"aside"> {
  onClose?: () => void;
}

const PopupWrapper: React.FC<IPopupWrapper> = ({
  onClose = () => {},
  className,
  children,
  ...asideProps
}) => {
  return (
    <aside className={`Popup ${className}`} {...asideProps}>
      <div className="" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
      onClick={onClose}
      ></div>
      <div
        className={"Popup__wrapper active"}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button onClick={onClose}>
          <CloseSvg />
        </button>
        {children}
      </div>
    </aside>
  );
};

export default PopupWrapper;
