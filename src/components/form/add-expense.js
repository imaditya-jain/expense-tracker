import React from 'react';
import { Box, Button, Grid2, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from '../form-component/inputField';
import { doc, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../config/firebase';
import { toast } from 'react-toastify';

const categories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Health & Fitness',
    'Education',
    'Travel',
    'Shopping',
    'Miscellaneous'
];

const AddExpense = () => {
    const schema = yup.object().shape({
        subject: yup.string().required('Subject is required.').min(2, 'Subject must be at least 2 characters long.'),
        merchant: yup.string().required('Merchant is required.').min(2, 'Merchant must be at least 2 characters long.'),
        date: yup.date().required('Date is required.').typeError('Please enter a valid date.').max(new Date(), 'Date cannot be in the future.'),
        total: yup.number().required('Total amount is required.').typeError('Total must be a number.').positive('Total must be a positive number.'),
        category: yup.string().required('Category is required.'),
        description: yup.string().notRequired().max(500, 'Description cannot exceed 500 characters.'),
        bill: yup.mixed().notRequired()
            .test("fileSize", "The file is too large", (value) => {
                return !value.length || (value[0]?.size <= 2000000);
            })
            .test("fileType", "Unsupported File Format", (value) => {
                return !value.length || ["image/jpeg", "image/png", "image/gif"].includes(value[0]?.type);
            }),
    });

    const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User is not logged in");

            const userId = user.uid;
            const expenseDate = new Date(data.date);
            const month = expenseDate.getMonth() + 1;
            const year = expenseDate.getFullYear();
            const dateString = expenseDate.toISOString().split('T')[0];

            let billUrl = null;
            if (data.bill && data.bill.length > 0) {
                const billFile = data.bill[0];
                const billRef = ref(storage, `bills/${userId}/${billFile.name}_${Date.now()}`);
                const snapshot = await uploadBytes(billRef, billFile);
                billUrl = await getDownloadURL(snapshot.ref);
            }

            const expenseObj = {
                subject: data.subject,
                merchant: data.merchant,
                date: expenseDate.toISOString(),
                total: data.total,
                category: data.category,
                description: data.description || '',
                bill: billUrl || '',
            };

            const userDocRef = doc(db, "users", userId);

            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                if (!userDoc.exists()) {
                    throw new Error("User document does not exist!");
                }

                const userData = userDoc.data();
                let monthlyExpenses = userData.monthlyExpenses || [];

                let monthlyExpense = monthlyExpenses.find(me => me.month === month && me.year === year);
                if (!monthlyExpense) {
                    monthlyExpense = {
                        month,
                        year,
                        monthlyTotalExpense: 0,
                        categoryWiseMonthlyExpense: categories.reduce((acc, category) => {
                            acc[category] = 0;
                            return acc;
                        }, {}),
                        dailyExpenses: []
                    };
                    monthlyExpenses.push(monthlyExpense);
                }

                monthlyExpense.monthlyTotalExpense += data.total;
                if (monthlyExpense.categoryWiseMonthlyExpense[data.category]) {
                    monthlyExpense.categoryWiseMonthlyExpense[data.category] += data.total;
                } else {
                    monthlyExpense.categoryWiseMonthlyExpense[data.category] = data.total;
                }

                let dailyExpense = monthlyExpense.dailyExpenses.find(de => de.date === dateString);
                if (!dailyExpense) {
                    dailyExpense = {
                        date: dateString,
                        totalDayExpense: 0,
                        categoryWiseDayExpense: categories.reduce((acc, category) => {
                            acc[category] = 0;
                            return acc;
                        }, {}),
                        expenses: []
                    };
                    monthlyExpense.dailyExpenses.push(dailyExpense);
                }

                dailyExpense.totalDayExpense += data.total;
                if (dailyExpense.categoryWiseDayExpense[data.category]) {
                    dailyExpense.categoryWiseDayExpense[data.category] += data.total;
                } else {
                    dailyExpense.categoryWiseDayExpense[data.category] = data.total;
                }

                dailyExpense.expenses.push(expenseObj);

                transaction.update(userDocRef, { monthlyExpenses });
            });

            toast.success("Expense added successfully");
            reset();
        } catch (error) {
            console.error("Error adding expense: ", error);
            toast.error(`Error adding expense: ${error.message}`);
        }
    };

    return (
        <Box>
            <Grid2 container>
                <Grid2 size={{ xs: 12, sm: 8, md: 6 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="text" register={register} label="Subject" name="subject" errors={errors?.subject} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="text" register={register} label="Merchant" name="merchant" errors={errors?.merchant} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="date" register={register} label="Date" name="date" errors={errors?.date} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="number" register={register} label="Total" name="total" errors={errors?.total} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.category}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        label="Category"
                                        defaultValue=""
                                        {...register("category")}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="text" register={register} label="Description" name="description" errors={errors?.description} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type="file" register={register} label="Bill Image" name="bill" errors={errors?.bill} />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <Button type='submit' fullWidth className='bg-white'>Save</Button>
                            </Grid2>
                        </Grid2>
                    </form>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default AddExpense;
