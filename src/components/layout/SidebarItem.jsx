import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useState } from "react"
import { FaCaretDown } from "react-icons/fa";
import { FaAnglesRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SidebarItem = ({ to, children, hasChild = false, title = "Dropwown Title", onClick, className }) => {

    const [isExpanded, setIsExpanded] = useState(false)

    return hasChild ?
        <Accordion
            expanded={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
            className={`
                !border !border-gray-800 !rounded-md !text-white !text-opacity-50 hover:!text-opacity-100 hover:!bg-gray-800 
                !mb-3 hover:!border hover:!border-gray-700 !shadow-none
                ${isExpanded ? "!bg-gray-800 !text-opacity-100" : "!bg-transparent"}
                ${className}
            `}
        >
            <AccordionSummary
                sx={{
                    borderBottom: isExpanded ? "1px solid #374151" : "none",
                    minHeight: "unset", // Prevent extra height
                    padding: "0 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    margin: "unset",
                    "& .css-yfrx4k-MuiAccordionSummary-content": {
                        margin: "0.55rem 0"
                    },
                    "&.Mui-expanded": {
                        minHeight: "unset !important", // Force override for expanded state
                        height: '42px'
                    },
                }}
                expandIcon={<FaCaretDown className={`text-white ${isExpanded ? "text-opacity-100" : "text-opacity-50"}`} />}
                aria-controls="panel2-content"
                id="panel2-header"
            >
                {title}
            </AccordionSummary>

            <AccordionDetails sx={{ padding: "0.5rem 1rem" }}> {/* Reduce padding */}
                <div className="flex flex-col gap-2 py-0"> {/* Remove extra padding */}
                    {children}
                </div>
            </AccordionDetails>
        </Accordion>
        :
        <li onClick={onClick} className={`${hasChild === true ? "has-child" : ""} border border-gray-800 rounded-md text-white text-opacity-50 hover:text-opacity-100 transition-all hover:transition-all hover:bg-gray-800 mb-3 hover:border hover:border-gray-700 ${className}`}>
            <Link to={to} className='py-2 px-3 block text-truncate'>{children}</Link>
        </li>
};


export const SubMenuItem = ({ to, children }) => {
    return (
        <Link to={to} className='text-truncate text-white text-sm flex gap-2 items-center'>
            <FaAnglesRight />{children}
        </Link>
    )
}


export default SidebarItem