import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, IRowProps, useItemData, View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';
import NodeTemplate from './NodeTemplate';
import SecondNode from './SecondNode';

function getData() {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            population: 143420300,
            footer: 'Страна великой культуры, бескрайних просторов и богатых традиций',
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            population: 32805000,
            footer: 'Страна кленового сиропа, хоккея и удивительных северных пейзажей',
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            population: 295734100,
            footer: 'Родина джаза, бейсбола и знаменитых национальных парков',
        },
        {
            key: 3,
            number: 4,
            country: 'Китай',
            population: 1306313800,
            footer: 'Страна панд, чайных церемоний и великой китайской кухни',
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            population: 186112800,
            footer: 'Дом карнавалов, футбола и прекрасных тропических пляжей',
        },
    ];
}

const headers = [
    {
        width: '200px',
        key: 'countryHeader',
        caption: 'Страна',
    },
    {
        width: '200px',
        key: 'Популяция',
        caption: 'Популяция',
    },
];

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const columns = [
        {
            render: <NodeTemplate />,
            width: '300px',
            key: 'country',
        },
        {
            key: 'population',
            displayProperty: 'population',
            render: <SecondNode />,
        },
    ];

    return (
        <div ref={ref}>
            <div className={'controlsDemo__wrapper'}>
                <View storeId="ColspanContent" columns={columns} header={headers} />
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColspanContent: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    displayProperty: 'country',
                },
            },
        };
    },
});
