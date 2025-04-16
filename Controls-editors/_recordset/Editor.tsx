import { View as GridView } from 'Controls/grid';
import * as React from 'react';
import { Model, Record } from 'Types/entity';
import { Button } from 'Controls/buttons';
import { IItemAction } from 'Controls/interface';
import { ItemsEntity } from 'Controls/dragnDrop';
import { useSlice } from 'Controls-DataEnv/context';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Fragment } from 'react';
import { IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import 'css!Controls-editors/_recordset/style';
import { Provider } from 'Controls-DataEnv/context';
import { Input } from 'Controls-ListEnv/searchConnected';
import {
    ITEM_ACTIONS,
    MOVE_UP_ACTION,
    MOVE_DOWN_ACTION,
    SET_UP_ACTION,
    MIN_STACK_WIDTH,
    MAX_STACK_WIDTH,
    DELETE_ACTION,
} from 'Controls-editors/_recordset/constants';
import {
    openStack,
    filterItem,
    getViewConfig,
    prepareColumns,
} from 'Controls-editors/_recordset/utils';
import { IEditor, IOpenStackParams, IPopupConfig } from 'Controls-editors/_recordset/interface';
import { ExpanderButton } from 'Controls-editors/_recordset/components/ExpanderButton';
import { error as dataSourceError } from 'Controls/dataSource';
import { Opener } from 'Controls/popup';
import { StackTemplate } from 'Controls-editors/_recordset/components/StackTemplate';
import MetaTypeContextProvider from 'Controls-editors/_recordset/context/MetaTypeContextProvider';
import ContextProvider from 'Controls-editors/_recordset/context/ContextProvider';
import { Container } from 'Controls/scroll';
import PropertyGridContextProvider from 'Controls-editors/_recordset/context/PropertyGridContextProvider';

export interface IEditorProps<RuntimeInterface> extends IEditor<RuntimeInterface> {
    /**
     * Обработчик клика по строке
     */
    onItemClick?(params: IOpenStackParams<RuntimeInterface>): void;
}

export function Editor<RuntimeInterface>(props: IEditorProps<RuntimeInterface>) {
    const {
        value: items,
        metaType,
        onChange,
        displayProperties,
        columns,
        header,
        editMode = 'popup',
        keyProperty,
        LayoutComponent = Fragment,
        propertyGridStoreId,
        validation,
        onItemClick: propsOnItemClick,
        onBeforeCreate,
        customItemActionsVisibilityCallback,
        hasSearch = true,
        emptyView,
    } = props;
    const editorRef = React.useRef();
    const gridRef = React.useRef();
    const [popupConfig, setPopupConfig] = React.useState<IPopupConfig | null>(null);
    const popupRef = React.useRef<Opener | null>(null);
    const itemMeta = metaType.getItemMeta();
    const title = metaType.getTitle();
    const preparedColumns = React.useMemo(() => {
        return prepareColumns(itemMeta, displayProperties, columns);
    }, [itemMeta, displayProperties, columns]);
    const editingConfig = React.useMemo(() => {
        if (editMode === 'inline') {
            return {
                toolbarVisibility: true,
            };
        }
        return;
    }, [editMode]);
    const pgObjectSlice: FormSlice = useSlice(props.name[0]);
    const isDisabled = metaType.isDisabled();
    const properties = React.useMemo(() => {
        return itemMeta?.getProperties() || {};
    }, [itemMeta]);
    const defaultValue = itemMeta.getDefaultValue();

    const pgEditorSlice = useSlice(propertyGridStoreId);
    const pgEditorState = pgEditorSlice?.state as Partial<IObjectTypeFactoryArguments>;
    const itemValidation = React.useMemo(() => {
        if (validation && popupConfig !== null && popupConfig.mode === 'edit') {
            const item = validation.nested?.at(popupConfig.itemIndex);
            if (item) {
                return item.get?.('nested');
            }
        }
        return undefined;
    }, [popupConfig, validation]);

    React.useEffect(() => {
        if (popupConfig && popupConfig.mode === 'add') {
            const item = items.at(popupConfig.itemIndex);
            if (item) {
                setPopupConfig({
                    mode: 'edit',
                    itemIndex: popupConfig.itemIndex,
                });
            }
        }
    }, [items, popupConfig]);

    const itemEditHandler = React.useCallback(
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
            setPopupConfig({
                mode: 'edit',
                itemIndex: items.getIndex(item),
            });
            if (editingConfig) {
                gridRef.current.beginEdit({ item });
            }
            if (popupRef.current) {
                (propsOnItemClick ?? openStack)({
                    stack: popupRef.current,
                    onClose: () => {
                        setPopupConfig(null);
                    },
                });
            }
        },
        [propsOnItemClick, items]
    );
    const itemAddHandler = React.useCallback(
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
    const prepareNewItem = React.useCallback(async (): Promise<Record | undefined> => {
        let newItem: Record | undefined;
        const store = pgObjectSlice?.state.store.getStore();
        const pgObject = store?.get('record');
        if (onBeforeCreate) {
            if (typeof onBeforeCreate === 'string') {
                const requiredFunction = await import(onBeforeCreate);
                newItem = await requiredFunction(itemMeta, pgObject);
            } else {
                newItem = await onBeforeCreate(itemMeta, pgObject);
            }
        }
        return newItem;
    }, [onBeforeCreate, pgObjectSlice]);
    const onAddButtonClick = React.useCallback(async () => {
        try {
            let newItem = await prepareNewItem();
            if (editingConfig) {
                if (!newItem) {
                    newItem = new Model({
                        keyProperty: items.getKeyProperty(),
                        adapter: items.getAdapter(),
                        format: items.getFormat(),
                    });
                    Object.getOwnPropertyNames(defaultValue).forEach((name) => {
                        if (newItem.get(name) === null) {
                            newItem.set(name, defaultValue[name]);
                        }
                    });
                    newItem.set(items.getKeyProperty(), Date.now());
                }
                gridRef.current.beginAdd({
                    item: newItem,
                });
            }
            if (popupRef.current) {
                if (!newItem) {
                    newItem = new Record({
                        adapter: items.getAdapter(),
                        format: items.getFormat(),
                    });
                }
                setPopupConfig({
                    mode: 'add',
                    item: newItem,
                    itemIndex: items.getCount(),
                });
                (propsOnItemClick ?? openStack)({
                    stack: popupRef.current,
                    onClose: () => {
                        setPopupConfig(null);
                    },
                });
            }
        } catch (error: unknown) {
            await dataSourceError.process({ error: error as Error });
        }
    }, [propsOnItemClick, prepareNewItem, items]);

    const onActionClick = React.useCallback(
        (action: IItemAction, item: Model) => {
            const nextItems = items.clone();
            const itemIndex = items.getIndex(item);
            if (action.id === DELETE_ACTION) {
                nextItems.removeAt(itemIndex);
            } else if (action.id === MOVE_UP_ACTION) {
                nextItems.move(itemIndex, itemIndex - 1);
            } else if (action.id === MOVE_DOWN_ACTION) {
                nextItems.move(itemIndex, itemIndex + 1);
            } else if (action.id === SET_UP_ACTION) {
                onItemClick(item);
            }
            onChange(nextItems);
        },
        [items, onChange]
    );
    const itemActionVisibilityCallback = React.useCallback(
        (itemAction: IItemAction, item: Model, isEditing: boolean): boolean => {
            if (customItemActionsVisibilityCallback) {
                return customItemActionsVisibilityCallback(itemAction, item, isEditing);
            }
            if (isEditing) {
                return false;
            }
            const itemIndex = items.getIndex(item);
            if (itemAction.id === MOVE_DOWN_ACTION && itemIndex === items.getCount() - 1) {
                return false;
            } else if (itemAction.id === MOVE_UP_ACTION && itemIndex === 0) {
                return false;
            }
            return true;
        },
        [items, customItemActionsVisibilityCallback]
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

    const colspanCallback = React.useCallback((item, column, columnIndex, isEditing) => {
        return isEditing ? 'end' : undefined;
    }, []);

    const afterEndEdit = React.useCallback(() => {
        onChange(items);
    }, [items]);

    const getOnItemChangeHandler = React.useCallback(() => {
        if (popupConfig !== null) {
            if (popupConfig.mode === 'edit') {
                const item = items.at(popupConfig.itemIndex);
                return (newValue: Record) => {
                    itemEditHandler(item, newValue);
                };
            } else if (popupConfig.mode === 'add') {
                return (newValue: Record) => {
                    itemAddHandler(newValue);
                };
            }
        }
        return;
    }, [popupConfig, items, itemEditHandler, itemAddHandler]);

    const itemValue = React.useMemo(() => {
        if (popupConfig !== null) {
            const item = items.at(popupConfig.itemIndex);
            if (popupConfig.mode === 'edit') {
                return item;
            } else if (popupConfig.mode === 'add') {
                if (item) {
                    return item;
                }
                return popupConfig.item;
            }
        }
        return;
    }, [popupConfig, items, prepareNewItem]);

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
                                {hasSearch && isExpanded && !isEmptyRecordset && (
                                    <Input storeId={'recordsetEditorView'} />
                                )}
                            </div>
                            {isExpanded ? (
                                <ContextProvider beginAdd={onAddButtonClick}>
                                    <MetaTypeContextProvider metaType={itemMeta}>
                                        <Container>
                                            <GridView
                                                storeId={'recordsetEditorView'}
                                                ref={gridRef}
                                                columns={preparedColumns}
                                                itemPadding={{
                                                    left: 'null',
                                                }}
                                                colspanCallback={
                                                    editingConfig ? colspanCallback : undefined
                                                }
                                                onAfterEndEdit={
                                                    editingConfig ? afterEndEdit : undefined
                                                }
                                                editingConfig={editingConfig}
                                                header={header}
                                                keyProperty={keyProperty}
                                                onItemClick={onItemClick}
                                                keepScrollAfterReload={true}
                                                itemActions={!isDisabled ? ITEM_ACTIONS : []}
                                                onActionClick={onActionClick}
                                                itemActionVisibilityCallback={
                                                    itemActionVisibilityCallback
                                                }
                                                itemsDragNDrop={true}
                                                onCustomdragEnd={onDragEnd}
                                                customEvents={['onCustomdragEnd']}
                                                emptyView={emptyView}
                                            />
                                        </Container>
                                        {editMode === 'popup' ? (
                                            <PropertyGridContextProvider
                                                validation={itemValidation}
                                                value={itemValue}
                                                onChange={getOnItemChangeHandler()}
                                                pgFactoryArguments={pgEditorState}
                                            >
                                                <Opener
                                                    contentComponent={StackTemplate}
                                                    popupType={'largeCard'}
                                                    ref={popupRef}
                                                    width={'e'}
                                                    minWidth={MIN_STACK_WIDTH}
                                                    maxWidth={MAX_STACK_WIDTH}
                                                    closeOnOutsideClick={true}
                                                    autofocus={false}
                                                    opener={editorRef.current}
                                                    propStorageId={'recordset_editor_stack_id'}
                                                />
                                            </PropertyGridContextProvider>
                                        ) : null}
                                    </MetaTypeContextProvider>
                                </ContextProvider>
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
