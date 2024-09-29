import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputField from '../form-component/inputField'
import { auth } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

const AuthForm = ({ isAccount, setIsAccount }) => {
    const navigate = useNavigate()

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(schema) })

    const onSubmit = async (data) => {
        try {
            if (!isAccount) {
                // register
                const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
                reset();
                setIsAccount(true);
                toast.success("Account created successfully");
            } else if (isAccount) {
                const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
                reset();
                toast.success("Login successfully");
                const token = await userCredentials.user.getIdToken(true);
                Cookies.set("token", token, { expires: 1 });

                navigate("/tracker");
            }
        } catch (error) {
            reset();
            toast.error(error.message);
        }
    };



    return (
        <>
            <Box display='flex' flexDirection='column' gap={4}>
                <Box>
                    <Typography variant='h3' align='center' className='text-white'>{isAccount ? "Login" : "Register"}</Typography>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box mb={2}>
                            <InputField type="email" label="Email" name="email" register={register} errors={errors.email} />
                        </Box>
                        <Box mb={2}>
                            <InputField type="password" label="Password" name="password" register={register} errors={errors.password} />
                        </Box>
                        <Box>
                            <Button type='submit' className='bg-white text-dark' fullWidth>{isAccount ? "Login" : "Register"}</Button>
                        </Box>
                    </form>
                </Box>
                <Box>
                    <Button className='text-white' disableRipple fullWidth onClick={() => setIsAccount(!isAccount)}>{isAccount ? "Create new account." : "Already have an account?"}</Button>
                </Box>
            </Box>
        </>
    )
}

export default AuthForm