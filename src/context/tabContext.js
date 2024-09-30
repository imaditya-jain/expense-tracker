import React, { createContext, useState } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    return (
        <TabContext.Provider value={{ selectedTab, setSelectedTab }}>
            {children}
        </TabContext.Provider>
    );
};
