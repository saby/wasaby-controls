import { IListDataFactory } from 'Controls/dataFactory';
import { default as TransportSource } from './TransportSource';

export function getTransportItems(options?: object): Promise {
    return new Promise((resolve) => {
        new TransportSource({ opener: options?.opener }).getItems().then((items) => {
            resolve({
                items,
                needWrap: false,
                opener: options?.opener,
            });
        });
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getTransportItems();
    },
};

export default listDataFactory;
