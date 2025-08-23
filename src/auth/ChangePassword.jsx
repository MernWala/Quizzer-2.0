import { useContext, useState } from "react";
import Spinner from "../components/Spinner";
import Input from "../components/input/Input";
import { TiArrowBack } from "react-icons/ti";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CommonContext from "../context/common/CommonContext";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/slice/client/auth";
import CustomToast from "../components/CustomToast";

const ChangePassword = () => {
  const { handleOnChange } = useContext(CommonContext);
  const [params] = useSearchParams();
  const [formState, setFormState] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = params.get("token");
    if (formState?.pass === formState?.rePass) {
      dispatch(resetPassword({ token, ...formState }))
        .unwrap()
        .then((data) => {
          CustomToast("Success! Redirecting to auth", data?.message, 5000);
          navigate("/auth");
        })
        .catch((err) => {
          if (err?.validationError) {
            err?.error?.forEach((er) => CustomToast(null, er?.msg));
          } else {
            CustomToast("Error", JSON.stringify(err));
          }
        });
    } else {
      CustomToast(null, "Password not matched");
    }
  };

  return (
    <div className="flex justify-center items-stretch min-h-[100vh] bg-purple-flower">
      <div className="w-full flex flex-col p-5 items-center justify-center bg-[#000000a9]">
        <div
          className="rounded-md p-10 pt-5 border border-neutral-50"
          data-aos="fade-up"
          style={{ backdropFilter: "blur(10px" }}
        >
          <div className="mb-5 w-full">
            <span className="text-xl font-semibold text-neutral-50">
              Password Update
            </span>
          </div>

          <form
            className="space-y-4 block min-w-[300px] max-w-[500px]"
            onSubmit={handleResetPassword}
          >
            <Input
              label={"New Password"}
              id={"pass"}
              required={true}
              type={"password"}
              disabled={loading}
              onChange={(e) => handleOnChange(e, setFormState)}
            />

            <Input
              label={"Re-enter Password"}
              id={"rePass"}
              required={true}
              type={"password"}
              disabled={loading}
              onChange={(e) => handleOnChange(e, setFormState)}
            />

            <button
              type="submit"
              className="flex justify-center items-center bg-neutral-900 w-full rounded-md py-2 font-medium uppercase"
              disabled={loading}
            >
              {loading ? (
                <Spinner className={"text-neutral-50 my-1"} />
              ) : (
                <span className="text-white">Update Password</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/auth"
              className="text-neutral-50 inline-flex items-center gap-1 text-sm"
            >
              <TiArrowBack className="text-lg" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
