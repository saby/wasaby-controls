import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Memory, LOCAL_MOVE_POSITION, CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig, IHeaderConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import { ItemsEntity, DraggingTemplate } from 'Controls/dragnDrop';
import { ISelectionObject } from 'Controls/interface';
import { DataContext } from 'Controls-DataEnv/context';
import {
    IListDataFactoryArguments,
    IDataConfig,
    IListState,
    ListSlice,
} from 'Controls/dataFactory';

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
        {
            displayProperty: 'number',
            width: '30px',
            key: 'data-number',
        },
        {
            displayProperty: 'country',
            width: '250px',
            key: 'data-country',
        },
        {
            displayProperty: 'capital',
            width: '250px',
            key: 'data-capital',
        },
    ];
};
const getHeader = (): IHeaderConfig[] => {
    return [
        {
            caption: '',
            key: 'header-number',
        },
        {
            caption: 'Страна',
            key: 'header-country',
        },
        {
            caption: 'Столица',
            key: 'header-capital',
        },
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

function Demo(props: object, ref: React.ForwardedRef<HTMLDivElement>) {
    const gridViewRef = React.useRef<GridView>(null);
    const context = React.useContext(DataContext);
    const slice = context.GridReactDragNDrop as ListSlice & IListState;
    const items: RecordSet = slice.items;

    const header = React.useMemo<IHeaderConfig[]>(() => {
        return getHeader();
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);
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
                storeId={'GridReactDragNDrop'}
                getRowProps={getRowProps}
                itemsDragNDrop={true}
                onCustomdragStart={onDragStart}
                onCustomdragEnd={onDragEnd}
                draggingTemplate={draggingTemplate}
                onSelectedKeysChanged={onSelectedKeysChanged}
                customEvents={['onCustomdragStart', 'onCustomdragEnd']}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GridReactDragNDrop: {
                dataFactoryName: 'Controls-demo/gridNew/Results/TextOverflow/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'capital',
                    keyProperty: 'key',
                    source: getSource(),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    },
});
