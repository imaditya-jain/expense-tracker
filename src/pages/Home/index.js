import { Container, Grid2, Typography } from '@mui/material'
import React from 'react'
import useBreakpoints from '../../hooks/useBreakpoint'

const Home = () => {
    const { isMobile } = useBreakpoints()
    return (
        <>
            <section style={{ marginTop: "4.5rem" }}>
                <Container maxWidth="xxl" className='homeContainer'>
                    <Grid2 container spacing={2} sx={{ height: "100%" }}>
                        <Grid2 size={{ xs: 12, sm: 6 }} className="d-flex justify-content-center align-items-center">
                            <Typography variant='h1' align='center'>Expense Tracker</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: isMobile ? 'none' : 'block' }}>
                            <img src="/images/homebg.jpeg" alt="" className='img-fluid' />
                        </Grid2>
                    </Grid2>
                </Container>
            </section>
        </>
    )
}

export default Home