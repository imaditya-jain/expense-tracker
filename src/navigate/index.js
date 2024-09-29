import React from 'react'
import { Box, List, ListItem, ListItemButton } from '@mui/material'

const DashboardNavigate = ({ setSelectedTab, selectedTab }) => {
    return (
        <>
            <Box mt={2} className="dashboard-navigate">
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => setSelectedTab(1)} className='text-white'>Dashboard</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => setSelectedTab(2)} className='text-white'>Expense</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => setSelectedTab(3)} className='text-white'>Profile</ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    )
}

export default DashboardNavigate