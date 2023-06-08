import DynamicGridSlice from './Slice';
import type { IRouter } from 'Router/router';
import { List as ListFactory } from 'Controls/dataFactory';
import type { IDynamicGridDataFactoryArguments } from './IDynamicGridFactory';
import { applyColumnsData, prepareLoadColumnsFilter } from './utils';

function loadData(
   dataFactoryArguments: IDynamicGridDataFactoryArguments,
   dependenciesResults: Record<string, unknown>,
   Router: IRouter) {
    const promiseLoadStaticData = ListFactory.loadData(dataFactoryArguments, dependenciesResults, Router, true);
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;
    const loadDynamicColumnsDataArguments = {
        ...dataFactoryArguments,
        source: dataFactoryArguments.dynamicColumnsSource,
        filter: prepareLoadColumnsFilter({
            filter: dataFactoryArguments.filter,
            columnsNavigation: dataFactoryArguments.columnsNavigation
        })
    };

    // dataFactoryArguments.columnsNavigation

    // первый раз в фильтр ручками положить

    const promiseLoadDynamicColumnsData =
       ListFactory.loadData(loadDynamicColumnsDataArguments, dependenciesResults, Router, true);

    return Promise.all([promiseLoadStaticData, promiseLoadDynamicColumnsData]).then((results) => {
        const [ loadStaticDataResult, loadDynamicColumnsDataResult ] = results;
        const staticRS = loadStaticDataResult.sourceController.getItems();
        const dynamicColumnsRS = loadDynamicColumnsDataResult.sourceController.getItems();

        if (dynamicColumnsRS) {
            applyColumnsData({
                items: staticRS,
                columnsData: dynamicColumnsRS,
                columnsDataProperty: field
            });
        }

        return {
            ...loadStaticDataResult
        };
    });
}

export default {
    loadData,
    slice: DynamicGridSlice
};
