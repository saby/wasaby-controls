import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IColumn, View as GridView } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Model } from 'Types/entity';

const { getData } = Countries;

const columns: IColumn[] = Countries.getColumns();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const colspanCallback = React.useCallback(
        (item: Model, column: IColumn, columnIndex: number, isEditing: boolean): number | 'end' => {
            return [1, 3, 5, 7, 8, 11].indexOf(item.getKey()) !== -1 ? 'end' : undefined;
        },
        []
    );

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <GridView storeId="Base" columns={columns} colspanCallback={colspanCallback} />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Base: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
