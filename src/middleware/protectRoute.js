import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";
import { auth, db } from '../config/firebase'
import { toast } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

export const UserContext = createContext(null);

const ProtectRoute = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = Cookies.get("token")

                if (token) {
                    const decodedToken = jwtDecode(token)

                    if (decodedToken.exp * 1000 < Date.now()) {
                        Cookies.remove("token")
                        toast.error('Session expired. Please login again')
                        return navigate("/auth")
                    }

                    onAuthStateChanged(auth, (currentUser) => {
                        if (currentUser && decodedToken.user_id === currentUser.uid) {
                            const docRef = doc(db, "users", currentUser.uid)
                            onSnapshot(docRef, (docSnap) => {
                                if (docSnap.exists()) {
                                    setIsAuthenticated(true)
                                    setUser(docSnap.data())
                                } else {
                                    Cookies.remove("token")
                                    toast.error('Unauthorized access. Please login again')
                                    navigate("/auth")
                                }
                            })

                        } else {
                            Cookies.remove("token")
                            toast.error('Unauthorized access. Please login again')
                            navigate("/auth")
                        }
                    })
                } else {
                    toast.error('Token not found. Please login again')
                    navigate("/auth")
                }
            } catch (error) {
                toast.error('Error validating session. Please login again')
                Cookies.remove("token")
                navigate("/auth")
            }
        }

        checkAuth()
    }, [navigate])

    return isAuthenticated ? <UserContext.Provider value={user}>{children}</UserContext.Provider> : null
}

export default ProtectRoute
