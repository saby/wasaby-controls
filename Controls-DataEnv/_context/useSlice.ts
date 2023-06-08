import DataContext from './DataContext';
import * as React from 'react';
import { Slice } from '../slice';

export default function useSlice(storeId: string): Slice {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error(
            'useSlice::DataContext undefined. Компонент лежит вне Controls-DataEnv/context:Provider'
        );
    }
    const slice = context[storeId];
    if (!slice) {
        throw new Error(
            `useSlice::Передан неверный storeId ${storeId}. Не найден слайс в контексте`
        );
    }
    return slice;
}
