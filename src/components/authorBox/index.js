import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import { UserContext } from '../../middleware/protectRoute'

const AuthorBox = () => {
    const user = useContext(UserContext)

    return (
        <>
            <Box className="author-box">
                <Box className="circle">
                    <img src={user?.profileImage} alt={user?.firstName} className='img-fluid' />
                </Box>
                <Box>
                    <Typography className='text-white fw-semibold'>{user?.firstName} {user?.lastName}</Typography>
                </Box>
            </Box>
        </>
    )
}

export default AuthorBox