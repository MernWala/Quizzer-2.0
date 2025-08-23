import React, { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Drawer, Tooltip } from "@mui/material";
import { AiOutlineLogout } from "react-icons/ai";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { GoDotFill } from "react-icons/go";
import { TbMessageReportFilled } from "react-icons/tb";
import { IoIosHelpCircle } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { LuChevronsLeft } from "react-icons/lu";
import SidebarItem from "./SidebarItem";
import { GrOverview } from "react-icons/gr";
import { FaChartPie, FaFolderOpen } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import CustomToast from "../CustomToast";
import { useAuthCheck } from "../../hooks/useAdminAuth";
import { logoutUser } from "../../store/slice/client/auth";
import { fetchAllQuizzes, getQuiz } from "../../store/slice/admin/quiz";
import { fetchAllSeries } from "../../store/slice/admin/series";

const DashboardLayoutWraper = () => {
  const [sidebar, setSidebar] = useState(false);

  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logoutLoading } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      CustomToast(null, "Logout successful.", 3000);
      navigate("/");
    }

    if (logoutUser.rejected.match(resultAction)) {
      const errData = resultAction.payload;
      CustomToast("Error", errData?.message || "Logout failed");
    }
  };

  const { loading, isAuthenticated, role } = useAuthCheck();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated === true && role === "admin") {
      dispatch(fetchAllQuizzes());
      dispatch(fetchAllSeries());
    } else {
      console.log("throw back");
    }
  }, [dispatch, isAuthenticated]);

  // getQuiz
  const [breadcrumbData, setBreadcrumbData] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    switch (true) {
      case pathname.includes("/dashboard/admin/quiz"):
        console.log("Quiz");
        break;
      case pathname.includes("/dashboard/admin/series"):
        console.log("Series");
        break;
      case pathname.includes("/dashboard/admin/analyze"):
        console.log("Analyze");
        break;
      case pathname.includes("/dashboard/admin"):
        console.log("Overview");
        break;
      default:
        console.log("Default");
    }
  }, [pathname]);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? (
    <React.Fragment>
      <Drawer
        open={sidebar}
        onClose={() => setSidebar(false)}
        className="backdrop-brightness-50"
        sx={{ "& .MuiDrawer-paper": { backgroundColor: "#111827" } }}
      >
        <div className="min-w-80 relative h-full flex flex-col">
          <div className="sticky top-0 bg-gray-900 shadow-md">
            <button
              type="button"
              onClick={() => setSidebar(false)}
              className="absolute right-0 mt-6 rounded-s-full py-1 px-2 text-white text-opacity-50 hover:text-opacity-100 bg-gray-800 transition-all hover:transition-all"
            >
              <LuChevronsLeft size={30} />
            </button>

            <div className="px-5 pt-3 pb-2 border-b border-gray-800">
              <Link
                to={"/"}
                className="inline-flex title-font font-medium items-center text-white"
              >
                <img src="/logo192.png" alt="Quizzer Logo" width={60} />
                <span className="ml-3 text-xl">Quizzer</span>
              </Link>
            </div>
          </div>

          <div className="py-5 px-3 max-h-[calc(100vh-84px-88px)] overflow-auto">
            <ul>
              {/* <SidebarItem to={"/"} hasChild={true} title='Dropwown Menu'>
                <SubMenuItem to="/1"> Child - 1 </SubMenuItem>
                <SubMenuItem to="/2"> Child - 2 </SubMenuItem>
                <SubMenuItem to="/3"> Child - 3 </SubMenuItem>
              </SidebarItem> */}

              <SidebarItem
                onClick={() => setSidebar(false)}
                to={"/dashboard/admin"}
              >
                Overview
              </SidebarItem>
              <SidebarItem
                onClick={() => setSidebar(false)}
                to={"/dashboard/admin/quiz"}
              >
                Quiz
              </SidebarItem>
              <SidebarItem
                onClick={() => setSidebar(false)}
                to={"/dashboard/admin/series"}
              >
                Series
              </SidebarItem>
              <SidebarItem
                onClick={() => setSidebar(false)}
                to={"/dashboard/admin/analyze"}
              >
                Analysis
              </SidebarItem>
              <SidebarItem
                onClick={() => {
                  setSidebar(false);
                  handleLogout();
                }}
                to={"/dashboard/admin"}
                className={
                  "border-red-500/50 hover:bg-red-500/50 hover:border-red-500/50 !text-red-500  hover:!text-white"
                }
              >
                Logout
              </SidebarItem>
            </ul>
          </div>

          <div className="mt-auto px-3 py-4 absolute bottom-0 w-full">
            <div className="flex items-end p-2 bg-gray-800 rounded-md">
              <div className="flex items-center gap-3 w-full">
                <Tooltip title={user?.name} placement="top">
                  <span className="text-white text-lg font-medium text-truncate max-w-[100%] select-none">
                    {user?.name}
                  </span>
                </Tooltip>
                <Link
                  to="/settings"
                  className="ms-auto bg-gray-800 hover:bg-gray-700 transition-colors hover:transition-colors p-2 text-white rounded-full"
                >
                  <Tooltip title="Account Settings">
                    <IoSettings size={20} />
                  </Tooltip>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <div className="fixed top-0 h-14 bg-gray-900 text-white flex z-50 w-full">
        <div className="flex w-full">
          <div className="h-14 w-14 flex-shrink-0 bg-gray-950 md:hidden block">
            <Tooltip title={"Expand Sidebar"} placement="right">
              <button
                type="button"
                onClick={() => setSidebar(true)}
                className="h-full w-full flex items-center justify-center text-white cursor-pointer text-xl text-opacity-50 hover:text-opacity-100"
              >
                <span>
                  <HiMiniBars3CenterLeft />
                </span>
              </button>
            </Tooltip>
          </div>
          <div className="w-[calc(100vw-3.5rem)] flex items-center flex-[1]">
            <div className="lg:w-1/2 w-full flex lg:justify-start justify-center ps-4 lg:pe-0 pe-4">
              <span className="font-medium text-lg tracking-wider text-truncate block w-full">
                {"breadcrumb goes here"}
              </span>
            </div>

            <div className="w-1/2 lg:flex hidden items-center justify-end">
              <span className="flex items-center justify-center font-medium text-sm user-select-none">
                <span>
                  {(dateTime.getHours() % 12 || 12).toString().padStart(2, "0")}
                  :{dateTime.getMinutes().toString().padStart(2, "0")}
                  <span className="ms-1">
                    {dateTime.getHours() >= 12 ? "PM" : "AM"}
                  </span>
                </span>
                <span className="mx-1">
                  <GoDotFill size={10} />
                </span>
                <span>
                  {weekDays[dateTime.getDay()]},{" "}
                  {monthsNames[dateTime.getMonth()]} {dateTime.getDate()}
                </span>
              </span>

              <div className="flex gap-2 mx-4">
                <Tooltip title={"Help"}>
                  <Link
                    to={"/contact"}
                    className="hover:bg-gray-800 p-2 rounded-full text-xl text-white text-opacity-50 hover:text-opacity-100"
                  >
                    <IoIosHelpCircle />
                  </Link>
                </Tooltip>

                <Tooltip title={"Report Problem"}>
                  <Link
                    to={"/report-problem"}
                    className="hover:bg-gray-800 p-2 rounded-full text-xl text-white text-opacity-50 hover:text-opacity-100"
                  >
                    <TbMessageReportFilled />
                  </Link>
                </Tooltip>

                <Link
                  to="/settings"
                  className="hover:bg-gray-800 p-2 rounded-full text-xl text-white text-opacity-50 hover:text-opacity-100"
                >
                  <Tooltip title={"Account settings"}>
                    <IoSettings size={20} />
                  </Tooltip>
                </Link>
              </div>

              <div className="h-14 w-14 bg-gray-950 flex-shrink-0">
                <Tooltip title={"Signout"}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="h-full w-full flex items-center justify-center text-white cursor-pointer text-xl text-opacity-50 hover:text-opacity-100"
                  >
                    <span>
                      {logoutLoading ? (
                        <Spinner className={"text-neutral-50 my-1"} />
                      ) : (
                        <AiOutlineLogout />
                      )}
                    </span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-14 min-h-full w-14 bg-gray-900 z-50 md:block hidden border-t border-gray-700">
        <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-auto">
          <Tooltip title={"Overview"} placement="right">
            <Link
              to="/dashboard/admin"
              className="h-14 w-full flex items-center justify-center text-white text-xl hover:bg-gray-700 shrink-0"
            >
              <span>
                <GrOverview />
              </span>
            </Link>
          </Tooltip>
          <Tooltip title={"Quiz"} placement="right">
            <Link
              to="/dashboard/admin/quiz"
              className="h-14 w-full flex items-center justify-center text-white text-xl hover:bg-gray-700 shrink-0"
            >
              <span>
                <FaFolderOpen />
              </span>
            </Link>
          </Tooltip>
          <Tooltip title={"Series"} placement="right">
            <Link
              to="/dashboard/admin/series"
              className="h-14 w-full flex items-center justify-center text-white text-xl hover:bg-gray-700 shrink-0"
            >
              <span>
                <FaFolderTree />
              </span>
            </Link>
          </Tooltip>
          <Tooltip title={"Analysis"} placement="right">
            <Link
              to="/dashboard/admin/analyze"
              className="h-14 w-full flex items-center justify-center text-white text-xl hover:bg-gray-700 shrink-0"
            >
              <span>
                <FaChartPie />
              </span>
            </Link>
          </Tooltip>
        </div>
      </div>

      <div className="absolute mt-14 md:ms-14 top-0 left-0 min-w-[calc(100%-3.5rem)] md:w-[calc(100%-3.5rem)] w-full min-h-[calc(100vh-3.5rem)]">
        <div className="bg-gray-800 w-full text-white min-h-[inherit]">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  ) : (
    <Navigate to="/auth" />
  );
};

export default DashboardLayoutWraper;
