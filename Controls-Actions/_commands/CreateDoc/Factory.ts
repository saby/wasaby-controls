import { IListDataFactory } from 'Controls/dataFactory';
import { default as DocSource } from './DocSource';

export function getDocItems(options?: object): Promise {
    return new Promise((resolve) => {
        new DocSource({ opener: options?.opener }).getItems().then((items) => {
            resolve({
                needWrap: false,
                wrapName: 'Документ',
                opener: options?.opener,
                icon: options?.icon,
                group: 0,
                subGroup: 0,
                items,
            });
        });
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getDocItems();
    },
};

export default listDataFactory;
