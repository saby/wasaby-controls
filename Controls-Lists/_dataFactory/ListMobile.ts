import type { IListMobileDataFactory } from './ListMobile/_interface/IListMobileDataFactory';

import loadData from './ListMobile/loadData';
import slice from './ListMobile/Slice';

const listDataFactory: IListMobileDataFactory = {
    loadData,
    slice,
};

export default listDataFactory;
