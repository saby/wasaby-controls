import { IListDataFactory } from 'Controls/dataFactory';
import { getRegulationItems } from '../Utils';

export function getOutBillItems(config) {
    return getRegulationItems(config);
}

const listDataFactory: IListDataFactory = {
    loadData: (config) => {
        return getOutBillItems(config);
    },
};

export default listDataFactory;
