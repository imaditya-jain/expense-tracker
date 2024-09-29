import React, { useContext, useEffect, useState } from 'react'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../middleware/protectRoute';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const user = useContext(UserContext)
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [monthlyExpense, setMonthlyExpense] = useState(null)
    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        const fetchRecentExpenses = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.error("User is not logged in");
                return;
            }

            const userId = user.uid;
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                console.error("User document does not exist");
                return;
            }

            const userData = userDocSnap.data();
            const monthlyExpenses = userData.monthlyExpenses || [];

            // Sort monthlyExpenses by year and month descending
            const sortedMonthlyExpenses = monthlyExpenses.sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                return b.month - a.month;
            });

            let collectedExpenses = [];

            for (const monthlyExpense of sortedMonthlyExpenses) {
                const dailyExpenses = monthlyExpense.dailyExpenses || [];

                // Sort dailyExpenses by date descending
                const sortedDailyExpenses = dailyExpenses.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });

                for (const dailyExpense of sortedDailyExpenses) {
                    const expenses = dailyExpense.expenses || [];

                    // Sort expenses by date descending
                    const sortedExpenses = expenses.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });

                    for (const expense of sortedExpenses) {
                        collectedExpenses.push(expense);
                        if (collectedExpenses.length === 5) break;
                    }

                    if (collectedExpenses.length === 5) break;
                }

                if (collectedExpenses.length === 5) break;
            }

            // Optionally, sort the collected expenses by date descending
            const sortedCollectedExpenses = collectedExpenses.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            setRecentExpenses(sortedCollectedExpenses.slice(0, 5));
        };

        fetchRecentExpenses();
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        const userId = user?.uid;

        const docRef = doc(db, "users", userId);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                setMonthlyExpense(docSnap.data().monthlyExpenses)
                const userData = docSnap.data();
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();
                const currentMonthExpense = userData?.monthlyExpenses?.find(a => a.month === currentMonth && a.year === currentYear);

                if (currentMonthExpense) {
                    setMonthlyExpense(currentMonthExpense)
                    const categoryWiseMonthlyExpense = currentMonthExpense?.categoryWiseMonthlyExpense
                    const transformedData = Object.keys(categoryWiseMonthlyExpense).map((category) => ({
                        category,
                        amount: categoryWiseMonthlyExpense[category],
                    }));
                    setChartData(transformedData)
                }
            }
        })
    }, [])

    const CATEGORY_COLORS = {
        Education: '#5359ea',
        Entertainment: '#3e8bff',
        'Food & Dining': '#f97583',
        'Health & Fitness': '#ffd700',
        Housing: '#7ac74f',
        Miscellaneous: '#ff7f50',
        Shopping: '#8a2be2',
        Transportation: '#00ced1',
        Travel: '#ff69b4',
        Utilities: '#ff8c00',
    };


    return (
        <Box>
            <Typography variant='h3' className='text-white'>
                Welcome..! {user?.firstName} {user?.lastName}
            </Typography>
            <Box mt={2}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Box p={2} className="bg--teritory" sx={{ borderRadius: "1rem", height: "100%" }}>
                            <Typography className='text-white' variant='h4' gutterBottom>
                                Monthly Recent Expenses
                            </Typography>
                            <Divider sx={{ borderColor: "#fff" }} />
                            {recentExpenses && recentExpenses !== null && recentExpenses !== undefined && recentExpenses !== null && recentExpenses.length > 0 ? <Box mt={2} className="table-responsive">
                                <table rules='all' style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='dataTable'>Date</th>
                                            <th className='dataTable'>Subject</th>
                                            <th className='dataTable'>Category</th>
                                            <th className='dataTable'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentExpenses.map((expense, index) => (
                                            <tr key={index}>
                                                <td className='dataTable'>{new Date(expense?.date).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td className='dataTable'>{expense?.subject}</td>
                                                <td className='dataTable'>{expense?.category}</td>
                                                <td className='dataTable'>{expense?.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box> : <Typography variant='h5' align='center'>No recent expenses...!</Typography>}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box p={2} className="bg--teritory" sx={{ borderRadius: "1rem", height: "100%" }}>
                            <Box display={"flex"} justifyContent="space-between" alignItems={"center"}>
                                <Typography className='text-white' variant='h4' gutterBottom>
                                    Monthly Expenses
                                </Typography>
                                <Typography className='text-white' variant='h4' gutterBottom>
                                    ₹ {monthlyExpense?.monthlyTotalExpense}
                                </Typography>
                            </Box>
                            <Divider sx={{ borderColor: "#fff" }} />
                            <Box mt={2}>
                                {chartData && chartData !== null && chartData !== undefined && chartData !== null && chartData.length > 0 ? <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="amount"
                                            fill={CATEGORY_COLORS[chartData[0]?.category] || '#8884d8'}
                                        >
                                            {
                                                chartData.map((data) => (
                                                    <Cell key={data.category} fill={CATEGORY_COLORS[data.category] || '#8884d8'} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer> : <Typography variant='h5' align='center'>No expenses...!</Typography>}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}

export default Dashboard
