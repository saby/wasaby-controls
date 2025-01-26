import { IListDataFactory, ListSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';

import { getUploadItems } from './UploadSource';

const Factory: IListDataFactory = {
    loadData: () => {
        return getUploadItems().then((items) => {
            return { items };
        });
    },
    slice: ListSlice,
};

export default Factory;
