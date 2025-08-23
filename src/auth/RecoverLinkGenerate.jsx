import { useContext, useState } from "react";
import Spinner from "../components/Spinner";
import Input from "../components/input/Input";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";
import CommonContext from "../context/common/CommonContext";
import CustomToast from "../components/CustomToast";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset } from "../store/slice/client/auth";

const RecoverLinkGenerate = () => {
  const { handleOnChange } = useContext(CommonContext);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(formData))
      .unwrap()
      .then(() => {
        CustomToast(null, "Please check your registred email.", 5000);
      })
      .catch((err) => {
        CustomToast(null, JSON.stringify(err));
      });
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
              Account Recovery
            </span>
          </div>

          <form
            className="space-y-4 block min-w-[300px] max-w-[500px]"
            onSubmit={handleFormSubmit}
          >
            <Input
              label={"Email ID"}
              id={"email"}
              required={true}
              type={"text"}
              disabled={loading}
              onChange={(e) => handleOnChange(e, setFormData)}
            />

            <button
              type="submit"
              className="flex justify-center items-center bg-neutral-900 w-full rounded-md py-2 font-medium uppercase"
            >
              {loading ? (
                <Spinner className={"text-neutral-50 my-1"} />
              ) : (
                <span className="text-white">Send Recovery Link</span>
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

export default RecoverLinkGenerate;
