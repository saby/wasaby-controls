import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Memory, LOCAL_MOVE_POSITION, CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig, IHeaderConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import { ItemsEntity, DraggingTemplate } from 'Controls/dragnDrop';
import { ISelectionObject } from 'Controls/interface';

import { getData } from 'Controls-demo/gridReact/resources/Data';

// Данные и колонки
const getSource = (): Memory => {
    return new Memory({
        keyProperty: 'key',
        data: getData(),
    });
};
const getColumns = (): IColumnConfig[] => {
    return [
        { displayProperty: 'number', width: '30px', key: 'data-number' },
        { displayProperty: 'country', width: '250px', key: 'data-country' },
        { displayProperty: 'capital', width: '250px', key: 'data-capital' },
    ];
};
const getHeader = (): IHeaderConfig[] => {
    return [
        { caption: '', key: 'header-number' },
        { caption: 'Страна', key: 'header-country' },
        { caption: 'Столица', key: 'header-capital' },
    ];
};

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

export default React.forwardRef((props: object, ref: React.ForwardedRef<HTMLDivElement>) => {
    const gridViewRef = React.useRef<GridView>(null);

    const source = React.useMemo<Memory>(() => {
        return getSource();
    }, []);
    const header = React.useMemo<IHeaderConfig[]>(() => {
        return getHeader();
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);
    let items: RecordSet;
    const dataLoadCallback = React.useCallback(
        (_items: RecordSet) => {
            items = _items;
        },
        [items]
    );
    const getRowProps = React.useCallback<TGetRowPropsCallback>((item) => {
        return {};
    }, []);

    // reactive properties

    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const onSelectedKeysChanged = React.useCallback((value: CrudEntityKey[]) => {
        setSelectedKeys(value);
    }, []);

    // reactive properties

    // region eventHandlers

    const onDragStart = React.useCallback(
        (movedKeys: number[]) => {
            const firstItem = items.getRecordById(movedKeys[0]);

            return new ItemsEntity({
                items: movedKeys,
                title: `${firstItem.get('capital')} (${firstItem.get('country')})`,
            });
        },
        [items]
    );

    const onDragEnd = React.useCallback(
        (entity: ItemsEntity, target: Model, position: LOCAL_MOVE_POSITION) => {
            const selection: ISelectionObject = {
                selected: entity.getItems(),
                excluded: [],
            };
            gridViewRef.current?.moveItems(selection, target.getKey(), position);
        },
        [items]
    );

    // endregion eventHandlers

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <GridView
                ref={gridViewRef}
                header={header}
                selectedKeys={selectedKeys}
                columns={columns}
                source={source}
                multiSelectVisibility={'visible'}
                getRowProps={getRowProps}
                dataLoadCallback={dataLoadCallback}
                itemsDragNDrop={true}
                onCustomdragStart={onDragStart}
                onCustomdragEnd={onDragEnd}
                draggingTemplate={draggingTemplate}
                onSelectedKeysChanged={onSelectedKeysChanged}
                customEvents={['onCustomdragStart', 'onCustomdragEnd']}
            />
        </div>
    );
});
