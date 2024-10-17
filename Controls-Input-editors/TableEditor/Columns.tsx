import { View as ListView } from 'Controls/list';
import { Memory } from 'Types/source';
import { Button } from 'Controls/buttons';
import { Stack } from 'Controls/popup';
import { Record } from 'Types/entity';
import { ItemsEntity } from 'Controls/dragnDrop';
import { RecordSet } from 'Types/collection';
import rk = require('i18n!Controls');
import { isEqual } from 'Types/object';
import { useContext, useState, Fragment, useRef, useEffect } from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { TItemActionShowType } from 'Controls/itemActions';
import type { IFieldItem } from 'Controls-editors/properties';
import React = require('react');
import { Title } from 'Controls/heading';

const KEY_PROPERTY = 'name';

export interface IColumn {
    name: string;
}

interface IColumnsChooser {
    tableName: string[];
    columns: IColumn[];
}

const itemPadding = { left: 'null' };
const customEvents = ['onCustomdragStart', 'onCustomdragEnd'];

function Columns(props: IColumnsChooser): JSX.Element {
    const { columns = [], tableName, LayoutComponent = Fragment } = props;
    const dataContext = useContext(DataContext) as {
        FieldData: Slice<IFieldItem[]>;
    };
    const joinedTableName = tableName.join('.');
    const tableColumns = dataContext?.FieldData?.state.fields.filter(byTableName) || [];
    const nodeRef = useRef();
    const [source, setSource] = useState(() =>
        new Memory({
            data: [ ...(columns || []) ],
            keyProperty: KEY_PROPERTY,
        })
    );
    const itemActions = [
        {
            id: 'delete',
            icon: 'icon-Trash-bucket',
            iconStyle: 'danger',
            title: rk('Удалить'),
            showType: TItemActionShowType.MENU,
            handler: (item: Record) => {
                const newData = source.data.filter(
                    (column) => column[KEY_PROPERTY] !== item.get(KEY_PROPERTY)
                );
                updateSource(newData);
            },
        },
    ];

    useEffect(() => {
        if (!isEqual(columns, source.data)) {
            setSource(
                new Memory({
                    data: columns,
                    keyProperty: KEY_PROPERTY,
                })
            );
        }
    }, [columns]);

    function byTableName(item: { Title: string }): boolean {
        return (
            item.Parent === joinedTableName && item.Type !== 'RecordSet' && item.Type
        );
    }

    function updateSource(newData: object[]) {
        setSource(
            new Memory({
                data: newData,
                keyProperty: KEY_PROPERTY,
            })
        );

        props.onChange?.([...newData]);
    }

    function openColumnsSelector(): void {
        const stackOpener = new Stack();
        const selectedKeys = columns
            .map((item) => {
                const columnTitle = joinedTableName + '.' + item.name;
                const columnItem = tableColumns.find((col) => col.Title === columnTitle);

                return columnItem?.Id || null;
            })
            .filter((col) => col !== null);

        stackOpener.open({
            template: 'Controls-Input-editors/TableEditor/ColumnsStack',
            width: 700,
            templateOptions: {
                tableColumns,
                selectedKeys,
            },
            opener: nodeRef.current,
            eventHandlers: {
                onResult: (data) => {
                    updateSource(getDataFromStack(data));
                },
            },
        });
    }

    function onCustomDragStart(items: unknown, item: number): ItemsEntity {
        return new ItemsEntity({
            items: [item],
        });
    }

    function onCustomDragEnd(entity: ItemsEntity, target: Record): void {
        const items = source.data;
        const dragName = entity.getItems()[0];
        const dragElement = items.find((item) => item.name === dragName);
        const draggedPosition = items.findIndex((item) => item.name === dragName);
        const replacingPosition = items.findIndex((item) => item.name === target.get(KEY_PROPERTY));

        items.splice(draggedPosition, 1);
        items.splice(replacingPosition, 0, dragElement);

        updateSource(items);
    }

    return (
        <LayoutComponent title={null}>
            <div ref={nodeRef}>
                <Title
                    readOnly={true}
                    caption={rk('Колонки')}
                    fontSize="xs"
                    className="controls-margin_top-m controls-margin_bottom-m controls_PropertyGrid__title"
                ></Title>
                <ListView
                    source={source}
                    keyProperty={KEY_PROPERTY}
                    displayProperty={KEY_PROPERTY}
                    itemActions={itemActions}
                    itemsDragNDrop={true}
                    customEvents={customEvents}
                    onCustomdragStart={onCustomDragStart}
                    onCustomdragEnd={onCustomDragEnd}
                    markerVisibility="hidden"
                    itemPadding={itemPadding}
                ></ListView>
                <div className="controls-margin_top-xs">
                    <Button
                        caption={`+ ${rk('Добавить')}`}
                        fontColorStyle="unaccented"
                        viewMode="link"
                        onClick={openColumnsSelector}
                    ></Button>
                </div>
            </div>
        </LayoutComponent>
    );
}

export default Columns;

function getDataFromStack(data: RecordSet): object[] {
    const columns = [];

    data.forEach((item) => {
        columns.push({
            [KEY_PROPERTY]: item.get('DisplayName'),
        });
    });

    return columns;
}
