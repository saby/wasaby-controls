import { format as EntityFormat } from 'Types/entity';
import type { IRouter } from 'Router/router';
import { IDataFactory, List as ListFactory } from 'Controls/dataFactory';
import type { IDynamicGridDataFactoryArguments } from './IDynamicGridDataFactoryArguments';
import { prepareDynamicColumnsFilter, prepareDynamicColumnsFilterRecord } from './utils';
import slice from './Slice';

function loadData(
    dataFactoryArguments: IDynamicGridDataFactoryArguments,
    dependenciesResults: Record<string, unknown>,
    Router: IRouter
) {
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;
    const dynamicColumnsFilter = prepareDynamicColumnsFilter({
        columnsNavigation: dataFactoryArguments.columnsNavigation,
    });
    const filter = {
        ...dataFactoryArguments.filter,
        [field]: prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            dataFactoryArguments.source.getAdapter(),
            EntityFormat.IntegerField
        ),
    };
    const loadDynamicColumnsDataArguments = {
        ...dataFactoryArguments,
        source: dataFactoryArguments.source,
        filter,
        deepScrollLoad: true,
    };

    return ListFactory.loadData(loadDynamicColumnsDataArguments, dependenciesResults, Router, true);
}

/**
 * Фабрика данных Таблицы с загружаемыми колонками.
 * @class Controls-Lists/_dynamicGrid/factory/Factory/IDynamicGridFactory
 * @public
 */

/**
 * @name Controls-Lists/_dynamicGrid/factory/Factory/IDynamicGridFactory#slice
 * @cfg {Controls-Lists/_dynamicGrid/factory/Slice/DynamicGridSlice} Слайс Таблицы с загружаемыми колонками.
 */

/**
 * Метод загрузки данных для Таймлайн таблицы.
 * @function Controls-Lists/_dynamicGrid/factory/Factory/IDynamicGridFactory#loadData
 * @param {Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments} config Аргументы фабрики данных Таблицы с загружаемыми колонками.
 */
export type IDynamicGridDataFactory = IDataFactory<unknown, IDynamicGridDataFactoryArguments>;

const dynamicGridDataFactory: IDynamicGridDataFactory = {
    loadData,
    slice,
};

export default dynamicGridDataFactory;
