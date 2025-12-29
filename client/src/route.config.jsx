import { createHashRouter, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./utils/404";
import ManualAuth from "./pages/auth/ManualAuth";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RecoverLinkGenerate from "./pages/auth/RecoverLinkGenerate";
import ChangePassword from "./pages/auth/ChangePassword";
import AccountVerify from "./pages/auth/AccountVerify";
import PublicQuizzes from "./pages/PublicQuizzes";
import TermsConditions from "./pages/legal_pages/TermsConditions";
import PrivacyPolicy from "./pages/legal_pages/PrivacyPolicy";
import AdminDashboardOverview from "./dashboard/admin/overview/Page";
import AdminDashboardQuiz from "./dashboard/admin/quiz/Page";
import AdminQuizDetails from "./dashboard/admin/quiz/Details";
import AdminDashboardSeries from "./dashboard/admin/series/Page";
import AdminSeriesDetails from "./dashboard/admin/series/SeriesDetails";
import AdminDashboardAnalysis from "./dashboard/admin/analysis/Page";
import GenralHeaderFooter from "./components/layout/GenralHeaderFooter";
import ClientDashboardLayoutWraper from "./components/layout/ClientDashboardLayoutWraper";
import AdminDashboardLayoutWraper from "./components/layout/AdminDashboardLayoutWraper";
import AccountSettings from "./pages/AccountSettings";
import ReportProblem from "./pages/ReportProblem";

const GeneralLayout = () => (
  <GenralHeaderFooter>
    <ScrollToSection />
    <Outlet />
  </GenralHeaderFooter>
);

const ClientDashboardLayout = () => (
  <ClientDashboardLayoutWraper>
    <Outlet />
  </ClientDashboardLayoutWraper>
);

const AdminDashboardLayout = () => (
  <AdminDashboardLayoutWraper>
    <Outlet />
  </AdminDashboardLayoutWraper>
);

const ScrollToSection = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          const headerOffset = 70;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location]);

  return null;
};

export default createHashRouter([
  {
    element: <GeneralLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "pricing", element: <Pricing /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "free-quizes", element: <PublicQuizzes /> },
      { path: "report-problem", element: <ReportProblem /> },
      {
        path: "legal",
        children: [
          { path: "terms-conditions", element: <TermsConditions /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "settings", element: <AccountSettings /> },
  {
    path: "auth",
    children: [
      { index: true, element: <ManualAuth /> },
      { path: "recover", element: <RecoverLinkGenerate /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "verify", element: <AccountVerify /> },
    ],
  },
  {
    path: "dashboard",
    children: [
      {
        path: "client",
        element: <ClientDashboardLayout />,
        children: [{ index: true, element: <>Client Dashboard</> }],
      },
      {
        path: "admin",
        element: <AdminDashboardLayout />,
        children: [
          { index: true, element: <AdminDashboardOverview /> },
          {
            path: "quiz",
            children: [
              { index: true, element: <AdminDashboardQuiz /> },
              { path: ":quizId", element: <AdminQuizDetails /> },
            ],
          },
          {
            path: "series",
            children: [
              { index: true, element: <AdminDashboardSeries /> },
              { path: ":seriesId", element: <AdminSeriesDetails /> },
              { path: ":seriesId/:quizId", element: <AdminQuizDetails /> },
            ],
          },
          {
            path: "analyze",
            element: <AdminDashboardAnalysis />,
          },
        ],
      },
    ],
  },
]);
