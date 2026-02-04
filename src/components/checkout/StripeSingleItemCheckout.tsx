import { useState } from "react";
import { Link } from "react-router-dom";
import { paymentService } from "../../app/services/supabse";
import Loading from "../Loading";

export interface IStripeSingleItemCheckout
  extends React.ComponentPropsWithoutRef<"div"> {
  price_id: string;
}

const StripeSingleItemCheckout: React.FC<IStripeSingleItemCheckout> = ({
  price_id,
  className,
  children,
  ...popupProps
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   setUser(session?.user);
  // }, [session?.user]);

  const handlePaymentSession = async () => {
    setLoading(true);
    await paymentService
      .createSingleItemCheckoutSession(price_id, quantity)
      .then(({ data, error }) => {
        if (data) {
          location.href = data.url;
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <div className={`checkout ${className}`} {...popupProps}>
      <div className="quantity">
        <button
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          aria-label="button for remove product"
          className="minus"
          disabled={quantity < 0 && true}
        >
          <svg
            className="fill-current"
            width="16"
            height="2"
            viewBox="0 0 16 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M-8.548e-08 0.977778C-3.82707e-08 0.437766 0.437766 3.82707e-08 0.977778 8.548e-08L15.0222 1.31328e-06C15.5622 1.36049e-06 16 0.437767 16 0.977779C16 1.51779 15.5622 1.95556 15.0222 1.95556L0.977778 1.95556C0.437766 1.95556 -1.32689e-07 1.51779 -8.548e-08 0.977778Z"
              fill=""
            />
          </svg>
        </button>

        <span className="" x-text="quantity">
          {quantity}
        </span>

        <button
          onClick={() => setQuantity(quantity + 1)}
          aria-label="button for add product"
          className="plus"
        >
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.08889 0C8.6289 2.36047e-08 9.06667 0.437766 9.06667 0.977778L9.06667 15.0222C9.06667 15.5622 8.6289 16 8.08889 16C7.54888 16 7.11111 15.5622 7.11111 15.0222L7.11111 0.977778C7.11111 0.437766 7.54888 -2.36047e-08 8.08889 0Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 7.91111C4.72093e-08 7.3711 0.437766 6.93333 0.977778 6.93333L15.0222 6.93333C15.5622 6.93333 16 7.3711 16 7.91111C16 8.45112 15.5622 8.88889 15.0222 8.88889L0.977778 8.88889C0.437766 8.88889 -4.72093e-08 8.45112 0 7.91111Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <button
        className="order"
        onClick={handlePaymentSession}
        disabled={loading}
      >
        <Loading loading={loading}>Order Now</Loading>
      </button>
    </div>
  );
};

export default StripeSingleItemCheckout;
