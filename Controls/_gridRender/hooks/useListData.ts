/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import { executeSyncOrAsync } from 'UICommon/Deps';

/**
 * Данные распространяемые через контекст в пределах списка
 * @public
 */
export interface IListData {
    /**
     * Мета-данные RecordSet
     * @cfg
     */
    metaData: Record<string, unknown>;
    /**
     * Текущее щначение поиска
     * @cfg
     */
    searchValue: string;
}

/**
 * Тип параметров, принимаемых хуком {@link Controls/grid:useListData}
 * @typedef TWatchedData
 * @variant results При явном указании в массиве параметров хук будет отслеживать изменения в Record с итогами.
 */
export type TWatchedData = 'results';

export const ListDataContext = React.createContext<IListData>(null);

/*
 * Функция для проверки возможности отслеживания изменений
 */
function validateResults(results: unknown | undefined, watchResults: boolean): void {
    if (!watchResults) {
        return;
    }

    if (!results?.['[Types/_entity/IObservableObject]'] && watchResults) {
        executeSyncOrAsync(['Controls/listErrors'], (errs) => errs.IObservableObjectError());
    }
}

/*
 * Приватный хук, осуществляющий подписку на событие onPropertyChange и вызывающий перерисовку при изменении
 * отслеживаемых данных
 */
function useWatchResults(
    metaData?: Record<string, unknown>,
    watchedData?: TWatchedData[]
): object | Model {
    const [_resultsVersion, setResultsVersion] = React.useState(0);
    React.useEffect(() => {
        const results = metaData?.results;
        const watchResults = watchedData?.includes('results');
        const shouldWatchResults =
            results && results['[Types/_entity/IObservableObject]'] && watchResults;

        validateResults(results, watchResults);

        const handler = () => setResultsVersion((prevState) => prevState + 1);

        if (shouldWatchResults) {
            (results as Model).subscribe('onPropertyChange', handler);
        }

        return () => {
            if (shouldWatchResults) {
                (results as Model).unsubscribe('onPropertyChange', handler);
            }
        };
    }, [metaData]);
    return metaData?.results as object | Model;
}

/**
 * Результат выполнения хука {@link Controls/grid:useListData}
 * @public
 */
export interface IUseListDataResult extends IListData {
    /**
     * Record с данными для строки итогов
     * @cfg
     */
    results: object | Model;
}

/**
 * Хук, который возвращает данные доступные в пределах списка
 * @param watchedData Названия данных, за которыми нужно следить для вызова перерисовки при изменениях
 */
export function useListData(watchedData?: TWatchedData[]): IUseListDataResult {
    const { metaData, searchValue } = React.useContext(ListDataContext);
    const results = useWatchResults(metaData, watchedData);
    return {
        metaData,
        results,
        searchValue,
    };
}
