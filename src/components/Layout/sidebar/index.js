import { Box } from '@mui/material'
import React from 'react'
import AuthorBox from '../../authorBox'
import DashboardNavigate from '../../../navigate'

const Sidebar = ({ setSelectedTab, selectedTab }) => {
    return (
        <>
            <Box p={2} className="sidebar">
                <AuthorBox />
                <DashboardNavigate selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            </Box>
        </>
    )
}

export default Sidebar