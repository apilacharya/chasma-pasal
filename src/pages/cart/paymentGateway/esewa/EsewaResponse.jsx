import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeDataFromBase64 } from "./EsewaCrypto";
import { createOrderApi, updateCartStatusApi } from "../../../../apis/api";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";

const EsewaResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const data = searchParams.get("data");
  const decodedData = decodeDataFromBase64(data);
  const refOnce = useRef(false);
  console.log(decodedData);

  const userId = localStorage.getItem("userId");
  const carts = localStorage.getItem("carts");
  const total = localStorage.getItem("total");
  const address = localStorage.getItem("address");
  const paymentType = localStorage.getItem("paymentType");

  const orderData = {
    userId,
    carts,
    total,
    address,
    paymentType,
  };

  useEffect(() => {
    if (data && userId && carts && total && address && paymentType) {
      const createOrder = () => {
        if (refOnce.current) {
          createOrderApi(orderData)
            .then((res) => {
              if (res.data.success) {
                updateCartStatusApi({ status: "ordered" }).then(
                  (response) => {}
                );
                toast.success("Order placed successfully!");
                navigate("/");
              } else {
                toast.error(res.data.message);
              }
            })
            .catch((err) => {
              // message.error("Server Error");
              console.log("Order creation error:", err.message);
            });
        }
      };

      if (!refOnce.current) {
        refOnce.current = true;
        createOrder();
      }
    }
  }, [data, userId, carts, total, address, paymentType]);

  return (
    <div className='py-5 d-flex justify-content-center align-items-center'>
      <Spinner />
    </div>
  );
};
export default EsewaResponse;
