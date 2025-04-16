import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments, ListSlice } from 'Controls/dataFactory';
import {
    useItemData,
    IColumnConfig,
    IHeaderConfig,
    ICellProps,
    View as GridView,
} from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { useSlice } from 'Controls-DataEnv/context';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Checkbox } from 'Controls/checkbox';
import { Number } from 'Controls/input';
import { DraggingTemplate } from 'Controls/dragnDrop';
import { ISelectionObject } from 'Controls/interface';
import { Collection } from 'Controls/display';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/WI/ColumnScroll/DragScrolling/DragScrolling';
import { Model } from 'Types/entity';

const { getData } = Countries;

const NotDraggableCell = React.memo(function NotDraggableCell() {
    const {
        renderValues: { country },
    } = useItemData(['country']);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#0c0c0c', width: '100%' }}>{country}</div>
            <div style={{ color: '#ccc', width: '100%' }}>
                Эта колонка не поддерживает Drag'n'drop
            </div>
        </div>
    );
});

const NotScrollableCell = React.memo(function NotScrollableCell() {
    return (
        <span style={{ backgroundColor: 'aliceblue', borderRadius: '5px', padding: '2px 4px' }}>
            За эту колонку нельзя скроллить
        </span>
    );
});

const DragScrollPopulationCell = React.memo(function DragScrollPopulationCell() {
    const {
        renderValues: { population },
    } = useItemData(['population']);
    return (
        <div>
            <div style={{ paddingLeft: '4px' }}>{population}</div>
            <div
                className="js-controls-DragScroll__notDraggable controls-List_DragNDrop__notDraggable tw-cursor-text"
                style={{
                    backgroundColor: 'bisque',
                    marginTop: '3px',
                    borderRadius: '5px',
                    padding: '0 4px',
                }}
            >
                Выдели меня, я не скролюсь
            </div>
        </div>
    );
});

const header: IHeaderConfig[] = [
    {
        caption: '#',
        startRow: 1,
        endRow: 3,
        startColumn: 1,
        endColumn: 2,
    },
    {
        caption: 'Географические данные',
        startRow: 1,
        endRow: 2,
        startColumn: 2,
        endColumn: 4,
        align: 'center',
    },
    {
        caption: 'Страна',
        startRow: 2,
        endRow: 3,
        startColumn: 2,
        endColumn: 3,
    },
    {
        caption: 'Столица',
        startRow: 2,
        endRow: 3,
        startColumn: 3,
        endColumn: 4,
    },
    {
        caption: 'Колонка с выключенным перемещением мышью',
        startRow: 1,
        endRow: 3,
        startColumn: 4,
        endColumn: 5,
    },
    {
        caption: 'Цифры',
        startRow: 1,
        endRow: 2,
        startColumn: 5,
        endColumn: 8,
        align: 'center',
    },
    {
        caption: 'Население',
        startRow: 2,
        endRow: 3,
        startColumn: 5,
        endColumn: 6,
    },
    {
        caption: 'Площадь км2',
        startRow: 2,
        endRow: 3,
        startColumn: 6,
        endColumn: 7,
    },
    {
        caption: 'Плотность населения чел/км2',
        startRow: 2,
        endRow: 3,
        startColumn: 7,
        endColumn: 8,
    },
];

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '300px',
        render: <NotDraggableCell />,
        getCellProps(): ICellProps {
            return {
                cursor: 'default',
                className: 'controls-List_DragNDrop__notDraggable',
            };
        },
    },
    {
        displayProperty: 'capital',
        width: 'max-content',
        compatibleWidth: '98px',
    },
    {
        width: '200px',
        render: <NotScrollableCell />,
        getCellProps(): ICellProps {
            return {
                cursor: 'default',
                className: 'js-controls-DragScroll__notDraggable',
            };
        },
    },
    {
        displayProperty: 'population',
        width: 'max-content',
        compatibleWidth: '100px',
        render: <DragScrollPopulationCell />,
        getCellProps(): ICellProps {
            return {
                cursor: 'text',
            };
        },
    },
    {
        displayProperty: 'square',
        width: 'max-content',
        compatibleWidth: '83px',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
        compatibleWidth: '175px',
    },
];

// Шаблон перемещения
const draggingTemplate = React.forwardRef(
    (props: { entity: ItemsEntity }, ref: React.LegacyRef<DraggingTemplate>) => {
        return (
            <DraggingTemplate
                forwardedRef={ref}
                {...props}
                mainText={(props.entity.getOptions() as { title: string }).title}
            />
        );
    }
);

/**
 * Конфигурация таблицы с расширенными возможностями горизонтального скролла
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('ColumnScrollDragScrolling') as ListSlice;
    const items = slice?.state.items;

    const [itemsDragNDrop, setItemsDragNDrop] = React.useState(true);
    const [dragScrolling, setDragScrolling] = React.useState(true);
    const [dragNDropDelay, setDragNDropDelay] = React.useState(250);
    const gridViewRef = React.useRef<GridView>(null);

    // eslint-disable-next-line
    const onCustomdragStart = React.useCallback(
        (draggedKeys: number[]): ItemsEntity => {
            let title = '';
            draggedKeys.forEach((draggedItemKey) => {
                title += items.getRecordById(draggedItemKey).get('country') + ', ';
            });
            return new ItemsEntity({
                items: draggedKeys,
                title: title.trim().slice(0, title.length - 2),
            });
        },
        [items]
    );

    const onCustomdragEnd = React.useCallback(
        (entity: Collection<Model>, target: Model, position: string): void => {
            const targetKey = target?.getKey ? target.getKey() : target;
            const selection: ISelectionObject = {
                selected: entity.getItems(),
                excluded: [],
            };
            gridViewRef.current?.moveItems(selection, targetKey, position);
        },
        []
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <Checkbox
                readOnly={false}
                value={itemsDragNDrop}
                onValueChanged={setItemsDragNDrop}
                caption="Drag'N'Drop"
            />
            <Checkbox
                readOnly={false}
                value={dragScrolling}
                onValueChanged={setDragScrolling}
                caption="Перемещение мышкой"
            />

            <div className="controlDemo__input-row">
                Drag'N'Drop delay in ms
                <Number
                    style={{ marginLeft: '10px' }}
                    value={dragNDropDelay}
                    onValueChanged={setDragNDropDelay}
                    placeholder="Drag'N'Drop delay in ms"
                />
            </div>

            <ScrollContainer className="controlsDemo__inline-flex Controls-demo__gridNew_ColumnScroll_DragScrolling">
                <GridView
                    ref={gridViewRef}
                    storeId="ColumnScrollDragScrolling"
                    header={header}
                    columns={columns}
                    rowSeparatorSize="s"
                    itemsDragNDrop={itemsDragNDrop}
                    columnScroll={true}
                    columnScrollStartPosition="end"
                    draggingTemplate={draggingTemplate}
                    dragNDropDelay={dragNDropDelay}
                    dragScrolling={dragScrolling}
                    onCustomdragEnd={onCustomdragEnd}
                    onCustomdragStart={onCustomdragStart}
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
            ColumnScrollDragScrolling: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
