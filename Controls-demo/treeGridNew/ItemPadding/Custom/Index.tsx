import * as React from 'react';
import { Memory } from 'Types/source';
import { View as TreeGridView, IColumnConfig } from 'Controls/treeGrid';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';
import { IPadding } from 'Controls/interface';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IComponentProps, IComponentTheme } from 'Controls/interface';

const { getData } = Flat;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
];

const itemPadding: IPadding = {
    left: 'XXL',
    right: 'null',
};

interface IDemoProps extends IComponentProps, IComponentTheme {
    showTitle?: boolean;
}

/**
 * Конфигурация иерархической таблицы с кнопкой "Ещё" в подвале развёрнутого узла по умолчанию
 * @param props
 * @param ref
 * @constructor
 */
function Demo(props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const showTitle = props.showTitle !== false;
    return (
        <div ref={ref} className="controlsDemo__wrapper__padding-left ws-flexbox ws-flex-wrap">
            <div
                className={`controlsDemo__cell controlsDemo__fixedWidth-s_theme-${props.theme} controlsDemo_treeGrid-iP-custom`}
            >
                {showTitle ? (
                    <div className="controls-text-label">Настраиваемые отступы</div>
                ) : null}
                <TreeGridView
                    storeId="ItemPaddingCustom0"
                    columns={columns}
                    itemPadding={itemPadding}
                />
            </div>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemPaddingCustom0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
