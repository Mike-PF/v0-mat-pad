import React, { useState } from 'react';

export const PageLoadContext = React.createContext();

export const PageLoadContextProvider = () => {
    const [location, setLocation] = useState([]);
    return PageLoadContext.pageLocation = { location, setLocation};
};

