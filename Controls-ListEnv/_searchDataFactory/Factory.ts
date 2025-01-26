import { SearchSlice } from './Slice';
import { ISearchDataFactoryParams, ISearchLoadResult } from './interfaces';

const loadData = (dataFactoryArguments: ISearchDataFactoryParams): Promise<ISearchLoadResult> => {
    const res: ISearchLoadResult = {};
    if (dataFactoryArguments.searchValue) {
        res.searchValue = dataFactoryArguments.searchValue;
    }
    return Promise.resolve(res);
};

export default {
    loadData,
    slice: SearchSlice,
};
