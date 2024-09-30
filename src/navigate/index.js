import React, { useContext } from 'react'
import { Box, List, ListItem, ListItemButton } from '@mui/material'
import { TabContext } from '../context/tabContext'

const DashboardNavigate = () => {
    const { setSelectedTab } = useContext(TabContext)
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
                </List>
            </Box>
        </>
    )
}

export default DashboardNavigate