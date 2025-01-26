import { RecordSet } from 'Types/collection';
import { ItemsView } from 'Controls/grid';
import { IColumn, IHeaderCell } from 'Controls/gridDisplay';
import { ArrayMeta, Meta } from 'Meta/types';
import * as React from 'react';
import { Model, Record } from 'Types/entity';
import { StackOpener } from 'Controls/popup';
import { StackTemplate } from 'Controls-editors/_recordset/components/StackTemplate';
import { Button } from 'Controls/buttons';
import { IItemAction } from 'Controls/interface';
import { TKey } from 'Controls/interface';
import { showType } from 'Controls/toolbars';
import 'css!Controls-editors/_recordset/style';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Fragment } from 'react';

export interface IEditor<T> {
    value: RecordSet;
    onChange: (value: RecordSet) => void;
    metaType: ArrayMeta<T[]>;
    columns: IColumn[];
    header: IHeaderCell[];
    keyProperty?: TKey;
}

function getItemValueByProperties(
    item: Model,
    properties: Record<string, Meta<unknown>>
): Record<string, unknown> {
    const result = {};
    const attrs = Object.getOwnPropertyNames(properties);
    for (let i = 0; i < attrs.length; i++) {
        const property = attrs[i];
        result[property] = item.get(property);
    }
    return result;
}

const KEY_PREFIX = 'added_item';
const MOVE_DOWN_ACTION = 'moveDown';
const MOVE_UP_ACTION = 'moveUp';

function openStack<T>(
    value: Record<string, unknown>,
    onChange: (value: Record<string, unknown>) => void,
    metaType: T
) {
    const stack = new StackOpener();
    stack.open({
        template: StackTemplate,
        templateOptions: {
            metaType,
            value,
            onChange,
        },
        closeOnOutsideClick: true,
    });
}
function getItemActions() {
    return [
        {
            id: MOVE_UP_ACTION,
            icon: 'icon-ArrowUp',
            iconStyle: 'secondary',
            tooltip: 'Переместить вверх',
            title: 'Переместить вверх',
            showType: showType.MENU,
        },
        {
            id: MOVE_DOWN_ACTION,
            icon: 'icon-ArrowDown',
            iconStyle: 'secondary',
            tooltip: 'Переместить вниз',
            title: 'Переместить вниз',
            showType: showType.MENU,
        },
        {
            id: 'delete',
            icon: 'icon-Erase',
            iconStyle: 'danger',
            tooltip: 'Удалить',
            title: 'Удалить',
            showType: showType.MENU_TOOLBAR,
        },
    ];
}

export function Editor<RuntimeInterface>(props: IEditor<RuntimeInterface>) {
    const {
        value: items,
        metaType,
        onChange,
        columns,
        header,
        keyProperty,
        LayoutComponent = Fragment,
    } = props;
    const itemMeta = metaType.getItemMeta();
    const title = metaType.getTitle();
    const properties = React.useMemo(() => {
        return itemMeta?.getProperties() || {};
    }, [itemMeta]);
    const defaultValue = itemMeta.getDefaultValue();
    const onItemChanged = React.useCallback(
        (item: Model, newValue: Record<string, unknown>) => {
            const nextItems = items.clone();
            nextItems.getRecordById(item.getKey()).set({ ...defaultValue, ...newValue });
            onChange(nextItems);
        },
        [items, defaultValue, onChange]
    );
    const onItemClick = React.useCallback(
        (item: Model) => {
            const itemValue = getItemValueByProperties(item, properties);
            openStack(
                itemValue,
                (newValue: Record<string, unknown>) => {
                    onItemChanged(item, newValue);
                },
                itemMeta
            );
        },
        [onItemChanged, itemMeta, properties]
    );
    const onAddItem = React.useCallback(
        (newValue: Record<string, unknown>) => {
            const nextItems = items.clone();
            const keyProperty = nextItems.getKeyProperty();
            const newItem = new RecordSet({
                keyProperty,
                rawData: [
                    {
                        [keyProperty]: `${KEY_PREFIX}_${Date.now()}`,
                        ...newValue,
                    },
                ],
            });
            nextItems.append(newItem);
            onChange(nextItems);
        },
        [items, onChange]
    );
    const onAddButtonClick = React.useCallback(() => {
        openStack(
            defaultValue,
            (newValue: Record<string, unknown>) => {
                onAddItem(newValue);
            },
            itemMeta
        );
    }, [itemMeta, defaultValue, onAddItem]);
    const onActionClick = React.useCallback(
        (action: IItemAction, item: Model) => {
            const nextItems = items.clone();
            const itemIndex = items.getIndex(item);
            if (action.id === 'delete') {
                nextItems.removeAt(itemIndex);
            } else if (action.id === MOVE_UP_ACTION) {
                nextItems.move(itemIndex, itemIndex - 1);
            } else if (action.id === MOVE_DOWN_ACTION) {
                nextItems.move(itemIndex, itemIndex + 1);
            }
            onChange(nextItems);
        },
        [items, onChange]
    );
    const itemActionVisibilityCallback = React.useCallback(
        (itemAction: IItemAction, item: Model): boolean => {
            const itemIndex = items.getIndex(item);
            if (itemAction.id === MOVE_DOWN_ACTION && itemIndex === items.getCount() - 1) {
                return false;
            } else if (itemAction.id === MOVE_UP_ACTION && itemIndex === 0) {
                return false;
            }
            return true;
        },
        [items]
    );
    const onDragEnd = React.useCallback(
        (entity: ItemsEntity, target: Model) => {
            const nextItems = items.clone();
            const movingItemKey = entity.getItems().pop();
            const targetItemKey = target.getKey();
            const movingItem = nextItems.getRecordById(movingItemKey);
            const targetItem = nextItems.getRecordById(targetItemKey);
            const movingItemIndex = nextItems.getIndex(movingItem);
            const targetItemIndex = nextItems.getIndex(targetItem);
            nextItems.move(movingItemIndex, targetItemIndex);
            onChange(nextItems);
        },
        [items, onChange]
    );
    return (
        <LayoutComponent titlePosition={'none'}>
            <div className={'tw-w-full'}>
                <div className={'controls-recordsetEditor_addButton_padding-left'}>
                    <span className={'controls-recordsetEditor_title'}>{title}</span>

                    <Button
                        viewMode={'filled'}
                        icon={'icon-Addition'}
                        buttonStyle={'pale'}
                        iconStyle={'default'}
                        inlineHeight={'m'}
                        onClick={onAddButtonClick}
                    />
                </div>
                <ItemsView
                    items={items}
                    columns={columns}
                    header={header}
                    keyProperty={keyProperty}
                    onItemClick={onItemClick}
                    itemActions={getItemActions()}
                    onActionClick={onActionClick}
                    itemActionVisibilityCallback={itemActionVisibilityCallback}
                    itemsDragNDrop={true}
                    onCustomdragEnd={onDragEnd}
                    customEvents={['onCustomdragEnd']}
                />
            </div>
        </LayoutComponent>
    );
}
