import React from 'react'
import { Box, Button, Grid2 } from '@mui/material'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { InputField } from '../../components/index'
import { auth, db, storage } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const UserDetails = () => {
    const schema = yup.object().shape({
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        phone: yup.string().required("Phone number is required"),
        designation: yup.string().required("Designation is required"),
        salary: yup.string().required("Salary is required"),
        profileImage: yup
            .mixed()
            .required("Profile image is required")
            .test("fileExists", "Profile image is required", (value) => {
                return value && value.length > 0;
            })
            .test("fileSize", "The file is too large", (value) => {
                return value && value[0]?.size <= 2000000;
            })
            .test("fileType", "Unsupported File Format", (value) => {
                return value && ["image/jpeg", "image/png", "image/gif"].includes(value[0]?.type);
            }),
    })

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ resolver: yupResolver(schema) })

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User is not logged in");

            const userId = user.uid;
            const { profileImage, ...userData } = data;

            const imageRef = ref(storage, `profileImages/${profileImage[0].name}`);
            await uploadBytes(imageRef, profileImage[0]);
            const imageUrl = await getDownloadURL(imageRef);
            userData.profileImage = imageUrl;

            await setDoc(doc(db, "users", userId), {
                ...userData,
                email: user.email,
                isUserDetailsUpdated: true,
            }, { merge: true });
            reset()
            toast.success("User details updated successfully");
        } catch (error) {
            toast.error(`Error updating user details: ${error.message}`);
        }
    };

    return (
        <>
            <Box p={4} className="bg--primary det-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='text' label='First Name' name='firstName' register={register} errors={errors.firstName} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='text' label='Last Name' name='lastName' register={register} errors={errors.lastName} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='tel' label='Phone' name='phone' register={register} errors={errors.phone} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='text' label='Designation' name='designation' register={register} errors={errors.designation} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='text' label='Salary' name='salary' register={register} errors={errors.salary} />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputField type='file' label='Profile Image' name='profileImage' register={register} errors={errors.profileImage} />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <Button type='submit' className='secondary-btn' fullWidth>Save</Button>
                            </Grid2>
                        </Grid2>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default UserDetails