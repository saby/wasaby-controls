import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View, IColumn } from 'Controls/grid';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const { getData } = Countries;

const columns: IColumn[] = Countries.getColumns();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <View
                storeId={'ResizerVisibility'}
                resizerVisibility={true}
                columns={columns}/>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResizerVisibility: {
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
    }
});
