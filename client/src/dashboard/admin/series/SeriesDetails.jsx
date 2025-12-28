import {
  Box,
  Button,
  Fade,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import CommonContext from "../../../context/common/CommonContext";
import { IoIosCloseCircle } from "react-icons/io";
import Input from "../../../components/input/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuiz,
  deleteQuiz,
} from "../../../store/slice/admin/seriesDetails";
import CustomToast from "../../../components/CustomToast";
import QuizFolder from "../../../components/QuizFolder";
import { useParams } from "react-router-dom";
import {
  fetchSeriesDetails,
  getSeriesDetails,
} from "../../../store/slice/admin/seriesDetails";

const SeriesDetails = () => {
  const { seriesId } = useParams();
  const dispatch = useDispatch();
  const { handleOnChange, customRadioStyle, formatFolderData } =
    useContext(CommonContext);
  const [createQuizeModal, setCreateQuizeModal] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    quizType: "Free",
    sectionSwitch: true,
    visibility: true,
  });

  const onCloseAddQuizModal = () => {
    setCreateQuizeModal(false);
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    dispatch(createQuiz({ ...formState, seriesId }))
      .unwrap()
      .then(() => {
        setCreateQuizeModal(false);
      })
      .catch((err) => {
        if (Array.isArray(err)) {
          err.forEach((er) => {
            CustomToast("Error", er?.msg);
          });
        }
      });

    if (error) {
      CustomToast("Error", error);
    }
  };

  const { loading, error } = useSelector((state) => state.adminSeriesDetails);
  const data = useSelector(getSeriesDetails(seriesId));
  useEffect(() => {
    dispatch(fetchSeriesDetails(seriesId));
  }, [seriesId]);

  const handleDeleteQuiz = (id) => {
    dispatch(deleteQuiz({ seriesId, quizId: id }));
  };

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="create-quiz-title"
        aria-describedby="create-quiz-description"
        open={createQuizeModal}
        onClose={onCloseAddQuizModal}
        className="!overflow-auto"
      >
        <Fade in={createQuizeModal}>
          <Box
            sx={{ transform: "translate(-50%, -50%)" }}
            className={`absolute top-[50%] left-[50%] min-w-[500px] !max-w-full rounded-md shadow-md bg-gray-800 !backdrop-brightness-50 !backdrop-blur-md overflow-hidden`}
          >
            <div className="bg-gray-900 py-1 px-2 text-white tracking-wide mb-3 flex items-center justify-between">
              <span className="text-lg">Fill below details:</span>
              <button type="button" onClick={onCloseAddQuizModal}>
                <IoIosCloseCircle className="text-white" size={30} />
              </button>
            </div>

            <div className="p-3 text-white">
              <form className="space-y-7" onSubmit={handleCreateQuiz}>
                {/* Quiz Name */}
                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute top-[-1rem] px-2">
                    Quiz Name
                  </span>
                  <Input
                    label="Quiz Name"
                    id="name"
                    required={true}
                    type="text"
                    onChange={(e) => handleOnChange(e, setFormState)}
                    disabled={loading}
                    defaultValue={formState.name}
                  />
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute top-[-1rem] px-2">
                    Quiz Type
                  </span>
                  <RadioGroup
                    aria-labelledby="quiz-type-label"
                    name="quizType"
                    className="!flex !flex-row !text-white"
                    value={formState.quizType || "Free"}
                    onChange={(e) => handleOnChange(e, setFormState)}
                  >
                    {["Free", "Premium", "Restricted"].map((type, index) => (
                      <FormControlLabel
                        key={index}
                        value={type}
                        control={
                          <Radio sx={customRadioStyle} disabled={loading} />
                        }
                        label={type}
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute top-[-1rem] px-2">
                    Visibility
                  </span>
                  <RadioGroup
                    name="visibility"
                    className="!flex !flex-row !text-white"
                    value={formState.visibility?.toString() || "true"}
                    onChange={(e) => handleOnChange(e, setFormState)}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio sx={customRadioStyle} disabled={loading} />
                      }
                      label="Visible"
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio sx={customRadioStyle} disabled={loading} />
                      }
                      label="Hidden"
                    />
                  </RadioGroup>
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute top-[-1rem] px-2">
                    Section Switch
                  </span>

                  <RadioGroup
                    name="sectionSwitch"
                    className="!flex !flex-row !text-white"
                    value={formState.sectionSwitch?.toString() || "true"}
                    onChange={(e) => handleOnChange(e, setFormState)}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio sx={customRadioStyle} disabled={loading} />
                      }
                      label="Enabled"
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio sx={customRadioStyle} disabled={loading} />
                      }
                      label="Disabled"
                    />
                  </RadioGroup>
                </div>

                <div>
                  <p className="w-full border-t border-gray-700"></p>
                  <div className="flex md:flex-row flex-col gap-3 p-3">
                    <Button type="button" variant="contained" color="inherit">
                      <span className="text-black">Close</span>
                    </Button>
                    <Button type="submit" variant="contained" color="info">
                      Create Quiz
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>

      <div className="p-3">
        <div className="px-3 py-3 border border-white/10 rounded-md bg-white/2 shadow-sm mb-3">
          <strong>Series:</strong> {data?.name}
        </div>
        <div className="flex gap-4 flex-wrap">
          {Array.isArray(data?.quizes) &&
            data?.quizes?.map((quiz) => (
              <QuizFolder
                key={quiz._id}
                data={formatFolderData(quiz)}
                handleDelete={handleDeleteQuiz}
              >
                {quiz?.name}
              </QuizFolder>
            ))}

          <button
            type="button"
            onClick={() => setCreateQuizeModal(true)}
            className={`${
              false ? "bg-white/10" : "bg-white/2"
            } w-32 h-32 rounded-md flex flex-col justify-center items-center p-3 relative hover:bg-opacity-10 outline-0`}
          >
            <div>
              <BsFillPlusCircleFill size={65} className="text-gray-700 mb-3" />
            </div>
            <span className="text-sm text-truncate block max-w-full tracking-wide user-select-none">
              Create Quiz
            </span>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SeriesDetails;
