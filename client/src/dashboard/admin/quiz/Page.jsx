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
import { createQuiz, deleteQuiz } from "../../../store/slice/admin/quiz";
import CustomToast from "../../../components/CustomToast";
import QuizFolder from "../../../components/QuizFolder";

const page = () => {
  const { handleOnChange, customRadioStyle, formatFolderData } = useContext(CommonContext);
  const { loading, error, data } = useSelector((state) => state.adminQuiz);
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

  const dispatch = useDispatch();
  const handleCreateQuiz = (e) => {
    e.preventDefault();
    dispatch(createQuiz(formState))
      .unwrap()
      .then(() => {
        CustomToast(null, "Quiz Created", 2000);
      })
      .catch((err) => {
        CustomToast(null, JSON.stringify(err));
      })
      .finally(() => {
        setCreateQuizeModal(false);
      });
  };

  const handleDeleteQuiz = (id) => {
    dispatch(deleteQuiz(id));
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

      <div className="flex gap-4 flex-wrap p-3">
        {data.map((quiz) => (
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
    </React.Fragment>
  );
};

export default page;
