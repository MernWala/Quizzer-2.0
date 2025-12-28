import { Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";

const QuizFolder = ({
  children = "Quiz Name",
  handleDelete,
  seriesFlag,
  seriesId,
  setEditSeriesFlag,
  data: {
    id = null,
    type = "Free",
    isVisible = false,
    publishDate = new Date(),
    totalTime = "100 min",
    totalQuestions = 100,
    sectionSwitchAllowed = false,
    createdAt = new Date(),
    expireDate = new Date(),
    quizes = 0,
    isSeries = false,
  },
}) => {
  const navigate = useNavigate();
  const [informationModal, setInformationModal] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);

  const handleContextMenu = (e, id) => {
    setMenuPosition(null);
    setTimeout(() => {
      setMenuPosition({ mouseX: e.clientX, mouseY: e.clientY, id });
    }, 0);
  };

  const handleOpenFolder = (id) => {
    if (informationModal === false && deleteFlag === false) {
      setMenuPosition(null);
      navigate(id);
    }
  };

  return (
    <React.Fragment>
      <button
        type="button"
        onDoubleClick={() => {
          handleOpenFolder(id);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPosition(null);
        }}
        className={`w-32 h-32 ${
          menuPosition ? "bg-white/10" : "bg-white/2"
        } rounded-md relative hover:bg-opacity-10 focus:bg-white/10 focus-within:bg-white/10 outline-none`}
      >
        <Tooltip title={children}>
          <div
            className="flex flex-col justify-center items-center p-3"
            onContextMenu={(e) => {
              e.preventDefault();
              handleContextMenu(e, id);
            }}
          >
            <div>
              {(isSeries ? quizes > 0 : totalQuestions > 0) ? (
                <FcOpenedFolder size={80} />
              ) : (
                <FcFolder size={80} />
              )}
            </div>

            <span className="text-sm text-truncate block max-w-full tracking-wide user-select-none">
              {children}
            </span>
          </div>
        </Tooltip>
      </button>

      <Menu
        open={Boolean(menuPosition)}
        onClose={() => setMenuPosition(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem
          className="text-sm! py-1! tracking-wider!"
          onClick={() => handleOpenFolder(seriesId ? seriesId : id)}
        >
          Open
        </MenuItem>
        {seriesFlag && (
          <MenuItem
            className="text-sm! py-1! tracking-wider!"
            onClick={() => {
              setMenuPosition(null);
              setEditSeriesFlag(id);
            }}
          >
            Edit Details
          </MenuItem>
        )}
        <MenuItem
          className="text-sm! py-1! tracking-wider!"
          onClick={() => {
            setMenuPosition(null);
            setDeleteFlag(true);
            setInformationModal(true);
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          className="text-sm! py-1! tracking-wider!"
          onClick={() => {
            setMenuPosition(null);
            setInformationModal(true);
          }}
        >
          Properties
        </MenuItem>
      </Menu>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={informationModal}
        onClose={() => {
          setInformationModal(false);
          setDeleteFlag(false);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={informationModal}>
          <Box
            sx={{ transform: "translate(-50%, -50%)" }}
            className={`absolute top-[50%] left-[50%] w-100 rounded-md shadow-md bg-gray-800 backdrop-brightness-50! backdrop-blur-md! overflow-hidden`}
          >
            {deleteFlag && (
              <div className="bg-gray-700 py-1 px-2 text-white tracking-wide">
                <span className="text-lg">
                  Are you sure want to delete this quiz?
                </span>
              </div>
            )}

            <div className="text-white">
              <div className="p-3 flex flex-wrap items-center justify-center border-b border-gray-700">
                <div className="w-2/3">
                  <p className="text-lg font-medium tracking-wider mb-0">
                    {children}
                  </p>
                  <span className="text-xs tracking-wider uppercase">
                    {type}
                  </span>
                </div>
                <div className="w-1/3 flex justify-center">
                  <span className="rounded-full bg-gray-700 px-4 py-1 text-sm">
                    {isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
              <div className="p-3 mb-3">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Created on
                        </th>
                        <td className="px-4 py-3">{createdAt}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Will expire on
                        </th>
                        <td className="px-4 py-3">{expireDate}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Published on
                        </th>
                        <td className="px-4 py-3">{publishDate}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Time limit
                        </th>
                        <td className="px-4 py-3">{totalTime}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Total
                          {!isSeries ? " question" : " quiz"}
                        </th>
                        <td className="px-4 py-3">
                          {!isSeries ? totalQuestions : quizes}
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Section Switch
                        </th>
                        <td className="px-4 py-3">
                          {sectionSwitchAllowed ? "Allowed" : "Restricted"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {!deleteFlag && (
                <div className="p-3 border-t border-gray-700">
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth={false}
                    onClick={() => {
                      setInformationModal(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>

            {deleteFlag && (
              <React.Fragment>
                <p className="w-full border-t border-gray-700"></p>
                <div className="flex md:flex-row flex-col gap-3 p-3">
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      setInformationModal(false);
                      setDeleteFlag(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      handleDelete(id);
                      setInformationModal(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </React.Fragment>
            )}
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default QuizFolder;
