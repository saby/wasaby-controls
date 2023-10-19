import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View as TreeGridView } from 'Controls/treeGrid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { IHeaderCell } from 'Controls/_grid/display/interface/IHeaderCell';

const { getData, getColumns } = Flat;

const header: IHeaderCell[] = [
    {
        caption: 'Наименование',
        sortingProperty: 'title',
    },
    {
        caption: 'Рейтинг покупателей',
        sortingProperty: 'rating',
    },
    {
        caption: 'Страна производитель',
        sortingProperty: 'country',
    },
];

const columns: unknown[] = getColumns();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className={
                'controlsDemo__wrapper controlsDemo_fixedWidth500 controlsDemo_wrapper-treeGrid-base-treeGridView'
            }
        >
            <TreeGridView storeId={'SortingButton'} columns={columns} header={header} />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SortingButton: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
