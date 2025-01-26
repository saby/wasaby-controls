import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { TInternalProps } from 'UICore/Executor';

import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import 'css!Controls-demo/treeGridReact/Expander/Integration/WithImage';
import { Model } from 'Types/entity';

function ImageCellRender(): React.ReactElement {
    const { item } = useItemData<Model>();
    if (item.get('subtask')) {
        return <span className="ws-link">подзадача</span>;
    }
    const photo = item.get('photo') ? (
        <img className="demoTreeWithProto__imageBlock" src={item.get('photo')} />
    ) : (
        <div className="demoTreeWithProto__imageBlock"></div>
    );
    return (
        <div className={'tw-flex tw-items-baseline'}>
            {photo}
            {item.get('title')}
        </div>
    );
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const [expandedItems, setExpandedItems] = React.useState([1, 15, 153]);

    const items = React.useMemo(
        () =>
            new RecordSet({
                keyProperty: 'key',
                rawData: Flat.getData(),
            }),
        []
    );

    const columns = React.useMemo<IColumnConfig[]>(
        () => [
            {
                key: 'title',
                displayProperty: 'title',
                render: <ImageCellRender />,
            },
            {
                displayProperty: 'rating',
            },
            {
                displayProperty: 'country',
            },
        ],
        []
    );

    const onExpandedItemsChanged = React.useCallback((value) => {
        setExpandedItems(value);
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth1700">
            <TreeGridItemsView
                className="demoTreeWithProto__treeGrid40"
                storeId="ItemTemplateWithPhotoPhoto40px4"
                columns={columns}
                items={items}
                keyProperty={'key'}
                parentProperty={'parent'}
                nodeProperty={'type'}
                expandedItems={expandedItems}
                displayProperty={'title'}
                onExpandedItemsChanged={onExpandedItemsChanged}
                customEvents={['onExpandedItemsChanged']}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo));
