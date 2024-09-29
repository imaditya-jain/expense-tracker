import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import AddExpense from '../components/form/add-expense'
import { useTheme } from '@mui/material/styles'

const Expenses = () => {
    const [selectedTab, setSelectedTab] = useState(1)

    return (
        <>
            <Box>
                <Typography variant='h3' className='text-white'>{selectedTab === 1 ? 'Expense' : 'Add Expense'}</Typography>
                <Box mt={2} className="tab-container">
                    <Button disableRipple className={`tab ${selectedTab === 1 ? 'active' : ''}`} onClick={() => setSelectedTab(1)}>Expense</Button>
                    <Button disableRipple className={`tab ${selectedTab === 2 ? 'active' : ''}`} onClick={() => setSelectedTab(2)}>Add Expense</Button>
                </Box>
                <Box mt={{ xs: 2 }}>
                    {selectedTab === 1 ? <></> : <AddExpense />}
                </Box>
            </Box>
        </>
    )
}

export default Expenses