import * as React from 'react';
import 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';
import { RecordSet } from 'Types/collection';

const { getData } = Gadgets;

const ITEMS = new RecordSet({
    rawData: getData(),
    keyProperty: 'key',
});

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
    },
];

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <TreeGridItemsView
                items={ITEMS}
                columns={COLUMNS}
                expandedItems={[null]}
                keyProperty={'key'}
                parentProperty={'Раздел'}
                nodeProperty={'Раздел@'}
                expanderVisibility={'hasChildren'}
            />
        </div>
    );
});
