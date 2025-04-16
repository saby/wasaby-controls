import { IListDataFactory } from 'Controls/dataFactory';
import ExtensionsManager = require('Core/ExtensionsManager');
import { getRegulationItems } from '../Utils';

export function getOutflowItems(config) {
    return ExtensionsManager.getSystemExtensions().addCallback(function (result) {
        if (!result['ТОРГОВЛЯ']) {
            return { items: [] };
        }

        return getRegulationItems(config);
    });
}

const listDataFactory: IListDataFactory = {
    loadData: (config) => {
        return getOutflowItems(config);
    },
};

export default listDataFactory;
