import { View } from 'Controls/grid';
import { View as Panel } from 'Controls-ListEnv/bottomBarConnected';
import { Memory } from 'Types/source';
import * as React from 'react';

const listData = [
    {
        id: 0,
        name: 'Александр',
        city: 'Ярославль',
    },
    {
        id: 1,
        name: 'Алексей',
        city: 'Рыбинск',
    },
    {
        id: 2,
        name: 'Дмитрий',
        city: 'Ярославль',
    },
    {
        id: 3,
        name: 'Андрей',
        city: 'Рыбинск',
    },
];
const columns = [{ displayProperty: 'name' }, { displayProperty: 'city' }];
const header = [{ title: 'Имя' }, { title: 'Город проживания' }];

function OperationsButtonConnectedDemo(_, ref: React.ForwardedRef<unknown>): JSX.Element {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div className={'controlsDemo__wrapper'} ref={ref}>
            <Panel storeId={'persons'} expanded={expanded} onExpandedChanged={setExpanded} />
            <View storeId={'persons'} columns={columns} header={header} />
        </div>
    );
}

const forwardedOperationsButtonDemo = React.forwardRef(OperationsButtonConnectedDemo);
// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
// @ts-ignore
forwardedOperationsButtonDemo.getLoadConfig = function () {
    return {
        persons: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: listData,
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                displayProperty: 'title',
                listActions: 'Controls-ListEnv-demo/OperationsConnected/Button/listActions',
                operationsPanelVisible: false,
            },
        },
    };
};
export default forwardedOperationsButtonDemo;
