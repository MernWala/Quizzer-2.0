import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const QuizSelect = ({ value, adminQuiz, navigate }) => (
  <select
    className="outline-0 bg-white/10 rounded-sm text-white text-sm px-2 py-1"
    value={value || ""}
    onChange={(e) => {
      if (!e.target.value) return;
      navigate(`/dashboard/admin/quiz/${e.target.value}`);
    }}
  >
    <option className="text-black" value="">-- Select --</option>
    {adminQuiz?.map((quiz) => (
      <option key={quiz?._id} value={quiz?._id} className="text-black">
        {quiz?.name}
      </option>
    ))}
  </select>
);

const SeriesSelect = ({ value, adminSeries, navigate }) => (
  <select
    className="outline-0 bg-white/10 rounded-sm text-white text-sm px-2 py-1"
    value={value || ""}
    onChange={(e) => {
      if (!e.target.value) return;
      navigate(`/dashboard/admin/series/${e.target.value}`);
    }}
  >
    <option className="text-black" value="">-- Select --</option>
    {adminSeries?.map((series) => (
      <option key={series?._id} value={series?._id} className="text-black">
        {series?.name}
      </option>
    ))}
  </select>
);

const SeriesQuizSelect = ({ seriesId, quizId, adminSeries, adminQuizDetails, navigate }) => {
  const series = useMemo(
    () => adminSeries?.find((s) => s?._id === seriesId),
    [adminSeries, seriesId]
  );

  return (
    <select
      className="outline-0 bg-white/10 rounded-sm text-white text-sm px-2 py-1"
      value={quizId || ""}
      onChange={(e) => {
        if (!e.target.value) return;
        navigate(`/dashboard/admin/series/${seriesId}/${e.target.value}`);
      }}
    >
      <option className="text-black" value="">-- Select --</option>
      {series?.quizes?.map((id) => (
        <option key={id} value={id} className="text-black">
          {adminQuizDetails.find((q) => q?._id === id)?.name}
        </option>
      ))}
    </select>
  );
};

const DashboardTitle = () => {
  const { pathname } = useLocation();
  const { quizId, seriesId } = useParams();
  const navigate = useNavigate();

  const adminQuiz = useSelector((state) => state.adminQuiz.data, shallowEqual);
  const adminQuizDetails = useSelector((state) => state.adminQuizDetails.data, shallowEqual);
  const adminSeries = useSelector((state) => state.adminSeries.data, shallowEqual);

  switch (true) {
    case /^\/dashboard\/admin\/?$/.test(pathname):
      return <span className="text-lg font-semibold tracking-wider">Overview</span>;

    case /^\/dashboard\/admin\/quiz\/?$/.test(pathname):
      return <span className="font-semibold tracking-wider">All Quiz</span>;

    case /^\/dashboard\/admin\/quiz\/[a-zA-Z0-9]+\/?$/.test(pathname):
      return (
        <div className="flex gap-2">
          <span className="font-semibold tracking-wider">Quiz</span>
          <span>/</span>
          <QuizSelect value={quizId} adminQuiz={adminQuiz} navigate={navigate} />
        </div>
      );

    case /^\/dashboard\/admin\/series\/?$/.test(pathname):
      return <span className="font-semibold tracking-wider">All Series</span>;

    case /^\/dashboard\/admin\/series\/[a-zA-Z0-9]+\/?$/.test(pathname):
      return (
        <div className="flex gap-2">
          <span className="font-semibold tracking-wider">Series</span>
          <span>/</span>
          <SeriesSelect value={seriesId} adminSeries={adminSeries} navigate={navigate} />
        </div>
      );

    case /^\/dashboard\/admin\/series\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/?$/.test(pathname):
      return (
        <div className="flex gap-2">
          <span className="font-semibold tracking-wider">Series</span>
          <span>/</span>
          <SeriesSelect value={seriesId} adminSeries={adminSeries} navigate={navigate} />
          <span>/</span>
          <SeriesQuizSelect
            seriesId={seriesId}
            quizId={quizId}
            adminSeries={adminSeries}
            adminQuizDetails={adminQuizDetails}
            navigate={navigate}
          />
        </div>
      );

    case /^\/dashboard\/admin\/analyze\/?$/.test(pathname):
      return <span className="font-semibold tracking-wider">Analysis</span>;

    default:
      console.log("Unknown path:", pathname);
      return null;
  }
};

export default React.memo(DashboardTitle);
