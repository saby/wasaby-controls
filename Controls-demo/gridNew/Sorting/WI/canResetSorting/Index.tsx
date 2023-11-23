import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View as GridView } from 'Controls/grid';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Sorting } from 'Controls-demo/gridNew/DemoHelpers/Data/Sorting';

const { getData } = Countries;
const { getColumns } = Sorting;

const getHeader: IHeaderCell[] = [
    {
        caption: '#',
    },
    {
        caption: 'Страна',
    },
    {
        caption: 'Город',
        sortingProperty: 'capital',
        align: 'left',
    },
    {
        caption: 'Население',
        sortingProperty: 'population',
        align: 'left',
    },
    {
        caption: 'Площадь',
        sortingProperty: 'square',
        align: 'right',
    },
    {
        caption: 'Плотность населения чел/км2',
        sortingProperty: 'populationDensity',
        align: 'right',
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
            <GridView
                storeId={'SortingButton'}
                columns={columns}
                header={getHeader}
                canResetSorting={false}
            />
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
                    sorting: [{ square: 'ASC' }],
                },
            },
        };
    },
});
