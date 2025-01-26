import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, EditArrowComponent, IRowProps, View as GridView } from 'Controls/grid';
import { ActionsConnectedComponent } from 'Controls/list';
import { IAction } from 'Controls/interface';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

function getData() {
    return Countries.getData().slice(0, 1);
}

function CountryRatingNumber(): React.ReactElement {
    return (
        <div className="tw-flex tw-w-full tw-flex-col tw-flex-wrap controls-text-label">
            При ховере на этой области ячейки не будет подсветки и ItemActions
            <div
                className="tw-relative tw-cursor-pointer tw-flex
                           controls-margin_left-xl controls-padding_top-s controls-background-success controls-text-default
                           controls-ListView__item_showActions
                           controls-hover-background-success"
            >
                При ховере на этой области ячейки будет подсветка и ItemActions
                <EditArrowComponent backgroundStyle="success" />
                <ActionsConnectedComponent hoverBackgroundStyle="success" />
            </div>
        </div>
    );
}

const columns: IColumnConfig[] = [
    {
        width: '700px',
        render: <CountryRatingNumber />,
    },
];

const itemActions: IAction[] = getItemActions();

function getRowProps(_item: Model): IRowProps {
    return {
        hoverBackgroundStyle: 'transparent',
        showItemActionsOnHover: false,
        cursor: 'text',
    };
}

/**
 * Конфигурация таблицы с подсветкой произвольной области ячейки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                storeId="ItemActionsCustomHoverArea"
                columns={columns}
                getRowProps={getRowProps}
                itemActions={itemActions}
                itemActionsPosition="custom"
                backgroundStyle="unaccented"
            />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsCustomHoverArea: {
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
