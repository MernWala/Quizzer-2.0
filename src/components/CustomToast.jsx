import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

export default function (title, message, time = 0) {
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
    { duration: time > 0 ? time : Infinity } // auto-dismiss if time > 0
  );
}
