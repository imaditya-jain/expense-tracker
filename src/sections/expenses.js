import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import AddExpense from '../components/form/add-expense'
import { useTheme } from '@mui/material/styles'
import { UserContext } from '../middleware/protectRoute'

const Expenses = () => {
    const [monthlyExp, setMonthlyExp] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const user = useContext(UserContext);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', "July", 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            if (Array.isArray(user?.monthlyExpenses) && user?.monthlyExpenses.length > 0) {
                setMonthlyExp(user?.monthlyExpenses);
            } else {
                setMonthlyExp([]);
            }
        }
    }, [user]);

    const AllExpense = ({ monthlyExp }) => {
        if (monthlyExp.length > 0) {
            return (
                <>
                    {monthlyExp.map((monthItem, monthIndex) => (
                        <Box key={monthIndex} mt={3} className="table-responsive">
                            <table rules="all" style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={4} className='text-center text-white dataTable'>
                                            Expenses for {months[monthItem?.month - 1]}, {monthItem?.year}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='dataTable'>Date</th>
                                        <th className='dataTable'>Subject</th>
                                        <th className='dataTable'>Category</th>
                                        <th className='dataTable'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthItem?.dailyExpenses && Array.isArray(monthItem?.dailyExpenses) && monthItem?.dailyExpenses?.length > 0 ? (
                                        monthItem?.dailyExpenses.map((dayItem, dayIndex) => (
                                            dayItem?.expenses && dayItem?.expenses.length > 0 ? (
                                                dayItem?.expenses.map((expense, expenseIndex) => (
                                                    <tr key={`${dayIndex}-${expenseIndex}`}>
                                                        <td className='dataTable'>{new Date(expense.date).toLocaleDateString()}</td>
                                                        <td className='dataTable'>{expense.subject}</td>
                                                        <td className='dataTable'>{expense.category}</td>
                                                        <td className='dataTable'>${expense.total}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr key={dayIndex}>
                                                    <td colSpan={4} className='dataTable text-center'>
                                                        No expenses for this day
                                                    </td>
                                                </tr>
                                            )
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='dataTable text-center'>
                                                No daily expenses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Box>
                    ))}
                </>
            );
        } else {
            return <p>No expenses available.</p>;
        }
    };

    return (
        <>
            <Box>
                <Typography variant='h3' className='text-white'>{selectedTab === 1 ? 'Expense' : 'Add Expense'}</Typography>
                <Box mt={2} className="tab-container">
                    <Button disableRipple className={`tab ${selectedTab === 1 ? 'active' : ''}`} onClick={() => setSelectedTab(1)}>Expense</Button>
                    <Button disableRipple className={`tab ${selectedTab === 2 ? 'active' : ''}`} onClick={() => setSelectedTab(2)}>Add Expense</Button>
                </Box>
                <Box mt={{ xs: 2 }}>
                    {selectedTab === 1 ? <AllExpense monthlyExp={monthlyExp} /> : <AddExpense />}
                </Box>
            </Box>
        </>
    )
}

export default Expenses;
