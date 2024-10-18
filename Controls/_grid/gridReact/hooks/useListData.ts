/*
 * Файл содержит публичный хук useListData и вспомогательные методы.
 * Хук useListData позволяет получить базовые данные для всего списка.
 */

import * as React from 'react';
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';

export interface IListData {
    metaData: Record<string, unknown>;
    searchValue: string;
}

type TWatchedData = 'results';

export const ListDataContext = React.createContext<IListData>(null);

/*
 * Функция для проверки возможности отслеживания изменений
 */
function validateResults(results: unknown | undefined, watchResults: boolean): void {
    if (!watchResults) {
        return;
    }

    if (!results?.['[Types/_entity/IObservableObject]'] && watchResults) {
        Logger.error(
            'Не возможно отслеживать изменения results, т.к. results не реализует интерфейс IObservableObject'
        );
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

interface IUseListDataResult extends IListData {
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
