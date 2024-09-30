import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Auth, Tracker, Profile, Udet } from '../pages';
import ProtectRoute from '../middleware/protectRoute';
import { Header } from '../components';
import { TabProvider } from '../context/tabContext';

const Routing = () => {
    return (
        <>
            <TabProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/tracker" element={<ProtectRoute><Tracker /></ProtectRoute>} />
                        <Route path='/profile' element={<ProtectRoute><Profile /></ProtectRoute>} />
                        <Route path='/user-details' element={<ProtectRoute><Udet /></ProtectRoute>} />
                    </Routes>
                </Router>
            </TabProvider>
        </>
    );
};

export default Routing;
