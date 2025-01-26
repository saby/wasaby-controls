import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { View as TreeGridView, IColumnConfig, IRowProps } from 'Controls/treeGrid';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from '../../../../DemoHelpers/ExpandedSource';

const { getData } = Flat;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
];

interface IDemoProps extends IControlOptions {
    showTitle?: boolean;
}

function getRowProps(): IRowProps {
    return {
        levelIndentSize: 'xl',
    };
}

/**
 * Конфигурация иерархической таблицы с
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-offset-levelIndent-all-xl"
        >
            <TreeGridView
                storeId="OffsetsLevelIndentSizeAllSizeXL5"
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
            OffsetsLevelIndentSizeAllSizeXL5: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1],
                },
            },
        };
    },
});
