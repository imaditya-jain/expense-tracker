import React, { useState } from 'react'
import { Box, Container, Grid2, Paper } from '@mui/material'
import { AuthForm } from '../../components'

const Auth = () => {
    const [isAccount, setIsAccount] = useState(false)
    return (
        <>
            <section>
                <Container maxWidth="xxl" className='px-0' sx={{ height: "100vh" }}>
                    <Grid2 container className="h-100">
                        <Grid2 size={{ xs: 12, sm: 4 }} sx={{ backgroundColor: "#041626" }} className="d-flex align-items-center justify-content-center">
                            <Box p={2} component={Paper} className='bg-transparent shadow-none' sx={{ width: "90%", border: "1px solid #5E5E5E" }}>
                                <AuthForm isAccount={isAccount} setIsAccount={setIsAccount} />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 0, sm: 8 }} className="d-none d-sm-block auth-bg" sx={{ backgroundColor: "#031525" }}>
                            <img src="/images/bg.png" alt="" className='img-fluid' />
                        </Grid2>
                    </Grid2>
                </Container>
            </section>
        </>
    )
}

export default Auth