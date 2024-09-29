import React from 'react'
import { Container, Grid2 } from '@mui/material'
import { UserDetails } from '../../components'


const UDet = () => {
    return (
        <>
            <section>
                <Container maxWidth="xxl" className='detailed-page bg--secondary'>
                    <Grid2 container justifyContent={"center"} sx={{ height: "100%" }}>
                        <Grid2 size={{ xs: 12, sm: 8, md: 6 }} className="d-flex align-items-center">
                            <UserDetails />
                        </Grid2>
                    </Grid2>
                </Container>
            </section >
        </>
    )
}

export default UDet