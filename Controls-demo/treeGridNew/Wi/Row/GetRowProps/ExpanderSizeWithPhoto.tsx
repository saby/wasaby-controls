import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView, IRowProps } from 'Controls/treeGrid';
import { IColumnConfig, useItemData } from 'Controls/grid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import 'css!Controls-demo/treeGridNew/Wi/Row/GetRowProps/GetRowProps';

const { getData } = Flat;

function CellRenderWithPhoto(): React.ReactElement {
    const {
        renderValues: { subtask, photo, type, title },
    } = useItemData(['subtask', 'photo', 'type', 'title']);
    if (subtask) {
        return <span className="ws-link">подзадача</span>;
    }
    return (
        <>
            {photo ? (
                <img
                    className="tw-self-start Controls-demo__treeGridNew_Row_GetRowProps_image"
                    src={photo}
                />
            ) : null}
            {type === null ? (
                <div className="tw-self-start Controls-demo__treeGridNew_Row_GetRowProps_image" />
            ) : null}
            <span>{title}</span>
        </>
    );
}

const columns: IColumnConfig[] = [
    {
        render: <CellRenderWithPhoto />,
    },
    {
        displayProperty: 'rating',
    },
    {
        displayProperty: 'country',
    },
];

function getRowProps(): IRowProps {
    return {
        cursor: 'default',
        hoverBackgroundStyle: 'transparent',
        // В зависимости от стандартного размера фото в строке
        // для 16x16 px — "s",
        // для 24x24 px — "m",
        // для 32x32 px — "l",
        // для 40x40 px — "xl".
        expanderSize: 's',
    };
}

/**
 * Конфигурация иерархической таблицы с отступом под фото в шаблоне ячейки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth1700">
            <TreeGridView
                storeId="ItemTemplateWithPhotoPhoto16px3"
                columns={columns}
                getRowProps={getRowProps}
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
            ItemTemplateWithPhotoPhoto16px3: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 15, 153],
                },
            },
        };
    },
});
