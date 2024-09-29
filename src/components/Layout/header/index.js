import React, { useLayoutEffect, useState } from 'react'
import { useNavigate, useLocation, } from 'react-router-dom';
import { Menu } from '@mui/icons-material'
import { Avatar, Box, Button, Container, IconButton, List, ListItem, ListItemButton, Popover, Typography } from '@mui/material'
import { auth, db } from '../../../config/firebase';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import useBreakpoints from '../../../hooks/useBreakpoint'
import Sidebar from '../sidebar';

const Header = () => {
    const [selectedTab, setSelectedTab] = useState(1)
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { isMobile, isTablet, isDesktop } = useBreakpoints();
    const [user, setUser] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleLogout = () => {
        try {
            const response = auth.signOut();
            Cookies.remove("token")
            navigate('/auth')
            toast.success("Logout successfully")
        } catch (error) {
            toast.error(error.message)
        }
    }

    useLayoutEffect(() => {
        const user = auth.currentUser
        if (user) {
            const userId = user?.uid;
            const docRef = doc(db, "users", userId);
            onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setUser(userData);
                } else {
                    console.log('No such document!');
                }
            });
        }
    }, [navigate])

    return (
        <>
            {
                location.pathname === '/tracker' && isMobile && <header className='fixed-top bg--secondary' >
                    <nav>
                        <Container maxWidth="xxl" className='d-flex justify-content-between align-items-center'>
                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                {location.pathname !== '/auth' && location.pathname !== '/' && !isTablet && !isDesktop ? <IconButton onClick={() => setMenuOpen(!menuOpen)}><Menu className='text-white' /></IconButton> : null}
                                <Typography variant='h4' className='text-white'>Expense Tracker</Typography>
                            </Box>
                            {
                                user && user !== null && user !== undefined && user !== "" && Object.keys(user).length > 0 ? user?.firstName && user?.lastName && <> <IconButton className='rounded-circle' onClick={handleClick}><Avatar src={user?.profileImage} sx={{ borderRadius: "50%", height: 56, width: 56 }} /></IconButton><Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Box >
                                        <List>
                                            <ListItem>
                                                <ListItemButton>{user?.firstName} {user?.lastName}</ListItemButton>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemButton onClick={handleLogout}>Logout</ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Popover> </> : location.pathname !== '/auth' && <Button className='bg-white text-dark fw-semibold' onClick={() => navigate('/auth')}>Login</Button>
                            }
                            {
                                menuOpen && <Box className={`drawer ${menuOpen ? 'open' : ''} bg--secondary`}>
                                    <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                                </Box>
                            }
                        </Container>
                    </nav>
                </header>
            }
        </>
    )
}

export default Header