import * as React from 'react';

import { Memory } from 'Types/source';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';
import { View } from 'Controls/searchBreadcrumbsGrid';

import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';

const SOURCE = new Memory({
    keyProperty: 'id',
    data: Gadgets.getSearchData(true),
});

const HEADER = [
    {
        key: 1,
        title: 'Наименование',
    },
    {
        key: 2,
        title: 'Код',
    },
    {
        key: 3,
        title: 'Цена',
    },
];

const COLUMNS = Gadgets.getSearchColumns().map((c, index) => ({
    key: index,
    ...c,
}));

export default React.forwardRef((_: object, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <View
                source={SOURCE}
                header={HEADER}
                columns={COLUMNS}
                parentProperty="parent"
                displayProperty="title"
                columnScroll={true}
                nodeProperty="parent@"
                multiSelectVisibility="visible"
            />
        </div>
    );
});
