import React, { useContext, useEffect, useState } from "react";
import QuizFolder from "../../../components/QuizFolder";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import CommonContext from "../../../context/common/CommonContext";
import { Box, Button, Fade, FormControlLabel, Modal, Radio, RadioGroup } from "@mui/material";
import { IoIosCloseCircle } from "react-icons/io";
import Input from "../../../components/input/Input";
import { createSeries, deleteSeries, updateSeries } from "../../../store/slice/admin/series";
import CustomToast from "../../../components/CustomToast";
import DetailBox from "../../../components/DetailBox";
import dayjs from "dayjs";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { IoCloseCircle } from "react-icons/io5";

const page = () => {
  const {
    handleOnChange: handleOnChangeContext,
    customRadioStyle,
    formatFolderData,
  } = useContext(CommonContext);
  const { loading, data, error } = useSelector((state) => state.adminSeries);
  const [createSeriesModal, setCreateSeriesModal] = useState(false);
  const [formState, setFormState] = useState({
    visibility: true,
    type: "Free",
  });

  const onCloseAddQuizModal = () => {
    setCreateSeriesModal(false);
  };

  const dispatch = useDispatch();
  const handleCreateSeries = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSeries(formState)).unwrap();
      CustomToast(null, "Series Created", 2000);
      onCloseAddQuizModal();
    } catch (err) {
      if (Array.isArray(err)) {
        err.forEach((er) => CustomToast(null, er?.msg));
      } else {
        CustomToast(null, err, 2000);
      }
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteSeries(id));
  };

  const [editSeriesFlag, setEditSeriesFlag] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [seriesSettings, setSeriesSettings] = useLocalStorage(
    "seriesSettings",
    {}
  );

  const { data: adminSeriesData } = useSelector((state) => state.adminSeries);
  useEffect(() => {
    if (editSeriesFlag) {
      const curr = adminSeriesData?.find((se) => se?._id === editSeriesFlag);
      setSeriesSettings(curr);
    }
  }, [adminSeriesData, editSeriesFlag]);

  const handleCloseEditModal = () => {
    setEditSeriesFlag(false);
  };

  const handleOnChange = (e, setState) => {
    setIsChanged(true);
    handleOnChangeContext(e, setState);
  };

  const handleUpdateSeries = (e) => {
    e.preventDefault();
    dispatch(updateSeries(seriesSettings))
      .unwrap()
      .catch((err) => {
        if (err?.validationError === true) {
          err?.error?.forEach((er) => {
            CustomToast(null, er?.msg);
          });
        } else {
          CustomToast("Error", JSON.stringify(err));
        }
      })
      .finally(() => {
        setEditSeriesFlag(null);
        setSeriesSettings({});
      });
  };

  return (
    <React.Fragment>
      <div className="flex gap-4 flex-wrap p-3">
        {data.map((series) => (
          <QuizFolder
            key={series._id}
            data={formatFolderData(series, true)}
            seriesFlag={true}
            seriesId={series._id}
            handleDelete={handleDelete}
            setEditSeriesFlag={setEditSeriesFlag}
          >
            {series?.name}
          </QuizFolder>
        ))}

        <button
          type="button"
          onClick={() => setCreateSeriesModal(true)}
          className={`${
            false ? "bg-white/10" : "bg-white/2"
          } w-32 h-32 rounded-md flex flex-col justify-center items-center p-3 relative hover:bg-opacity-10 outline-0`}
        >
          <div>
            <BsFillPlusCircleFill size={65} className="text-gray-700 mb-3" />
          </div>
          <span className="text-sm text-truncate block max-w-full tracking-wide user-select-none">
            Create Series
          </span>
        </button>
      </div>

      <Modal
        aria-labelledby="update-series-title"
        aria-describedby="update-series-description"
        open={editSeriesFlag ? true : false}
        onClose={handleCloseEditModal}
        className="overflow-auto!"
      >
        <Fade in={editSeriesFlag ? true : false}>
          <Box
            sx={{ transform: "translate(-50%, -50%)" }}
            className={`absolute top-[50%] left-[50%] w-full h-screen overflow-auto shadow-md bg-gray-800 backdrop-brightness-50! backdrop-blur-md!`}
          >
            <div className="bg-gray-900 w-full py-2 px-3 sticky top-0 flex items-center justify-between">
              <span className="text-lg font-medium text-white">
                {" "}
                Update settings: {seriesSettings?.name}
              </span>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="cursor-pointer"
              >
                <IoCloseCircle className="text-3xl text-gray-500 hover:text-white transition-all hover:transition-all" />
              </button>
            </div>
            <div className="p-3 text-white">
              <DetailBox>
                <DetailBox.Title className={"pb-3"}>
                  Basic Details{" "}
                  <span className="rounded-full bg-white/10 px-4 py-1 text-sm">
                    {seriesSettings?.visibility ? "Visible" : "Hidden"}
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
                          Series name:
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.name}
                        </td>
                      </tr>
                      <tr>
                        <th
                          align="left"
                          className="py-1 px-3 border border-white/10"
                        >
                          Total quiz:
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.quizes?.length}
                        </td>
                      </tr>
                      <tr>
                        <th
                          align="left"
                          className="py-1 px-3 border border-white/10"
                        >
                          Series type:
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.type}
                        </td>
                      </tr>
                      <tr>
                        <th
                          align="left"
                          className="py-1 px-3 border border-white/10"
                        >
                          Visibility:
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.visibility ? "Visible" : "Hidden"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="border border-white/10">
                    <tbody>
                      <tr>
                        <th
                          align="left"
                          className="py-1 px-3 border border-white/10"
                        >
                          Continuous (switch between quizes):
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.continuous === true
                            ? "Allowed"
                            : "Not Allowed"}
                        </td>
                      </tr>
                      <tr>
                        <th
                          align="left"
                          className="py-1 px-3 border border-white/10"
                        >
                          Total time allowed:
                        </th>
                        <td className="px-3 py-1 border-b border-t border-white/10">
                          {seriesSettings?.totalTime
                            ? `${seriesSettings?.totalTime} Mins`
                            : "Unlimited"}
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
                          {dayjs(seriesSettings?.createdAt).format(
                            "DD MMM YYYY"
                          )}
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
                          {seriesSettings?.expireOn
                            ? dayjs(seriesSettings?.expireOn).format(
                                "DD MMM YYYY"
                              )
                            : "No date set"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DetailBox.Body>
              </DetailBox>

              <form onSubmit={handleUpdateSeries}>
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
                      <span className="text-white tracking-wider bg-gray-700 absolute -top-4 px-2 text-truncate block max-w-full">
                        Name
                      </span>
                      <Input
                        label={"Name"}
                        id={"name"}
                        required={true}
                        type={"text"}
                        defaultValue={seriesSettings?.name}
                        onChange={(e) => handleOnChange(e, setSeriesSettings)}
                        disabled={loading}
                      />
                    </div>

                    <div className="border border-gray-600 p-3 rounded-md relative h-full">
                      <span className="text-white tracking-wider bg-gray-700 absolute -top-4 px-2 text-truncate block max-w-full">
                        Series Type
                      </span>
                      <RadioGroup
                        aria-labelledby="question-type-label"
                        name="type"
                        className="flex! flex-row! flex-wrap! text-white!"
                        value={seriesSettings?.type ?? "Free"}
                        onChange={(e) => handleOnChange(e, setSeriesSettings)}
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
                      <span className="text-white tracking-wider bg-gray-700 absolute -top-4 px-2 text-truncate block max-w-full">
                        Continuous (Switch between quizes):
                      </span>
                      <RadioGroup
                        aria-labelledby="question-type-label"
                        name="continuous"
                        className="flex! flex-row! flex-wrap! text-white!"
                        value={seriesSettings?.continuous}
                        onChange={(e) => handleOnChange(e, setSeriesSettings)}
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
                      <span className="text-white tracking-wider bg-gray-700 absolute -top-4 px-2 text-truncate block max-w-full">
                        Total Time (0: Unlimited)
                      </span>
                      <Input
                        label={"Total Time"}
                        id={"totalTime"}
                        required={true}
                        type={"number"}
                        defaultValue={seriesSettings?.totalTime ?? 0}
                        onChange={(e) => handleOnChange(e, setSeriesSettings)}
                        disabled={loading}
                      />
                    </div>

                    <div className="border border-gray-600 p-3 rounded-md relative h-full">
                      <span className="text-white tracking-wider bg-gray-700 absolute -top-4 px-2 text-truncate block max-w-full">
                        Will be hideen after (Not-set: Unlimited)
                      </span>
                      <Input
                        label={"Expire On"}
                        id={"expireOn"}
                        required={false}
                        type={"date"}
                        defaultValue={seriesSettings?.expireOn}
                        onChange={(e) => handleOnChange(e, setSeriesSettings)}
                        disabled={loading}
                      />
                    </div>
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
            </div>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="create-quiz-title"
        aria-describedby="create-quiz-description"
        open={createSeriesModal}
        onClose={onCloseAddQuizModal}
        className="overflow-auto!"
      >
        <Fade in={createSeriesModal}>
          <Box
            sx={{ transform: "translate(-50%, -50%)" }}
            className={`absolute top-[50%] left-[50%] min-w-125 max-w-full! rounded-md shadow-md bg-gray-800 backdrop-brightness-50! backdrop-blur-md! overflow-hidden`}
          >
            <div className="bg-gray-900 py-1 px-2 text-white tracking-wide mb-3 flex items-center justify-between">
              <span className="text-lg">Fill below details:</span>
              <button type="button" onClick={onCloseAddQuizModal}>
                <IoIosCloseCircle className="text-white" size={30} />
              </button>
            </div>

            <div className="p-3 text-white">
              <form className="space-y-7" onSubmit={handleCreateSeries}>
                {/* Series Name */}
                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute -top-4 px-2">
                    Series Name
                  </span>
                  <Input
                    label="Series Name"
                    id="name"
                    required={true}
                    type="text"
                    onChange={(e) => handleOnChange(e, setFormState)}
                    disabled={loading}
                    defaultValue={formState.name}
                  />
                </div>

                <div className="border border-gray-600 p-3 rounded-md relative">
                  <span className="text-white tracking-wider bg-gray-800 absolute -top-4 px-2">
                    Series Type
                  </span>
                  <RadioGroup
                    aria-labelledby="quiz-type-label"
                    name="type"
                    className="flex! flex-row! text-white!"
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
                  <span className="text-white tracking-wider bg-gray-800 absolute -top-4 px-2">
                    Visibility
                  </span>
                  <RadioGroup
                    name="visibility"
                    className="flex! flex-row! text-white!"
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

                <div>
                  <p className="w-full border-t border-gray-700"></p>
                  <div className="flex md:flex-row flex-col gap-3 p-3">
                    <Button type="button" variant="contained" color="inherit">
                      <span className="text-black">Close</span>
                    </Button>
                    <Button type="submit" variant="contained" color="info">
                      Create Series
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default page;
