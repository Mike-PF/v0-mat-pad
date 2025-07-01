import React from 'react';
import { useMatpadContext } from './context/applicationContext';

export function Home(props) {
    const { setLocation } = useMatpadContext();
    React.useEffect(() => setLocation(window.location.pathname), [setLocation]);
    return <></>;
}
