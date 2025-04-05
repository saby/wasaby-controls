import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { IColumnConfig } from 'Controls/gridRender';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Model } from 'Types/entity';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumnConfig[] = Countries.getColumnsWithFixedWidths();

/**
 * Конфигурация фона при наведении курсора мыши в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const [hoveredCell, setHoveredCell] = React.useState('');

    const onHoveredCellChanged = React.useCallback(
        (item: Model, _container: HTMLElement, cell: number): void => {
            setHoveredCell(item ? 'key: ' + item.getKey() + '; cell: ' + cell : 'null');
        },
        [setHoveredCell]
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <div className="controlsDemo-toolbar-panel">
                Ховер на колонке c id {hoveredCell}
            </div>
            <GridView
                storeId="HoveredCell"
                onHoveredCellChanged={onHoveredCellChanged}
                columns={columns}
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
            HoveredCell: {
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
