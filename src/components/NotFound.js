import React from 'react';
import { useMatpadContext } from './context/applicationContext';
export default function NotFound(props) {
    const { setLocation } = useMatpadContext();
    React.useEffect(() => setLocation(window.location.pathname), [setLocation]);

    return <p>
        Not Found
    </p>;
}
