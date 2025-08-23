import CommonContext from "./CommonContext";
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";
import dayjs from "dayjs";
import { useCallback, useRef } from "react";

const CommonState = (props) => {
  const handleOnChange = (() => {
    let timer;
    return (e, setState) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const { name, value } = e.target;
        setState((prev) => {
          if (prev[name] === value) return prev; // no change → skip re-render
          return { ...prev, [name]: value };
        });
      }, 100); // debounce delay in ms
    };
  })();

  const CustomToast = (title, message) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
        >
          <div className="flex-1 w-0 px-4 py-2">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p
              className="mt-1 text-sm text-gray-500"
              style={{ wordWrap: "break-word" }}
            >
              {message}
            </p>
          </div>
          <button
            type="button"
            className="flex border-l border-gray-200 items-center justify-center bg-red-700"
            onClick={() => toast.dismiss(t.id)}
          >
            <IoIosCloseCircle className="text-neutral-50 px-2" size={40} />
          </button>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const customRadioStyle = {
    color: "#ffffff50",
    "&.Mui-checked": {
      color: "#fff",
    },
  };

  const formatFolderData = (data, isSeries = false) => {
    let res = {
      id: data._id,
      name: data.name,
      type: data.quizType,
      isVisible: data.visibility,
      publishDate: dayjs(data.publishOn).format("DD MMM YYYY, h:mm A"),
      totalTime:
        data.totalTime === null
          ? "Unlimited"
          : `${Math.floor(data.totalTime / 60)} mins`,
      totalQuestions: data.questions?.length || 0,
      sectionSwitchAllowed: data.sectionSwitch,
      createdAt: dayjs(data.createdAt).format("DD MMM YYYY, h:mm A"),
      expireDate: data.expireOn
        ? dayjs(data.expireOn).format("DD MMM YYYY")
        : "No Expiry",
      requiresRegistration: data.register !== null,
      enquiryForms: data.enquiry?.length || 0,
      updatedAt: dayjs(data.updatedAt).format("DD MMM YYYY, h:mm A"),
    };

    return isSeries
      ? { isSeries: true, quizes: data?.quizes?.length, ...res }
      : res;
  };

  return (
    <CommonContext.Provider
      value={{
        handleOnChange,
        CustomToast,
        customRadioStyle,
        formatFolderData,
      }}
    >
      {props.children}
    </CommonContext.Provider>
  );
};

export default CommonState;
