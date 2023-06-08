import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { ItemsView as TreeItemsView, NodeFooterTemplate } from 'Controls/tree';
import { Button } from 'Controls/buttons';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

function TreeDemo(_: object, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = new RecordSet({
        rawData: Flat.getData(),
        keyProperty: 'key',
    });
    const removeItem = (key) => {
        return items.remove(items.getRecordById(key));
    };

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth500"
        >
            <Button
                caption={'Remove node=Apple'}
                onClick={() => {
                    return removeItem(1);
                }}
            />
            <Button
                caption={'Remove node=Acer'}
                onClick={() => {
                    return removeItem(5);
                }}
            />
            <TreeItemsView
                items={items}
                itemsSpacing="l"
                nodeProperty="type"
                parentProperty="parent"
                nodeFooterTemplate={(props) => {
                    return (
                        <NodeFooterTemplate
                            {...props}
                            content={() => {
                                return 'Node footer';
                            }}
                        />
                    );
                }}
            />
        </div>
    );
}

export default React.forwardRef(TreeDemo);
