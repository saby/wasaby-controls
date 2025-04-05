/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { abstractLoadData as loadListModules } from 'Controls-DataEnv/abstractList';
import { IRouter } from 'Router/router';
import { IListDataFactoryArguments } from './interface/factory/IListDataFactoryArguments';
import { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';
import loadListData from '../_listDataLoader/listDataLoader';

/**
 * Функция загрузки конфигурации списочного слайса с предварительной валидацией
 * */
export default async function loadData(
    config: IListDataFactoryArguments,
    _dependenciesResults: {},
    _Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    // Загрузка статики списка
    const isLatestInteractorVersion =
        config.isLatestInteractorVersion === undefined ? true : config.isLatestInteractorVersion;
    const loadListStaticPromise = loadListModules(
        {
            ...config,
            isLatestInteractorVersion,
        },
        _dependenciesResults,
        _Router,
        _clearResult,
        fabricId
    );

    // Загрузка данных
    const loadDataResult = await loadListData(
        config,
        _dependenciesResults,
        _Router,
        _clearResult,
        fabricId
    );

    // Дожидаемся завершения загрузки статики
    await loadListStaticPromise;

    return {
        ...loadDataResult,
        isLatestInteractorVersion,
    };
}
