import { IListDataFactory, ListSlice } from 'Controls/dataFactory';
import { getUploadItems } from './UploadSource';

const Factory: IListDataFactory = {
    loadData: () => {
        return getUploadItems().then((uploadItems) => {
            const items = uploadItems.map((item) => {
                return {
                    ...item,
                    '@parent': item['@parent'] === false ? null : item['@parent'],
                    item: item,
                };
            });
            return { items };
        });
    },
    slice: ListSlice,
};

export default Factory;
