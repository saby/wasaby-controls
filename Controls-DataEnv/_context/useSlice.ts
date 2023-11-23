import DataContext from './DataContext/DataContext';
import * as React from 'react';
import { Slice } from '../slice';
import RootContext from './RootContext/RootContext';
import { Logger } from 'UI/Utils';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ Управление данными для страниц и окон})
 * @function Controls-DataEnv/_context/useSlice
 * @param storeId уникальный идентификатор значения в контексте
 */
export default function useSlice<T extends Slice>(storeId: string): T | undefined {
    const dataContext = React.useContext(DataContext);
    const rootContext = React.useContext(RootContext);

    if (!dataContext && !rootContext) {
        Logger.warn(
            'useSlice::DataContext undefined. Компонент находится вне DataContext и RootContext'
        );
        return;
    }
    const sliceFromDataContext = dataContext?.[storeId];

    if (!sliceFromDataContext) {
        const sliceFromRoot = rootContext?.getNode('root')?.[storeId] as unknown as T;
        if (sliceFromRoot) {
            return sliceFromRoot;
        }
    } else {
        return sliceFromDataContext as unknown as T;
    }
}
