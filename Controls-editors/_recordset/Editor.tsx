import { View as GridView } from 'Controls/grid';
import * as React from 'react';
import { Model, Record } from 'Types/entity';
import { Button } from 'Controls/buttons';
import { IItemAction } from 'Controls/interface';
import { ItemsEntity } from 'Controls/dragnDrop';
import { useSlice } from 'Controls-DataEnv/context';
import { Fragment } from 'react';
import { IEditorValidation, IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import 'css!Controls-editors/_recordset/style';
import { Provider } from 'Controls-DataEnv/context';
import { Input } from 'Controls-ListEnv/searchConnected';
import {
    ITEM_ACTIONS,
    MOVE_UP_ACTION,
    MOVE_DOWN_ACTION,
} from 'Controls-editors/_recordset/constants';
import { openStack, filterItem, getViewConfig } from 'Controls-editors/_recordset/utils';
import { IEditor } from 'Controls-editors/_recordset/interface';
import { getWasabyContext } from 'UICore/Contexts';
import { Meta } from 'Meta/types';
import { ExpanderButton } from 'Controls-editors/_recordset/components/ExpanderButton';
import { error as dataSourceError } from 'Controls/dataSource';
import MetaTypeContextProvider from 'Controls-editors/_recordset/context/MetaTypeContextProvider';

export interface IEditorProps<RuntimeInterface> extends IEditor<RuntimeInterface> {
    /**
     * Обработчик клика по строке
     */
    onItemClick?(
        value: Record,
        onChange: (value: Record) => void,
        metaType: Meta,
        pgFactoryArguments: Partial<IObjectTypeFactoryArguments>,
        validation?: IEditorValidation,
        readOnly?: boolean
    ): void;
}

export function Editor<RuntimeInterface>(props: IEditorProps<RuntimeInterface>) {
    const {
        value: items,
        metaType,
        onChange,
        columns,
        header,
        keyProperty,
        LayoutComponent = Fragment,
        propertyGridStoreId,
        validation,
        onItemClick: propsOnItemClick,
        onBeforeCreate,
    } = props;
    const editorRef = React.useRef();
    const itemMeta = metaType.getItemMeta();
    const title = metaType.getTitle();
    const isDisabled = metaType.isDisabled();
    const properties = React.useMemo(() => {
        return itemMeta?.getProperties() || {};
    }, [itemMeta]);
    const defaultValue = itemMeta.getDefaultValue();

    const { readOnly } = React.useContext(getWasabyContext());

    const pgEditorSlice = useSlice(propertyGridStoreId);
    const pgEditorState = pgEditorSlice?.state as Partial<IObjectTypeFactoryArguments>;

    const onItemChanged = React.useCallback(
        (item: Record, newValue: Record) => {
            const nextItems = items.clone();
            Object.getOwnPropertyNames(defaultValue).forEach((name) => {
                if (newValue.get(name) === null) {
                    newValue.set(name, defaultValue[name]);
                }
            });
            nextItems.getRecordById(item.getKey()).setRawData(newValue.getRawData());
            onChange(nextItems);
        },
        [items, defaultValue, onChange]
    );
    const onItemClick = React.useCallback(
        (item: Record) => {
            (propsOnItemClick ?? openStack)(
                item,
                (newValue: Record) => {
                    onItemChanged(item, newValue);
                },
                itemMeta,
                pgEditorState,
                editorRef.current,
                validation,
                readOnly
            );
        },
        [
            onItemChanged,
            itemMeta,
            defaultValue,
            pgEditorState,
            validation,
            readOnly,
            propsOnItemClick,
        ]
    );
    const onAddItem = React.useCallback(
        (newValue: Record) => {
            const nextItems = items.clone();
            Object.getOwnPropertyNames(defaultValue).forEach((name) => {
                if (newValue.get(name) === null) {
                    newValue.set(name, defaultValue[name]);
                }
            });
            nextItems.add(newValue);
            onChange(nextItems);
        },
        [items, onChange, defaultValue]
    );
    const onAddButtonClick = React.useCallback(async () => {
        try {
            const newItem = onBeforeCreate
                ? await onBeforeCreate(itemMeta)
                : new Record({
                      adapter: items.getAdapter(),
                      format: items.getFormat(),
                  });
            (propsOnItemClick ?? openStack)(
                newItem,
                (newValue: Record) => {
                    onAddItem(newValue);
                },
                itemMeta,
                pgEditorState,
                editorRef.current,
                validation,
                readOnly
            );
        } catch (error: unknown) {
            await dataSourceError.process({ error: error as Error });
        }
    }, [itemMeta, defaultValue, onAddItem, pgEditorState, validation, readOnly, propsOnItemClick]);

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
    const [isExpanded, setIsExpanded] = React.useState(true);
    const isEmptyRecordset = React.useMemo(() => {
        return items && items.getCount() === 0;
    }, [items]);
    const loadResults = React.useMemo(() => {
        if (!items) {
            return null;
        }
        return {
            recordsetEditorView: {
                items,
            },
        };
    }, [items]);
    const onSearch = React.useCallback(
        (item, query: { searchValue: string }) => {
            const searchValue = query.searchValue;
            return filterItem(searchValue, item, properties);
        },
        [properties]
    );
    const viewConfig = React.useMemo(() => {
        if (!items) {
            return null;
        }
        return getViewConfig(
            items.getRawData(),
            items.getKeyProperty(),
            items.getAdapter(),
            onSearch
        );
    }, [items, onSearch]);

    return (
        <LayoutComponent titlePosition={'none'}>
            <div className={'tw-w-full'} ref={editorRef}>
                {!!loadResults ? (
                    <Provider configs={viewConfig} loadResults={loadResults}>
                        <>
                            <div className={'tw-grid controls-recordsetEditor_header'}>
                                <div className={'tw-flex tw-items-baseline'}>
                                    <ExpanderButton
                                        caption={title}
                                        isExpanded={isExpanded}
                                        onClick={() => {
                                            setIsExpanded(!isExpanded);
                                        }}
                                    />
                                    {!isDisabled && (
                                        <Button
                                            viewMode={'filled'}
                                            icon={'icon-Addition'}
                                            buttonStyle={'pale'}
                                            iconStyle={'default'}
                                            inlineHeight={'m'}
                                            onClick={onAddButtonClick}
                                            className={
                                                'controls-recordsetEditor_addButton_margin-left'
                                            }
                                        />
                                    )}
                                </div>
                                {isExpanded && !isEmptyRecordset && (
                                    <Input storeId={'recordsetEditorView'} />
                                )}
                            </div>
                            {isExpanded ? (
                                <MetaTypeContextProvider metaType={itemMeta}>
                                    <GridView
                                        storeId={'recordsetEditorView'}
                                        columns={columns}
                                        itemPadding={{
                                            left: 'null',
                                        }}
                                        header={header}
                                        keyProperty={keyProperty}
                                        onItemClick={onItemClick}
                                        keepScrollAfterReload={true}
                                        itemActions={!isDisabled ? ITEM_ACTIONS : []}
                                        onActionClick={onActionClick}
                                        itemActionVisibilityCallback={itemActionVisibilityCallback}
                                        itemsDragNDrop={true}
                                        onCustomdragEnd={onDragEnd}
                                        customEvents={['onCustomdragEnd']}
                                    />
                                </MetaTypeContextProvider>
                            ) : null}
                        </>
                    </Provider>
                ) : (
                    <ExpanderButton
                        caption={title}
                        isExpanded={isExpanded}
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                        }}
                    />
                )}
            </div>
        </LayoutComponent>
    );
}
