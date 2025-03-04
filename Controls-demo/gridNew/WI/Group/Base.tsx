import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import 'css!Controls-demo/gridNew/WI/Group/Group';

const { getData } = Tasks;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'key',
        width: '30px',
    },
    {
        displayProperty: 'state',
        width: '200px',
    },
    {
        displayProperty: 'date',
        width: '100px',
    },
    {
        displayProperty: 'message',
        width: '200px',
        getCellProps() {
            return {
                textOverflow: 'ellipsis',
            };
        },
    },
];

/**
 * Конфигурация таблицы с группировкой по умолчанию
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ScrollContainer className="Controls-demo__gridNew_Group_Base_ScrollContainer">
                <GridView
                    storeId="Group"
                    rowSeparatorSize="s"
                    columns={columns}
                    groupProperty="fullName"
                />
            </ScrollContainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Group: {
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
