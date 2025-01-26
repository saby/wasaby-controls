import { useEffect, useContext } from 'react';
import { IHotKeyObserver } from '../interface/IHotKeyObserver';
import { HotKeysContext } from '../Context/HotKeysContext';

export const useRegister = (newObserver: IHotKeyObserver) => {
    const context = useContext(HotKeysContext);

    useEffect(() => {
        context.register(newObserver);

        return () => context.unregister(newObserver);
    }, []);
};
