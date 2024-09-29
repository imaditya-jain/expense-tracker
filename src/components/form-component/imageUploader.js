import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PropTypes from 'prop-types';

const ImageUploader = ({ name, register, setValue, errors, label }) => {
    const [image, setImage] = useState(null);
    const inputRef = useRef(null);

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // For image preview
            setValue(name, file, { shouldValidate: true }); // Set file for react-hook-form
        }
    };

    // Trigger the hidden file input
    const triggerFileSelect = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    // Clean up the object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (image) URL.revokeObjectURL(image);
        };
    }, [image]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: { xs: 100, sm: 150 },
                    height: { xs: 100, sm: 150 },
                    borderRadius: '50%',
                    overflow: 'visible',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s',
                    '&:hover': {
                        borderColor: '#999',
                    },
                }}
                onClick={triggerFileSelect}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Uploaded"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <PhotoCamera sx={{ fontSize: { xs: 40, sm: 60 }, color: '#aaa' }} />
                )}
                <IconButton
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,1)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerFileSelect();
                    }}
                >
                    <ImageIcon />
                </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }} className='text-white'>
                {label}
            </Typography>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
                {...register(name)}
            />
            {errors[name] && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors[name]?.message}
                </Typography>
            )}
        </Box>
    );
};

ImageUploader.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    register: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    errors: PropTypes.object,
};

ImageUploader.defaultProps = {
    label: 'Upload Image',
    errors: {},
};

export default ImageUploader;
