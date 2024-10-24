import * as React from 'react';
import 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { RecordSet } from 'Types/collection';

const { getData } = Flat;

const ITEMS = new RecordSet({
    rawData: getData(),
    keyProperty: 'key',
});

const COLUMNS = Flat.getColumns().map((el) => ({
    ...el,
    key: el.displayProperty,
}));

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <TreeGridItemsView
                items={ITEMS}
                keyProperty={'key'}
                parentProperty={'parent'}
                nodeProperty={'type'}
                multiSelectVisibility={'visible'}
                columns={COLUMNS}
                selectAncestors={false}
                markItemByExpanderClick={false}
                expanderSize={'xl'}
            />
        </div>
    );
});
