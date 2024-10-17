import * as React from 'react';
export function useOrientation() {
    const [orientation, setOrientation] = React.useState('');
    const onOrientationChange = React.useCallback((event) => {
        setOrientation(event.target?.type);
    }, []);
    React.useEffect(() => {
        screen.orientation?.addEventListener('change', onOrientationChange);
        if (!orientation) {
            setOrientation(screen.orientation?.type);
        }
        return () => {
            screen.orientation?.removeEventListener('change', onOrientationChange);
        };
    }, [onOrientationChange]);
    return orientation;
}
