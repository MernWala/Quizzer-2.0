import { useContext, useEffect, useState } from "react";
import Input from "../components/input/Input";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Spinner from "../components/Spinner";
import CommonContext from "../context/common/CommonContext";
import { useDispatch, useSelector } from "react-redux";
import { attemptAuth } from "../store/slice/client/auth";
import CustomToast from "../components/CustomToast";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const ManualAuth = () => {
  const dispatch = useDispatch();
  const { handleOnChange, customRadioStyle } = useContext(CommonContext);
  const [varient, setVarient] = useState("LOGIN");
  const navigate = useNavigate();

  const toggleVarient = () => {
    if (!loading) {
      setVarient((prev) => {
        return prev === "LOGIN" ? "REGISTER" : "LOGIN";
      });
    }
  };

  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.auth);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(attemptAuth({ varient, formData }))
      .unwrap()
      .then((data) => {
        if (data?.register) {
          CustomToast(
            null,
            "Registration Success! Check your email for verification."
          );
        } else {
          CustomToast(null, "Login Success! Redirecting to dashboard.");
          navigate(`/dashboard/${data?.user?.role}`);
        }
      })
      .catch((err) => {
        if (err?.validationError) {
          err?.error?.forEach((er) => CustomToast(null, er?.msg));
        } else {
          CustomToast(null, err?.message);
        }
      });
  };

  return (
    <div className="flex justify-center items-stretch min-h-[100vh] bg-purple-flower">
      <div className="lg:w-1/2 lg:flex hidden p-5" data-aos="fade-right">
        {/* TODO: Insert a proper graphics and typography stuff */}
      </div>

      <div className="lg:w-1/2 w-full flex flex-col p-5 lg:border-s-2 items-center justify-center bg-[#000000a9]">
        <div
          className="rounded-md p-10 pt-5 border border-neutral-50"
          style={{ backdropFilter: "blur(10px" }}
        >
          <div className="mb-5 w-full" data-aos="fade-right">
            <span className="text-3xl font-bold text-neutral-50">
              {varient}
            </span>
          </div>
          <form
            className="space-y-4 block min-w-[300px] max-w-[500px]"
            onSubmit={handleFormSubmit}
            data-aos="zoom-in"
          >
            <div>
              <RadioGroup
                aria-labelledby="quiz-type-label"
                name="role"
                className="!flex !flex-row !text-white"
                value={formData?.role ?? "client"}
                onChange={(e) => handleOnChange(e, setFormData)}
              >
                {["client", "admin"].map((type, index) => (
                  <FormControlLabel
                    key={index}
                    value={type}
                    control={
                      <Radio
                        sx={customRadioStyle}
                        disabled={loading}
                        className="!py-0"
                      />
                    }
                    label={type.charAt(0).toUpperCase() + type.substring(1)}
                  />
                ))}
              </RadioGroup>
            </div>

            {varient === "REGISTER" && (
              <Input
                label={"Username"}
                id={"name"}
                required={true}
                type={"text"}
                disabled={loading}
                onChange={(e) => handleOnChange(e, setFormData)}
              />
            )}

            <Input
              label={"Email ID"}
              id={"email"}
              required={true}
              type={"text"}
              disabled={loading}
              onChange={(e) => handleOnChange(e, setFormData)}
            />

            <div>
              <Input
                label={"Password"}
                id={"pass"}
                required={true}
                type={"password"}
                disabled={loading}
                autoComplete="current-password"
                className={"mb-1"}
                onChange={(e) => handleOnChange(e, setFormData)}
              />

              {varient === "LOGIN" && (
                <Link
                  to={"/auth/recover"}
                  className="text-sm text-white ps-1 underline"
                >
                  Forgot Password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              className="flex justify-center items-center bg-neutral-900 w-full rounded-md py-2 font-medium uppercase mt-3 cursor-pointer"
            >
              {loading ? (
                <Spinner className={"text-neutral-50 my-1"} />
              ) : (
                <span className="text-white">{varient}</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center" data-aos="zoom-in">
            <button
              type="button"
              className="text-sm font-light text-neutral-50 user-select-none"
              onClick={toggleVarient}
            >
              {varient === "LOGIN" ? (
                <>
                  New user?{" "}
                  <span className="underline cursor-pointer">Register</span>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <span className="underline cursor-pointer">Login</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-7 flex flex-col" data-aos="zoom-in">
            <div className="flex items-center content-center gap-2 mx-auto">
              <p className="m-0 w-[80px] border"></p>
              <span className="text-white text-sm">OR</span>
              <p className="m-0 w-[80px] border"></p>
            </div>

            <div className="mt-7">
              <button
                type="button"
                className="flex bg-neutral-50 items-center justify-center gap-2 py-2 font-medium rounded-md cursor-pointer w-full"
              >
                <FcGoogle className="text-2xl" />{" "}
                <span className="user-select-none">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualAuth;
