import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AdminQuestionPreview from "../../../components/AdminQuestionPreview";
import { BsFillPlusCircleFill } from "react-icons/bs";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoCaretDownCircle, IoCloseCircle } from "react-icons/io5";
import Textarea from "../../../components/input/Textarea";
import Input from "../../../components/input/Input";
import CommonContext from "../../../context/common/CommonContext";
import File from "../../../components/input/File";
import { FaDeleteLeft } from "react-icons/fa6";
import { ImSpinner5 } from "react-icons/im";
import { IoIosAddCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import useLocalStorage from "../../../hooks/useLocalStorage.js";
import CustomToast from "../../../components/CustomToast.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import {
  deleteQuestion,
  fetchQuizDetails,
  getQuizDetails,
  questionAPICall,
} from "../../../store/slice/admin/quizDetails.js";
import DetailBox from "../../../components/DetailBox.jsx";
import dayjs from "dayjs";
import { updateQuiz } from "../../../store/slice/admin/quiz.js";

const Details = () => {
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);
  const [value, setValue] = useState(0);
  const { seriesId, quizId } = useParams();
  const { handleOnChange: handleOnChangeContext, customRadioStyle } =
    useContext(CommonContext);
  const [editMode, setEditMode] = useState(false);
  const [quizSettings, setQuizSettings] = useLocalStorage("quizSettings", {});
  const [modalFormState, setModalFormState] = useLocalStorage(
    "modalFormState",
    {
      type: "single_choice",
      marks: 1,
      section: "",
    }
  );

  const { loading, error } = useSelector((state) => state.adminQuizDetails);
  const data = useSelector(getQuizDetails(quizId));
  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizDetails(quizId));
    }
  }, [quizId]);

  const adminQuiz = useSelector((state) => state.adminQuiz);
  useEffect(() => {
    if (adminQuiz) {
      if (seriesId) {
        setQuizSettings(data);
      } else {
        const data = adminQuiz.data?.find((q) => q?._id === quizId);
        setQuizSettings(data);
      }
    }
  }, [adminQuiz, data]);

  const handleCloseModal = () => {
    setModalState(false);
    if (editMode === true) {
      setModalFormState({
        type: "single_choice",
        marks: 1,
        section: "",
      });
      setEditMode(false);
    }
  };

  const handleQuestionApiCall = (e) => {
    e.preventDefault();

    let payload = {
      options: modalFormState?.options ?? [],
      answers: modalFormState?.answers ?? [],
      section: modalFormState?.section ?? "",
      editMode: editMode ?? false,
      questionId: modalFormState?._id ?? null,
      ...modalFormState,
    };

    if (
      ["single_choice", "multi_choice"].indexOf(modalFormState?.type) >= 0 &&
      editMode === false
    ) {
      payload = {
        ...payload,
        options: [
          modalFormState?.option_1,
          modalFormState?.option_2,
          modalFormState?.option_3,
          modalFormState?.option_4,
        ].filter((option) => option && option?.trim() !== ""),
        answers: [
          modalFormState?.answer_1,
          modalFormState?.answer_2,
          modalFormState?.answer_3,
          modalFormState?.answer_4,
        ].filter((option) => option && option?.trim() !== ""),
      };
    }

    dispatch(questionAPICall({ quizId, question: payload }))
      .unwrap()
      .catch((err) => {
        if (err?.validationError) {
          err?.error?.forEach((er) => {
            CustomToast("Error", er.msg);
          });
        } else {
          CustomToast("Error", JSON.stringify(err));
        }
      })
      .finally(() => {
        setModalState(false);
        setEditMode(false);
      });
  };

  const handleDeleteQuestion = async (questionId) => {
    dispatch(deleteQuestion({ quizId, questionId }));
  };

  const handleEditQuestionClick = async (questionId) => {
    let marked = await data?.questions?.find((qs) => qs._id === questionId);
    setEditMode(true);
    setModalFormState({ ...marked, type: marked?.type });
    setModalState(true);
  };

  const [isChanged, setIsChanged] = useState(false);
  const handleOnChange = (e, setState) => {
    setIsChanged(true);
    handleOnChangeContext(e, setState);
  };

  const handleEditQuiz = (e) => {
    e.preventDefault();
    dispatch(updateQuiz(quizSettings))
      .unwrap()
      .catch((err) => {
        if (err?.validationError) {
          err?.error?.forEach((er) => {
            CustomToast("Validation Error", er?.msg);
          });
        }

        CustomToast(null, JSON.stringify(err));
      })
      .finally(() => {
        CustomToast(null, "Details updated", 2000);
      });
  };

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="add-questions-title"
        aria-describedby="add-questions-description"
        open={modalState}
        onClose={handleCloseModal}
        className="!min-height-[100vh] !overflow-auto"
      >
        <Fade in={modalState}>
          <div className="bg-gray-700 min-w-full min-h-[100vh] border-0">
            <div className="p-3 flex items-center justify-between bg-gray-800 sticky top-0 border-b border-opacity-10 z-10">
              <span className="font-semibold text-white tracking-wider text-lg">
                {editMode ? "Add" : "Edit"} Question
              </span>
              <button type="button" onClick={handleCloseModal}>
                <IoCloseCircle className="text-3xl text-gray-500 hover:text-white transition-all hover:transition-all" />
              </button>
            </div>

            <div className="px-3 py-7">
              <form className="space-y-7" onSubmit={handleQuestionApiCall}>
                <div className="flex flex-wrap">
                  <div className="lg:w-1/2 w-full lg:pe-2">
                    <div className="border border-gray-600 p-3 rounded-md relative h-full">
                      <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                        Question Type
                      </span>
                      <RadioGroup
                        aria-labelledby="question-type-label"
                        name="type"
                        className="!flex !flex-row !flex-wrap !text-white"
                        value={modalFormState?.type ?? "single_choice"}
                        onChange={(e) => handleOnChange(e, setModalFormState)}
                      >
                        {[
                          "Single Choice",
                          "Multi Choice",
                          "Short Answer",
                          "Long Answer",
                        ].map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option.split(" ").join("_").toLowerCase()}
                            control={
                              <Radio sx={customRadioStyle} disabled={loading} />
                            }
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="lg:w-1/4 w-full lg:px-2 lg:mt-0 mt-7">
                    <div className="border border-gray-600 p-3 rounded-md relative h-full">
                      <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                        Carry Marks
                      </span>
                      <Input
                        label={"Carry Marks"}
                        id={"marks"}
                        required={true}
                        type={"number"}
                        defaultValue={modalFormState?.marks ?? 1}
                        onChange={(e) => handleOnChange(e, setModalFormState)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="lg:w-1/4 w-full lg:ps-2 lg:mt-0 mt-7">
                    <div className="border border-gray-600 p-3 rounded-md relative h-full">
                      <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                        Section
                      </span>
                      <Input
                        label={"Section"}
                        id={"section"}
                        required={true}
                        type={"text"}
                        defaultValue={modalFormState?.section || "default"}
                        onChange={(e) => handleOnChange(e, setModalFormState)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                    Question
                  </span>
                  <div>
                    <Textarea
                      label={"Type / Past Question Here"}
                      id={"question"}
                      required={true}
                      disabled={loading}
                      defaultValue={modalFormState?.question ?? ""}
                      onChange={(e) => handleOnChange(e, setModalFormState)}
                    />
                  </div>
                </div>

                {["single_choice", "multi_choice"].indexOf(
                  modalFormState?.type
                ) >= 0 && (
                  <div className="border border-gray-600 p-3 rounded-md relative">
                    <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                      Set Options
                    </span>
                    <div className="flex flex-wrap">
                      {(editMode === true
                        ? modalFormState?.options?.length < 4
                          ? [
                              ...modalFormState?.options,
                              ...Array(
                                4 - (modalFormState?.options?.length ?? 0)
                              ).fill(),
                            ]
                          : modalFormState?.options
                        : Array(4).fill()
                      ).map((val, index, arr) => {
                        return (
                          <div
                            className="lg:w-1/4 md:w-1/2 w-full md:pe-3 lg:m-0 mb-3"
                            key={index}
                          >
                            <Input
                              label={`Option - ${index + 1} ${
                                index > 1 ? "(Optional)" : ""
                              }`}
                              id={`option_${index + 1}`}
                              required={index > 1 ? false : true}
                              type={"text"}
                              onChange={(e) =>
                                handleOnChange(e, setModalFormState)
                              }
                              defaultValue={
                                editMode
                                  ? val
                                  : modalFormState?.[`option_${index + 1}`] ??
                                    ""
                              }
                              disabled={loading}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {["single_choice", "multi_choice"].indexOf(
                  modalFormState?.type
                ) >= 0 && (
                  <div className="border border-gray-600 p-3 rounded-md relative">
                    <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                      Set Answer
                    </span>
                    <div className="flex flex-wrap">
                      {(editMode === true
                        ? modalFormState?.answers?.length < 4
                          ? [
                              ...modalFormState?.answers,
                              ...Array(
                                4 - (modalFormState?.answers?.length ?? 0)
                              ).fill(),
                            ]
                          : modalFormState?.answers
                        : Array(4).fill()
                      ).map((val, index) => (
                        <div
                          className="lg:w-1/4 md:w-1/2 w-full md:pe-3 lg:m-0 mb-3"
                          key={index}
                        >
                          <Input
                            label={`Option - ${index + 1} ${
                              index > 0 ? "(Optional)" : ""
                            }`}
                            id={`answer_${index + 1}`}
                            required={index > 0 ? false : true}
                            type={"text"}
                            onChange={(e) =>
                              handleOnChange(e, setModalFormState)
                            }
                            defaultValue={
                              editMode
                                ? val
                                : modalFormState?.[`answer_${index + 1}`] ?? ""
                            }
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                    Any Image (Maximum 4 Images allowed)
                  </span>
                  <div className="flex gap-2 mt-2">
                    {modalFormState?.imageUpload?.map((img, index) => (
                      <div
                        key={index}
                        className="relative md:w-1/4 sm:w-1/2 w-full shadow-sm p-3 rounded-md bg-gray-800"
                      >
                        <img
                          src={img.previewURL}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 cursor-pointer p-2 bg-gray-800 rounded-full"
                        >
                          <FaDeleteLeft className="text-white opacity-50 hover:opacity-100 transition-all hover:transition-all text-xl" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 flex flex-wrap">
                    <File
                      label={"Upload Images"}
                      id={"imageUpload"}
                      required={false}
                      disabled={loading}
                      onChange={() => {}}
                      accept=".png, .jpg, .jpeg"
                    />
                  </div>
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="flex gap-2"
                  >
                    {loading ? (
                      <ImSpinner5 size={20} className={"custom-spinner"} />
                    ) : editMode ? (
                      <FaCheckCircle size={20} />
                    ) : (
                      <IoIosAddCircle size={20} />
                    )}
                    {editMode ? "Save Changes" : "Add Question"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1 }}
          className="!border-gray-600 !sticky top-14 !bg-gray-700 bg-opacity-100 z-10 lg:!block !hidden"
        >
          <Tabs
            value={value}
            onChange={(e, val) => setValue(val)}
            aria-label="quiz details tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#fff",
                height: "1px",
              },
              "& .MuiTabs-flexContainer": { display: "flex", flexWrap: "wrap" },
            }}
          >
            <Tab
              className={`lg:!w-1/4 sm:!w-1/2 !w-full !min-w-[200px] !max-w-[unset] !tracking-wider !text-white ${
                value === 0 ? "!font-medium" : ""
              }`}
              label="Questions"
              {...a11yProps(0)}
            />
            <Tab
              className={`lg:!w-1/4 sm:!w-1/2 !w-full !min-w-[200px] !max-w-[unset] !tracking-wider !text-white ${
                value === 1 ? "!font-medium" : ""
              }`}
              label="Settings"
              {...a11yProps(1)}
            />
            <Tab
              className={`lg:!w-1/4 sm:!w-1/2 !w-full !min-w-[200px] !max-w-[unset] !tracking-wider !text-white ${
                value === 2 ? "!font-medium" : ""
              }`}
              label="Registration"
              {...a11yProps(2)}
            />
            <Tab
              className={`lg:!w-1/4 sm:!w-1/2 !w-full !min-w-[200px] !max-w-[unset] !tracking-wider !text-white ${
                value === 3 ? "!font-medium" : ""
              }`}
              label="Enquiry"
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        <div className="px-4 py-3 bg-gray-800 lg:!hidden !block">
          <Accordion className="!rounded-md !bg-gray-600">
            <AccordionSummary
              className="!bg-gray-600 !rounded-md"
              expandIcon={
                <IoCaretDownCircle size={25} className="text-white" />
              }
              aria-controls="controlPanel-content"
              id="controlPanel-header"
            >
              <span className="font-medium text-white tracking-wider">
                Menu
              </span>
            </AccordionSummary>
            <AccordionDetails className="bg-gray-700 rounded-b-md">
              <RadioGroup
                aria-labelledby="control-pannel-label"
                className="!flex lg:!flex-row !flex-col !flex-wrap !text-white"
                onChange={(e) => setValue(JSON.parse(e.target.value))}
                value={value}
              >
                {["Questions", "Settings", "Registration", "Enquiry"].map(
                  (option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio sx={customRadioStyle} />}
                      label={option}
                    />
                  )
                )}
              </RadioGroup>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="px-1 py-1 w-full">
          <CustomTabPanel value={value} index={0}>
            <div className="flex flex-wrap">
              {/* <div className="space-y-4 lg:w-3/5 w-full lg:pe-2"> */}
              <div className="space-y-4 w-full lg:pe-2">
                <div className="px-3 py-3 border border-white/10 rounded-md bg-white/2 shadow-sm">
                  <strong>Quiz:</strong> {data?.name}
                </div>

                {data?.questions?.map((question, index) => {
                  return (
                    <AdminQuestionPreview
                      key={question?._id}
                      id={question?._id}
                      sno={index + 1}
                      type={question?.type}
                      options={question?.options}
                      marks={question?.marks}
                      handleDeleteQuestion={handleDeleteQuestion}
                      handleEditQuestion={handleEditQuestionClick}
                    >
                      <AdminQuestionPreview.Question>
                        {question?.question}
                      </AdminQuestionPreview.Question>
                    </AdminQuestionPreview>
                  );
                })}

                <div className="px-3 py-5 border-2 border-white/10 rounded-md bg-white/2 shadow-sm border-dashed">
                  <button
                    type="button"
                    className="w-full h-full flex flex-col items-center justify-center outline-0"
                    onClick={() => setModalState(true)}
                  >
                    <Tooltip title="Add Question" placement="right">
                      <BsFillPlusCircleFill
                        size={80}
                        className="text-gray-700"
                      />
                    </Tooltip>
                    <span className="text-gray-700 text-lg mt-3 capitalize">
                      Click to add questions / use Command panel
                    </span>
                  </button>
                </div>
              </div>
              {/* TODO - Command pannel is comment for next version */}
              {/* <div className='lg:w-2/5 lg:block hidden lg:ps-2 top-28 sticky max-h-[calc(100vh-7.7rem)] rounded-md'>
                                <div className='bg-gray-950 rounded-md shadow-sm max-h-full overflow-auto border border-gray-600'>
                                    <div className='bg-gray-600 sticky top-0 px-3 py-1'> Command Box </div>
                                    <div className="px-3 py-2">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas incidunt eos temporibus recusandae, deleniti reiciendis minima at nobis, accusamus, magnam culpa facere odio harum hic repellat tempore ipsum. Accusantium, quia.
                                    </div>
                                    <div className='sticky bottom-0 bg-gray-600 px-1 py-2 flex flex-row'>
                                        <input type="text" name="" id="" className='bg-gray-800 rounded-full w-full outline-0 py-1 px-3' placeholder='Provide me 10 question in Java of hard level ...' />
                                        <div className='bg-gray-800 rounded-full ms-2 p-1'>
                                            <IconButton onClick={() => { }} loading={false} loadingIndicator={<IoSend size={18} />}>
                                                <IoSend size={18} className='text-white text-opacity-50 hover:text-opacity-100 transition-all hover:transition-all' />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <DetailBox>
              <DetailBox.Title className={"pb-3"}>
                <span className="text-lg font-medium text-white">
                  Basic Details:{" "}
                  <span className="rounded-full bg-white/10 px-4 py-1 text-sm">
                    {quizSettings?.visibility?.toString() === "true"
                      ? "Visible"
                      : "Hidden"}
                  </span>
                </span>
              </DetailBox.Title>
              <DetailBox.Body
                className={"flex gap-5 sm:flex-row flex-col select-none"}
              >
                <table className="border border-white/10">
                  <tbody>
                    <tr>
                      <th
                        align="left"
                        className="py-1 px-3 border border-white/10"
                      >
                        Quiz name:
                      </th>
                      <td className="px-3 py-1 border-b border-t border-white/10">
                        {quizSettings?.name}
                      </td>
                    </tr>
                    <tr>
                      <th
                        align="left"
                        className="py-1 px-3 border border-white/10"
                      >
                        Total questions:
                      </th>
                      <td className="px-3 py-1 border-b border-t border-white/10">
                        {quizSettings?.questions?.length}
                      </td>
                    </tr>
                    {!seriesId && (
                      <>
                        <tr>
                          <th
                            align="left"
                            className="py-1 px-3 border border-white/10"
                          >
                            Quiz type:
                          </th>
                          <td className="px-3 py-1 border-b border-t border-white/10">
                            {quizSettings?.quizType}
                          </td>
                        </tr>

                        <tr>
                          <th
                            align="left"
                            className="py-1 px-3 border border-white/10"
                          >
                            Registration:
                          </th>
                          <td className="px-3 py-1 border-b border-t border-white/10">
                            {quizSettings?.register
                              ? "Required"
                              : "Not setted yet"}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <table className="border border-white/10">
                  <tbody>
                    <tr>
                      <th
                        align="left"
                        className="py-1 px-3 border border-white/10"
                      >
                        Section switch:
                      </th>
                      <td className="px-3 py-1 border-b border-t border-white/10">
                        {quizSettings?.sectionSwitch?.toString() === "true"
                          ? "Allowed"
                          : "Not Allowed"}
                      </td>
                    </tr>
                    <tr>
                      <th
                        align="left"
                        className="py-1 px-3 border border-white/10"
                      >
                        Created on:
                      </th>
                      <td className="px-3 py-1 border-b border-t border-white/10">
                        {dayjs(quizSettings?.createdAt).format("DD MMM YYYY")}
                      </td>
                    </tr>
                    {!seriesId && (
                      <>
                        <tr>
                          <th
                            align="left"
                            className="py-1 px-3 border border-white/10"
                          >
                            Total time allowed:
                          </th>
                          <td className="px-3 py-1 border-b border-t border-white/10">
                            {quizSettings?.totalTime
                              ? `${quizSettings?.totalTime} Mins`
                              : "Unlimited"}
                          </td>
                        </tr>
                        <tr>
                          <th
                            align="left"
                            className="py-1 px-3 border border-white/10"
                          >
                            Will be hidden after:
                          </th>
                          <td className="px-3 py-1 border-b border-t border-white/10">
                            {quizSettings?.expireOn
                              ? dayjs(quizSettings?.expireOn).format(
                                  "DD MMM YYYY"
                                )
                              : "No date set"}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </DetailBox.Body>
            </DetailBox>

            <form onSubmit={handleEditQuiz}>
              <DetailBox>
                <DetailBox.Title className={"mb-6"}>
                  Update details
                </DetailBox.Title>
                <DetailBox.Body
                  className={
                    "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5"
                  }
                >
                  <div className="border border-gray-600 p-3 rounded-md relative h-full">
                    <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                      Name
                    </span>
                    <Input
                      label={"Name"}
                      id={"name"}
                      required={true}
                      type={"text"}
                      defaultValue={quizSettings?.name}
                      onChange={(e) => handleOnChange(e, setQuizSettings)}
                      disabled={loading}
                    />
                  </div>

                  <div className="border border-gray-600 p-3 rounded-md relative h-full">
                    <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                      Section Switch
                    </span>
                    <RadioGroup
                      aria-labelledby="question-type-label"
                      name="sectionSwitch"
                      className="!flex !flex-row !flex-wrap !text-white"
                      value={quizSettings?.sectionSwitch}
                      onChange={(e) => handleOnChange(e, setQuizSettings)}
                    >
                      {[true, false].map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={
                            <Radio sx={customRadioStyle} disabled={loading} />
                          }
                          label={option ? "Allowed" : "Not Allowed"}
                        />
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="border border-gray-600 p-3 rounded-md relative h-full">
                    <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                      Visibility
                    </span>
                    <RadioGroup
                      aria-labelledby="question-type-label"
                      name="visibility"
                      className="!flex !flex-row !flex-wrap !text-white"
                      value={quizSettings?.visibility}
                      onChange={(e) => handleOnChange(e, setQuizSettings)}
                    >
                      {[true, false].map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={
                            <Radio sx={customRadioStyle} disabled={loading} />
                          }
                          label={option ? "Visible" : "Hidden"}
                        />
                      ))}
                    </RadioGroup>
                  </div>

                  {!seriesId && (
                    <>
                      <div className="border border-gray-600 p-3 rounded-md relative h-full">
                        <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                          Quiz Type
                        </span>
                        <RadioGroup
                          aria-labelledby="question-type-label"
                          name="quizType"
                          className="!flex !flex-row !flex-wrap !text-white"
                          value={quizSettings?.quizType ?? "Free"}
                          onChange={(e) => handleOnChange(e, setQuizSettings)}
                        >
                          {["Free", "Premium", "Restricted"].map(
                            (option, index) => (
                              <FormControlLabel
                                key={index}
                                value={option}
                                control={
                                  <Radio
                                    sx={customRadioStyle}
                                    disabled={loading}
                                  />
                                }
                                label={option}
                              />
                            )
                          )}
                        </RadioGroup>
                      </div>

                      <div className="border border-gray-600 p-3 rounded-md relative h-full">
                        <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                          Total Time (0: Unlimited)
                        </span>
                        <Input
                          label={"Total Time"}
                          id={"totalTime"}
                          required={true}
                          type={"number"}
                          defaultValue={quizSettings?.totalTime ?? 0}
                          onChange={(e) => handleOnChange(e, setQuizSettings)}
                          disabled={loading}
                        />
                      </div>

                      <div className="border border-gray-600 p-3 rounded-md relative h-full">
                        <span className="text-white tracking-wider bg-gray-700 absolute top-[-1rem] px-2 text-truncate block max-w-full">
                          Will be hideen after
                        </span>
                        <Input
                          label={"Expire On"}
                          id={"expireOn"}
                          required={false}
                          type={"date"}
                          defaultValue={quizSettings?.expireOn}
                          onChange={(e) => handleOnChange(e, setQuizSettings)}
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}
                </DetailBox.Body>
              </DetailBox>

              <DetailBox>
                <DetailBox.Body>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isChanged}
                  >
                    Save
                  </Button>
                </DetailBox.Body>
              </DetailBox>
            </form>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>
            Item Four
          </CustomTabPanel>
        </div>
      </Box>
    </React.Fragment>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`details-${index}`}
      aria-labelledby={`details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 1, pt: 1, pb: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `details-tab-${index}`,
    "aria-controls": `details-${index}`,
  };
}

export default Details;
