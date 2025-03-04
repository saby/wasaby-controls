import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumn } from 'Controls/grid';
import { View as TreeGridView, ItemTemplate as TreeGridItemTemplate } from 'Controls/treeGrid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

const { getData } = Gadgets;

const columns: IColumn[] = [
    {
        displayProperty: 'title',
    },
];

const itemTemplate = React.forwardRef(
    (itemTemplateProps: object, ref: React.ForwardedRef<HTMLDivElement>) => {
        return <TreeGridItemTemplate {...itemTemplateProps} ref={ref} expanderSize="s" />;
    }
);

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="controlsDemo__cell controlsDemo__mr2 controlsDemo_fixedWidth300">
            <div className="controls-text-label">Отступы соответствующие размеру S</div>
            <div className="controlsDemo__wrapper">
                <TreeGridView
                    storeId="ExpanderSizeAll1"
                    columns={columns}
                    itemTemplate={itemTemplate}
                />
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExpanderSizeAll1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'Раздел',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    expandedItems: [null],
                },
            },
        };
    },
});
