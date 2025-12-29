import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { GoCheckCircleFill } from "react-icons/go";
import { verifyAccount } from "../../store/slice/client/auth";
import CustomToast from "../../components/CustomToast"

const AccountVerify = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, verifyStatus, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = params.get("token");
    const accountVerify = params.get("accountVerify");

    if (token && accountVerify === "true") {
      dispatch(verifyAccount(token)).then((res) => {
        if (verifyAccount.fulfilled.match(res)) {
          CustomToast("Success", res.payload.message, 5000);
          setTimeout(() => {
            navigate("/auth", { replace: true });
          }, 3000);
        } else {
          CustomToast("Error", res.payload.message);
        }
      });
    }
  }, [dispatch, params, CustomToast, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-purple-flower">
      {loading && (
        <div
          className="flex items-center justify-center bg-[#00000080] p-4 rounded-md"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <span className="text-lg text-white font-medium tracking-wide flex items-center gap-2 justify-center">
            Verifying Account <Spinner />
          </span>
        </div>
      )}

      {verifyStatus === "success" && !loading && (
        <div
          className="flex items-center justify-center bg-[#00000080] p-4 rounded-md"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <span className="text-lg text-white font-medium tracking-wide flex items-center gap-2 justify-center">
            Account Verified <GoCheckCircleFill />
          </span>
        </div>
      )}

      {verifyStatus === "error" && !loading && (
        <div
          className="md:w-1/2 w-11/12 mt-5 flex items-center justify-center bg-[#00000080] p-4 rounded-md"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <span className="text-lg text-white font-medium tracking-wide flex items-center gap-2 justify-center text-center">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default AccountVerify;
