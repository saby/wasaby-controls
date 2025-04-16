import { ConnectedComponent as OverviewTree } from 'Controls-Lists/overviewTree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';
import { forwardRef } from 'react';
import { Model } from 'Types/entity';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IRowProps } from 'Controls/_treeGridRender/interface/IRowComponent';
import { IColumn } from 'Controls/treeGridRender';
import ItemComponent from 'Controls-Lists-demo/overviewTree/Base/render/ItemComponent';
import { getData } from 'Controls-Lists-demo/overviewTree/Base/data/data';

const Component = forwardRef(function (props, ref) {
    const rootClass =
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-offset-withoutLevelPadding';

    function getRowProps(item: Model): IRowProps {
        return {
            hoverBackgroundStyle: 'unaccented',
            fontSize: 's',
            withoutExpanderPadding: false,
            withoutLevelPadding: false,
            expanderIcon: 'emptyNode',
        };
    }
    const columns: IColumn = [
        {
            displayProperty: 'title',
            width: '300px',
        },
        { render: <ItemComponent />, width: '200px' },
        {
            displayProperty: 'parent',
            getCellProps: () => {
                return { expanderIcon: 'node' };
            },
        },
    ];

    return (
        <div className={rootClass} ref={ref}>
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <OverviewTree
                    storeId="overviewTreeBase"
                    getRowProps={getRowProps}
                    columns={columns}
                />
            </ScrollContainer>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        overviewTreeBase: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new ExpandedSource({
                    keyProperty: 'key',
                    data: getData(),
                    parentProperty: 'parent',
                }),
                expandedItems: [null],
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};
