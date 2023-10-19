import DataContext from './DataContext';
import * as React from 'react';
import { Slice } from '../slice';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ Управление данными для страниц и окон})
 * @function Controls-DataEnv/_context/useSlice
 * @param storeId уникальный идентификатор значения в контексте
 */
export default function useSlice<T extends Slice>(storeId: string): T {
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
    return slice as T;
}
