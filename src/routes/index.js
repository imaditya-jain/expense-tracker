import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, Auth, Todo } from '../pages'

const Routing = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/todo" element={<Todo />} />
                </Routes>
            </Router>
        </>
    )
}

export default Routing