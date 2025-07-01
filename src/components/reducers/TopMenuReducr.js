function TopMenuReducer(state, action) {
    if (action === 'set_location') {
        return {
            ...state,
            location: window.location.pathname
        };
    }
}

export default TopMenuReducer;