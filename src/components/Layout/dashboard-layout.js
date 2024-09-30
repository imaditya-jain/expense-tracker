import React, { useContext } from 'react'
import { Box, Container, Grid2 } from '@mui/material'
import Sidebar from './sidebar'
import { Dashboard, Expenses, Profile } from '../../sections'
import useBreakpoint from '../../hooks/useBreakpoint'
import { TabContext } from '../../context/tabContext'

const DashboardLayout = () => {
    const { selectedTab } = useContext(TabContext)
    const { isMobile } = useBreakpoint()
    return (
        <>
            <section className="dashboard-layout-wrapper">
                <Container maxWidth="xxl" className="dashboard-layout-container p-0">
                    <Grid2 container columnSpacing={4} sx={{ height: "100%" }}>
                        <Grid2 size={{ xs: 12, sm: 2 }} sx={{ display: isMobile ? 'none' : 'block' }}>
                            <Sidebar />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 10 }}>
                            <Box p={2} className="dashboard-container">
                                {
                                    selectedTab === 1 ? <Dashboard /> : selectedTab === 2 ? <Expenses /> : selectedTab === 3 ? <Profile /> : null
                                }
                            </Box>
                        </Grid2>
                    </Grid2>
                </Container>
            </section>

        </>
    )
}

export default DashboardLayout