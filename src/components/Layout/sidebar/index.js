import { Box } from '@mui/material'
import React from 'react'
import AuthorBox from '../../authorBox'
import DashboardNavigate from '../../../navigate'

const Sidebar = () => {
    return (
        <>
            <Box p={2} className="sidebar">
                <AuthorBox />
                <DashboardNavigate />
            </Box>
        </>
    )
}

export default Sidebar