import { IListDataFactory } from 'Controls/dataFactory';
import { getRegulationItems } from '../Utils';

const listDataFactory: IListDataFactory = {
    loadData: (config) => {
        return getRegulationItems(config);
    },
};

export default listDataFactory;
