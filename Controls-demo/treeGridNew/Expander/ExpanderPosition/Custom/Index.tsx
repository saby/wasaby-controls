import { forwardRef } from 'react';
import { View } from 'Controls/treeGrid';
import { ColumnTemplate } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

const { getData } = Flat;

const columns = [
    {
        displayProperty: 'title',
        template: CntTpl,
        width: '',
    },
    {
        displayProperty: 'rating',
        width: '',
    },
    {
        displayProperty: 'country',
        width: '',
    },
];

function CntTpl(props) {
    return (
        <ColumnTemplate
            {...props}
            className="controls-Grid__row-cell__content_baseline_XL"
            contentTemplate={() => {
                return (
                    <>
                        <span>{props.item.contents.get('title')}</span>
                        <props.expanderTemplate />
                    </>
                );
            }}
        ></ColumnTemplate>
    );
}

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="ExpanderPositionCustom"
                columns={columns}
                expanderIcon="emptyNode"
                expanderPosition="custom"
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ExpanderPositionCustom: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new ExpandedSource({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                expandedItems: [null],
                collapsedItems: [12],
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};
