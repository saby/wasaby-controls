import * as React from 'react';
import { Memory } from 'Types/source';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, View as GridView } from 'Controls/grid';
import { TInternalProps } from 'UICore/Executor';
import { ConnectedCustomNavigationButton } from 'Controls/list';

const { getData } = Tasks;

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const columns = [
        {
            width: '200px',
            key: 'fullName',
            displayProperty: 'fullName',
            getCellProps: (): ICellProps => ({
                borderStyle: 'default',
                borderVisibility: 'visible',
            }),
        },
        {
            width: '100px',
            key: 'key',
            displayProperty: 'key',
            getCellProps: (): ICellProps => ({
                borderStyle: 'default',
                borderVisibility: 'visible',
            }),
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
    ];
    const footer = [
        {
            render: <div></div>,
        },
        {
            render: (
                <div>
                    <ConnectedCustomNavigationButton />
                </div>
            ),
        },
    ];
    return (
        <div className={'controlsDemo__wrapper controlsDemo_widthFit'} ref={ref}>
            <GridView
                storeId={'NavigationDemandWithGroups'}
                columns={columns}
                header={header}
                footer={footer}
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
                    navigation: {
                        source: 'page',
                        view: 'cut',
                        sourceConfig: {
                            pageSize: 4,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            buttonConfig: { buttonPosition: 'custom' },
                        },
                    },
                },
            },
        };
    },
});
