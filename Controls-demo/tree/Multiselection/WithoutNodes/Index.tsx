import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { ItemsView as TreeView } from 'Controls/tree';

const data = [
    {
        key: 1,
        title: 'Notebooks',
        node: null,
        parent: null,
    },
    {
        key: 2,
        title: 'Tablets',
        node: null,
        parent: null,
    },
    {
        key: 3,
        title: 'Laptop computers',
        node: null,
        parent: null,
    },
];
const items = new RecordSet({
    keyProperty: 'key',
    rawData: data,
});

export default React.forwardRef((_, ref) => {
    return (
        <div ref={ref}>
            <TreeView
                items={items}
                keyProperty={'key'}
                nodeProperty={'node'}
                parentProperty={'parent'}
                multiSelectVisibility={'visible'}
            />
        </div>
    );
});
