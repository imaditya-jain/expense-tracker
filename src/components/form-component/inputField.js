import React from 'react'
import { TextField } from '@mui/material'
import PropTypes from 'prop-types'

const InputField = ({ type, label, register, errors, name }) => {
    return (
        <>
            <TextField type={type} label={label} name={name} variant='outlined' fullWidth {...register(name)} helperText={errors?.message} error={!!errors} sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                        borderColor: "white", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "white", // Border color when focused
                    },
                    color: "white", // Text color
                },
                "& .MuiInputLabel-root": {
                    color: "white", // Label color
                },
            }} />
        </>
    )
}

InputField.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}

export default InputField