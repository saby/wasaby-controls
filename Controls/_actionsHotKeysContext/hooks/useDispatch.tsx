import { useContext } from 'react';
import { HotKeysContext } from '../Context/HotKeysContext';
import { IHotKey } from '../interface/IHotKey';

export const useDispatch = (hotKey: IHotKey) => {
    const context = useContext(HotKeysContext);
    context?.dispatch(hotKey);
};
