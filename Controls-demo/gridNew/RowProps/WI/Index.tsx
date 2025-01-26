import * as React from 'react';
import { Memory } from 'Types/source';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IRowProps, View as GridView } from 'Controls/grid';
import { TInternalProps } from 'UICore/Executor';

const { getData } = Tasks;

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const columns = [
        {
            width: '200px',
            key: 'fullName',
            displayProperty: 'fullName',
        },
        {
            width: '100px',
            key: 'key',
            displayProperty: 'key',
        },
        {
            width: '100px',
            key: 'date',
            displayProperty: 'date',
        },
    ];
    const header = [
        {
            width: '200px',
            key: 'fullNameHeader',
            caption: 'Имя',
        },
        {
            width: '100px',
            key: 'key',
            caption: 'Ключ',
        },
        {
            width: '100px',
            key: 'date',
            caption: 'Дата',
        },
    ];
    return (
        <div className={'controlsDemo__wrapper'} ref={ref}>
            <GridView
                storeId={'NavigationDemandWithGroups'}
                columns={columns}
                header={header}
                getRowProps={(item): IRowProps => ({
                    borderVisibility: 'visible',
                    borderStyle: 'default',
                    roundAngleTR: item.get('key') % 2 === 1 ? 'xl' : null,
                    roundAngleBR: item.get('key') % 2 === 0 ? 's' : null,
                })}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationDemandWithGroups: {
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
