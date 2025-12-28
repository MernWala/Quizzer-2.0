import { Button } from '@mui/material';
import React from 'react';
import { MdCloudUpload } from 'react-icons/md';

const File = ({
    label = "Upload Images",
    id = "imageUpload",
    required = false,
    disabled = false,
    onChange,
    accept = ".png, .jpg, .jpeg",
}) => {

    const handleButtonClick = () => {
        document.getElementById(id)?.click();
    };

    return (
        <React.Fragment>
            <input
                type="file"
                name={id}
                id={id}
                accept={accept}
                hidden
                required={required}
                disabled={disabled}
                onChange={onChange}
            />
            <Button
                type="button"
                variant="contained"
                onClick={handleButtonClick}
                disabled={disabled}
                className='flex items-center gap-2'
            >
                <MdCloudUpload size={20} />
                {label}
            </Button>
        </React.Fragment>
    );
};

export default File;
