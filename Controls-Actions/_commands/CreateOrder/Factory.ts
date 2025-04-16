import { IListDataFactory } from 'Controls/dataFactory';
import { getRegulationItems } from '../Utils';

export function getOrderItems(config) {
    return getRegulationItems(config);
}

const listDataFactory: IListDataFactory = {
    loadData: (config) => {
        return getOrderItems(config);
    },
};

export default listDataFactory;
