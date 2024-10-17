import {
    MutableRefObject,
    ReactElement,
    memo,
    useRef,
    useState,
    useCallback,
    useMemo,
    useContext,
    useEffect,
} from 'react';
import { IMarkSelectorOptions, TMarkElement } from './interfaces/IMarkSelectorOptions';
import { ItemsView, ItemTemplate, EditingTemplate, MultiSelectTemplate } from 'Controls/list';
import { IItemAction } from 'Controls/itemActions';
import { showType } from 'Controls/toolbars';
import { Confirmation, StickyOpener } from 'Controls/popup';
import { Sticky as StickyTemplate } from 'Controls/popupTemplate';
import { Panel } from 'ExtControls/colorPicker';
import { Icon } from 'Controls/icon';
import { Text as TextInput } from 'Controls/input';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IAction } from 'Controls/interface';
import rk = require('i18n!Controls-Colors');
import { getColor, getStyleClasses, isElementContainsFieldOnArr } from '../utils/function';
import { EditingContext } from './contexts/contexts';
import 'css!Controls-Colors/colormark';
import { isEqual } from 'Types/object';
import { InputContainer, isRequired, Controller } from 'Controls/validate';

interface IListOptions extends IMarkSelectorOptions {
    onBeforeBeginEdit?: (args) => void;
    onAfterEndEdit?: (args) => void;
    forwardedRef: MutableRefObject<ItemsView>;
    /**
     * Включает операцию над записью для исключения пометки.
     */
    excludable?: boolean;
    /**
     * Шаблон, который по умолчанию используется для отображения подвала
     */
    footerTemplate?: ReactElement;
}

const KEY_PROPERTY = 'id';
const BASE_COLUMNS_COUNT = 5;
let sticky;

export default memo((props: IListOptions): ReactElement => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [markedKey, setMarkedKey] = useState<string>(
        typeof props.selectedKeys[0] === 'undefined' ? null : props.selectedKeys[0]
    );

    useEffect(() => {
        setMarkedKey(typeof props.selectedKeys[0] === 'undefined' ? null : props.selectedKeys[0]);
    }, [props.selectedKeys]);

    const isMultiSelectMode = useMemo(
        () => props.multiSelect || isElementContainsFieldOnArr('icon', props.items),
        [props.items, props.multiSelect]
    );
    const itemsViewRef: MutableRefObject<ItemsView> = useRef();

    const editingConfig = useMemo(() => {
        return { toolbarVisibility: true, backgroundStyle: 'colormark_list' };
    }, [props.items]);

    const itemPadding = useMemo(() => {
        return {
            top: 'null',
            bottom: 'null',
            left: isMultiSelectMode ? 'null' : 'default',
        };
    }, [isMultiSelectMode]);

    const itemActions = useMemo(() => {
        if (props.excludable) {
            return [
                {
                    id: 'exclude',
                    icon: 'icon-Annul',
                    showType: showType.TOOLBAR,
                    iconSize: 'm',
                    iconStyle: 'unaccented',
                    tooltip: rk('Исключить'),
                },
                {
                    id: 'include',
                    icon: 'icon-Annul',
                    showType: showType.TOOLBAR,
                    iconSize: 'm',
                    iconStyle: 'danger',
                    tooltip: rk('Исключить'),
                },
            ];
        } else {
            return [
                {
                    id: 'edit',
                    icon: 'icon-Edit',
                    showType: showType.TOOLBAR,
                    iconSize: 's',
                    iconStyle: 'secondary',
                    tooltip: rk('Редактировать'),
                },
                {
                    id: 'remove',
                    icon: 'icon-Erase',
                    showType: showType.TOOLBAR,
                    iconSize: 's',
                    iconStyle: 'danger',
                    tooltip: rk('Удалить'),
                },
            ];
        }
    }, [props.items, props.excludable, props.excludedKeys]);

    const itemsView = useMemo(() => {
        return new RecordSet({
            keyProperty: KEY_PROPERTY,
            rawData: props.items.map((item) => {
                let checkboxState: boolean | null;

                if (props.selectedKeys.some((key) => key === item.id)) {
                    if (item.disabled) {
                        checkboxState = false;
                    } else {
                        checkboxState = true;
                    }
                } else if (item.disabled) {
                    checkboxState = null;
                } else {
                    checkboxState = true;
                }

                return {
                    ...item,
                    сheckboxReadOnly: checkboxState,
                    highlightOnHover: !item.disabled,
                    showItemActionsOnHover: !item.disabled,
                };
            }),
        });
    }, [props.items]);

    const actionClickHandler = useCallback(
        (action: IAction, item: Model) => {
            const params = {
                item,
            };
            if (action.id === 'edit') {
                let shouldBeCalled = true;
                if (props.onBeforeEdit) {
                    const result = props.onBeforeEdit(params);
                    shouldBeCalled = result !== undefined ? result : true;
                }
                if (shouldBeCalled) {
                    itemsViewRef.current.beginEdit(params);
                }
            }
            if (action.id === 'remove') {
                Confirmation.openPopup({
                    type: 'yesno',
                    message: rk('Удалить пометку') + ' "' + item.get('caption') + '"?',
                    details: rk('Эта пометка будет снята со всех отмеченных записей'),
                }).then((res) => {
                    if (res) {
                        let shouldBeCalled = true;
                        if (props.onBeforeDelete) {
                            const result = props.onBeforeDelete(params);
                            shouldBeCalled = result !== undefined ? result : true;
                        }
                        if (shouldBeCalled instanceof Promise) {
                            shouldBeCalled.then((res: unknown) => {
                                if (res !== false) {
                                    itemsView.remove(item);
                                }
                            });
                        } else if (shouldBeCalled) {
                            itemsView.remove(item);
                        }
                    }
                });
            }
            if (action.id === 'exclude') {
                const indexSelectedKey = props.selectedKeys.indexOf(item.getKey());
                if (indexSelectedKey !== -1) {
                    const newSelectedKeys = [...props.selectedKeys];
                    newSelectedKeys.splice(indexSelectedKey, 1);
                    selectedKeysChangedHandler(newSelectedKeys, [], [item.getKey()]);
                }
                const newExcludedKeys = [...props.excludedKeys, item.getKey()];
                props.onExcludedKeysChanged?.(newExcludedKeys);
            }
            if (action.id === 'include') {
                excludedKeysChangedHandler(props.excludedKeys, [], [item.getKey()]);
            }
        },
        [
            props.onBeforeEdit,
            props.onBeforeDelete,
            props.selectedKeys,
            props.excludedKeys,
            itemsView,
        ]
    );

    const itemActionVisibilityCallback = useCallback(
        (itemAction: IItemAction, item: Model, isEditing: boolean) => {
            if (itemAction.id === 'edit') {
                if (item.get('disabled') || item.get('editable') === false) {
                    return false;
                }
            }
            if (itemAction.id === 'remove') {
                if (item.get('disabled') || item.get('removable') === false) {
                    return false;
                }
            }
            if (itemAction.id === 'exclude') {
                return !props.excludedKeys?.includes(item.getKey());
            }
            if (itemAction.id === 'include') {
                return props.excludedKeys?.includes(item.getKey());
            }
            if (item.get('icon')) {
                return false;
            }
            return !isEditing;
        },
        [props.items, props.excludedKeys]
    );

    const selectedKeysChangedHandler = useCallback(
        (
            currentSelectedKeys: string | string[],
            addedKeys: string[],
            deletedKeys: string[],
            isItemClick: boolean = false
        ) => {
            let keys = Array.isArray(currentSelectedKeys)
                ? currentSelectedKeys
                : [currentSelectedKeys];
            if (props.onBeforeSelectionChanged) {
                keys = props.onBeforeSelectionChanged(keys);
            } else {
                const isNewItemForType =
                    !!addedKeys.length && !!itemsView.getRecordById(addedKeys[0]).get('type');
                if (isNewItemForType) {
                    const oldSelectedKeys = (currentSelectedKeys as string[]).filter(
                        (key) => key !== addedKeys[0]
                    );
                    const selectedKeyForType = oldSelectedKeys.find(
                        (key) => !!itemsView.getRecordById(key).get('type')
                    );
                    if (selectedKeyForType !== undefined) {
                        keys.splice(currentSelectedKeys.indexOf(selectedKeyForType), 1);
                    }
                }
            }
            props.onSelectedKeysChanged(keys, isItemClick);
        },
        [props.onBeforeSelectionChanged, props.onSelectedKeysChanged, itemsView]
    );

    const excludedKeysChangedHandler = useCallback(
        (currentExcludedKeys: string[], addedKeys: string[], deletedKeys: string[]) => {
            const newExcludedKeys = [...currentExcludedKeys];
            deletedKeys?.forEach((deletedKey) => {
                const indexDeletedKey = currentExcludedKeys.indexOf(deletedKey);
                if (indexDeletedKey !== -1) {
                    newExcludedKeys.splice(indexDeletedKey, 1);
                }
            });
            if (!isEqual(newExcludedKeys, currentExcludedKeys)) {
                props.onExcludedKeysChanged?.(newExcludedKeys);
            }
        },
        [props.onExcludedKeysChanged, itemsView]
    );

    const selectedKeysChanged = useCallback(
        (
            currentSelectedKeys: string | string[],
            addedKeys: string[],
            deletedKeys: string[],
            isItemClick: boolean = false
        ) => {
            selectedKeysChangedHandler(currentSelectedKeys, addedKeys, deletedKeys, isItemClick);
            if (props.excludedKeys) {
                excludedKeysChangedHandler(props.excludedKeys, deletedKeys, addedKeys);
            }
        },
        [selectedKeysChangedHandler, excludedKeysChangedHandler, props.excludedKeys]
    );

    const itemClickHandler = useCallback(
        (item: Model) => {
            if (item.get('disabled')) {
                return;
            }
            const selectKey = item.getKey();
            if (isMultiSelectMode) {
                const itemSelected = props.selectedKeys.includes(selectKey);
                if (itemSelected) {
                    selectedKeysChangedHandler([...props.selectedKeys], [], [], true);
                } else {
                    if (props.excludedKeys) {
                        excludedKeysChangedHandler(props.excludedKeys, [], [selectKey]);
                    }
                    selectedKeysChangedHandler(
                        [...props.selectedKeys, selectKey],
                        [selectKey],
                        [],
                        true
                    );
                }
            } else {
                let keys = [];
                if (selectKey !== markedKey) {
                    setMarkedKey(selectKey);
                    keys = [selectKey];
                }
                props.onSelectedKeysChanged(keys, true);
            }
        },
        [props.onSelectedKeysChanged, props.selectedKeys]
    );

    const afterEndEditHandler = useCallback(
        (params) => {
            setIsEditing(false);
            if (props.onAfterEndEdit) {
                props.onAfterEndEdit(params);
            }
        },
        [props.onAfterEndEdit]
    );

    const beforeBeginEditHandler = useCallback(
        (params) => {
            setIsEditing(true);
            if (props.onBeforeBeginEdit) {
                props.onBeforeBeginEdit(params);
            }
        },
        [props.onBeforeBeginEdit]
    );

    const changeItemsView = (res: TMarkElement | string, isAdd: boolean, commit: boolean): void => {
        if (res && typeof res !== 'string') {
            if (isAdd) {
                itemsView.add(res);
            } else if (commit) {
                const replacedIndex =
                    itemsView.getIndexByValue('id', res.get?.('id')) ||
                    itemsView.getIndexByValue('caption', res.get?.('caption'));
                itemsView.replace(res, replacedIndex);
            }
        }
    };

    const onBeforeEndEditHandler = useCallback(
        (editableItem: Model, commit: boolean, isAdd: true) => {
            if (props.onBeforeBeginEdit) {
                const result = props.onBeforeEndEdit(editableItem, commit, isAdd);
                if (result instanceof Promise) {
                    result.then((res) => {
                        changeItemsView(res, isAdd, commit);
                    });
                } else {
                    changeItemsView(result, isAdd, commit);
                }
                return result;
            }
        },
        [props.onBeforeEndEdit]
    );

    const setRef = useCallback((node) => {
        if (!node) {
            return;
        }
        itemsViewRef.current = node;
        props.forwardedRef.current = node;
    }, []);

    return (
        <EditingContext.Provider value={isEditing}>
            <div
                className={
                    'Colormark__List_container' +
                    (isEditing ? '_blackout' : '') +
                    (itemsView.at(itemsView.getCount() - 1)?.getRawData?.()?.type === 'style' ||
                    props.addedItemType === 'style'
                        ? ' Colormark__List_container_offset_extended'
                        : '') +
                    ' Colormark__List_container_offset' +
                    (props.isAdaptive ? '_adaptive' : '_default') +
                    (props.className || '')
                }
            >
                <ItemsView
                    ref={setRef}
                    data-qa="Controls-Colors_colormark_List"
                    editingConfig={editingConfig}
                    itemPadding={itemPadding}
                    items={itemsView}
                    itemActions={itemActions}
                    customEvents={[
                        'onActionClick',
                        'onAfterEndEdit',
                        'onBeforeBeginEdit',
                        'onBeforeEndEdit',
                    ]}
                    keyProperty={KEY_PROPERTY}
                    displayProperty="caption"
                    markedKey={markedKey}
                    selectedKeys={props.selectedKeys}
                    excludedKeys={props.excludedKeys}
                    onActionClick={actionClickHandler}
                    onAfterEndEdit={afterEndEditHandler}
                    onBeforeEndEdit={onBeforeEndEditHandler}
                    onBeforeBeginEdit={beforeBeginEditHandler}
                    onSelectedKeysChanged={selectedKeysChanged}
                    onItemClick={itemClickHandler}
                    itemActionVisibilityCallback={itemActionVisibilityCallback}
                    itemActionsVisibility={
                        props.isAdaptive && props.excludable ? 'visible' : 'onhover'
                    }
                    itemActionsPosition="custom"
                    multiSelectVisibility={
                        isMultiSelectMode ? (props.isAdaptive ? 'visible' : 'onhover') : 'hidden'
                    }
                    markerVisibility={isMultiSelectMode ? 'hidden' : 'onactivated'}
                    multiSelectAccessibilityProperty="сheckboxReadOnly"
                    multiSelectPosition={isMultiSelectMode ? 'custom' : 'default'}
                    itemActionsClass={
                        'Colormark__List_itemActionsPosition Colormark__List_itemActionsPosition' +
                        (props.isAdaptive ? '_adaptive' : '_default')
                    }
                    emptyTemplate={props.emptyTemplate}
                    itemTemplate={useCallback(
                        (itemTemplateProps) => {
                            return (
                                <ItemTemplateList
                                    itemTemplateProps={itemTemplateProps}
                                    palette={props.palette}
                                    editableStyle={itemTemplateProps.item.item.get('editableStyle')}
                                    excludedKeys={props.excludedKeys}
                                    excludable={props.excludable}
                                    highlightOnHover={itemTemplateProps.item.item.get(
                                        'highlightOnHover'
                                    )}
                                />
                            );
                        },
                        [props.palette, props.excludedKeys]
                    )}
                />
                {props.footerTemplate && (
                    <div className="Colormark__List__footer">
                        <props.footerTemplate />
                    </div>
                )}
            </div>
        </EditingContext.Provider>
    );
});

export function PaletteTemplate(props) {
    return (
        <StickyTemplate
            closeButtonVisible={false}
            shadowVisible={true}
            bodyContentTemplate={useCallback(() => {
                return (
                    <Panel
                        keyProperty="color"
                        columnsCount={BASE_COLUMNS_COUNT}
                        items={props.palette}
                        selectedKey={props.item.get('value').color}
                        onSelectedKeyChanged={props.onSelectedKeyChanged}
                        customEvents={['onSelectedKeyChanged']}
                        className="Colormark__List__insideOffset"
                    />
                );
            }, [])}
        />
    );
}
PaletteTemplate.isReact = true;

function Bubble(props) {
    const bubbleNode: MutableRefObject<HTMLDivElement> = useRef();
    const colorButtonValueChangeHandler = useCallback((value) => {
        props.item.set('value', {
            ...props.item.get('value'),
            color: value,
        });
        sticky.close();
    }, []);
    const clickHandler = useCallback(() => {
        if (props.readOnly) {
            return;
        }
        if (!sticky) {
            sticky = new StickyOpener({});
        }
        sticky.open({
            template: 'Controls-Colors/_colormark/List:PaletteTemplate',
            target: bubbleNode.current,
            opener: bubbleNode.current,
            targetPoint: {
                horizontal: 'left',
                vertical: 'top',
            },
            fittingMode: {
                vertical: 'overflow',
            },
            className: 'Colormark__List__panelOffset',
            closeOnOutsideClick: true,
            templateOptions: {
                palette: props.palette,
                item: props.item,
                onSelectedKeyChanged: colorButtonValueChangeHandler,
            },
        });
    }, [props.item, props.palette]);
    const getStyle = useCallback(() => {
        return {
            backgroundColor: getColor(props.item),
        };
    }, [props.item]);

    const leftOffset = useMemo(() => {
        if (props.isAdaptive) {
            return props.leftPadding === 'xs' ? 'st' : 'none';
        }
        return props.leftPadding;
    }, [props.isAdaptive, props.leftPadding]);
    return (
        <div
            className={
                'controls-margin_left-' +
                leftOffset +
                ' controls-margin_right-' +
                (props.isAdaptive ? 'l' : 'm') +
                ' tw-flex-shrink-0 Colormark__List_Bubble' +
                ' Colormark__List_Bubble' +
                (props.readOnly ? '_disabled' : '_enabled') +
                (props.item.iconClassName ? ` ${props.item.iconClassName}` : '')
            }
            style={getStyle()}
            onClick={clickHandler}
            ref={bubbleNode}
            data-qa={props.dataQA}
        ></div>
    );
}

function EditorTemplate({
    editingTemplateProps,
    itemsPaletteView,
    itemActionsTemplate,
    multiSelectTemplate,
    editableStyle,
}) {
    const item: Model = editingTemplateProps.item.contents;
    const itemStyleMode = item.get('type') === 'style' ? 'style' : 'color';
    const CustomItemActionsTemplate = itemActionsTemplate;
    const MultiSelectTemplate = multiSelectTemplate;
    const validationRef = useRef();
    const inputValueChangeHandler = useCallback((_, value) => {
        item.set('caption', value);
        validationRef.current?.submit?.();
    }, []);
    const inputValidators = [() => isRequired({ value: item.get('caption') })];
    return (
        <EditingTemplate
            {...editingTemplateProps}
            value={item.get('caption')}
            align={'null'}
            editorTemplate={useCallback(() => {
                const getInputClassName = () => {
                    let result =
                        item.get('type') === 'color'
                            ? 'Colormark__List_inputOffset '
                            : 'tw-flex-grow ';
                    if (item.get('type') === 'style') {
                        result += getStyleClasses(item.get('value').style);
                    }
                    return result;
                };
                const getStyles = () => {
                    let styles = {};
                    if (item.get('type') === 'style') {
                        const currentColor = getColor(item);
                        styles = {
                            color: currentColor,
                        };
                    }
                    return styles;
                };
                const multiSelectVisibility = editingTemplateProps.item.getMultiSelectVisibility();
                return (
                    <div
                        className={
                            'Colormark__List_editorTemplate' +
                            (editingTemplateProps.isAdaptive ? '_adaptive' : '') +
                            ' Colormark__List_editorTemplate_' +
                            itemStyleMode
                        }
                    >
                        <div
                            className={
                                `Colormark__List_editorTemplate_wrapper${
                                    editingTemplateProps.isAdaptive
                                        ? ' Colormark__List_editorTemplate_wrapper_adaptive'
                                        : ''
                                } tw-flex tw-items-center` +
                                (itemStyleMode === 'style' ? ' tw-relative tw-z-10' : '')
                            }
                        >
                            {(multiSelectVisibility === 'onhover' ||
                                multiSelectVisibility === 'visible') && (
                                <span
                                    className={
                                        'Colormark__List_item_customCheckbox' +
                                        (editingTemplateProps.isAdaptive ? '_adaptive' : '') +
                                        (editingTemplateProps.item.isEditing()
                                            ? ' Colormark__List_item_customCheckbox_editing'
                                            : '')
                                    }
                                >
                                    <MultiSelectTemplate />
                                </span>
                            )}
                            <Bubble
                                item={item}
                                palette={itemsPaletteView}
                                isAdaptive={editingTemplateProps.isAdaptive}
                                leftPadding={
                                    multiSelectVisibility === 'onhover' ||
                                    multiSelectVisibility === 'visible'
                                        ? 'xs'
                                        : 'none'
                                }
                                dataQA="Controls-Colors_colormark_List__editorColor"
                                readOnly={editableStyle === false}
                            />
                            <Controller ref={validationRef}>
                                <InputContainer validators={inputValidators}>
                                    <TextInput
                                        value={item.get('caption')}
                                        className={getInputClassName()}
                                        data-qa="Controls-Colors_colormark_List__editorCaption"
                                        onValueChanged={inputValueChangeHandler}
                                        fontWeight="none"
                                        fontSize="l"
                                        inlineHeight={editingTemplateProps.isAdaptive ? 'xl' : 'm'}
                                        attrs={{ style: getStyles() }}
                                    />
                                </InputContainer>
                            </Controller>
                            {itemStyleMode === 'color' && CustomItemActionsTemplate && (
                                <CustomItemActionsTemplate actionPadding={'colormark'} />
                            )}
                        </div>
                        {itemStyleMode === 'style' && (
                            <div
                                className={
                                    'Colormark__List_editorTemplate_styleSettings ' +
                                    ' Colormark__List_editorTemplate_styleSettings_position' +
                                    (editingTemplateProps.isAdaptive ? '_adaptive' : '_default') +
                                    ' Colormark__List_editorTemplate_styleSettings-offset_' +
                                    (multiSelectVisibility === 'onhover' ||
                                    multiSelectVisibility === 'visible'
                                        ? 'style'
                                        : 'color') +
                                    (editingTemplateProps.isAdaptive ? '_adaptive' : '_default')
                                }
                            >
                                <StyleSettings
                                    isAdaptive={editingTemplateProps.isAdaptive}
                                    settings={item.get('value').style}
                                    onSettingsChanged={(newSettings) => {
                                        item.set('value', {
                                            ...item.get('value'),
                                            style: newSettings,
                                        });
                                    }}
                                />
                                {CustomItemActionsTemplate && (
                                    <CustomItemActionsTemplate actionPadding={'colormark'} />
                                )}
                            </div>
                        )}
                    </div>
                );
            }, [])}
        />
    );
}

function ViewTemplate({
    editingTemplateProps,
    itemActionsTemplate,
    multiSelectTemplate,
    excludedKeys,
    excludable,
}) {
    const isEditing = useContext(EditingContext);
    const item: Model = editingTemplateProps.item.contents;
    const disabled = item.get('disabled');
    let styles = {};
    if (item.get('type') === 'style') {
        const currentColor = getColor(item);
        styles = {
            color:
                (isEditing && !editingTemplateProps.item.isEditing()) || disabled
                    ? 'var(--readonly_text-color)'
                    : currentColor,
        };
    }
    const CustomItemActionsTemplate = itemActionsTemplate;
    const MultiSelectTemplate = multiSelectTemplate;
    const isCustomElement = item.get('icon');
    const isAdaptive = editingTemplateProps.isAdaptive;
    const isExcluded = excludedKeys?.includes(item.getKey());
    const getIconClasses = () => {
        const iconClassName = item.get('iconClassName');
        return (
            ' controls-icon_size-' +
            (isAdaptive ? 'l' : item.get('iconSize') || 'm') +
            ' controls-icon_style-' +
            (item.get('iconStyle') || 'secondary') +
            ' icon-' +
            item.get('icon') +
            (iconClassName ? ` ${iconClassName}` : '')
        );
    };
    const multiSelectVisibility = editingTemplateProps.item.getMultiSelectVisibility();
    return (
        <div
            className={
                'Colormark__List_item tw-flex tw-items-center' +
                ' controls-inlineheight-' +
                (isAdaptive ? 'xl' : 'm') +
                ' controls-padding_top-' +
                (isAdaptive ? 'xs' : '2xs') +
                ' controls-padding_bottom-' +
                (isAdaptive ? 'xs' : '2xs') +
                ' controls-padding_left-' +
                (isAdaptive ? 'm' : 'null')
            }
        >
            {(multiSelectVisibility === 'onhover' || multiSelectVisibility === 'visible') && (
                <span
                    className={
                        'Colormark__List_item_customCheckbox' + (isAdaptive ? '_adaptive' : '')
                    }
                >
                    <MultiSelectTemplate readOnly={disabled} />
                </span>
            )}
            {isCustomElement ? (
                <>
                    <div
                        className={'controls-icon controls-margin_right-xs ' + getIconClasses()}
                    ></div>
                    <span
                        className={
                            'ws-ellipsis controls-fontsize-l controls-text-' +
                            (disabled ||
                            isExcluded ||
                            (isEditing && !editingTemplateProps.item.isEditing())
                                ? 'readonly'
                                : 'default')
                        }
                        title={item.get('tooltip') || item.get('caption')}
                    >
                        {item.get('caption')}
                    </span>
                    {excludable && CustomItemActionsTemplate && <CustomItemActionsTemplate />}
                </>
            ) : (
                <>
                    <Bubble
                        item={item}
                        readOnly={true}
                        isAdaptive={isAdaptive}
                        leftPadding={
                            multiSelectVisibility === 'onhover' ||
                            multiSelectVisibility === 'visible'
                                ? 'xs'
                                : 'none'
                        }
                        dataQA="Controls-Colors_colormark_List__itemColor"
                    />
                    <span
                        className={
                            'ws-ellipsis controls-fontsize-l ' +
                            (disabled ||
                            isExcluded ||
                            (isEditing && !editingTemplateProps.item.isEditing())
                                ? 'controls-text-readonly '
                                : ' ') +
                            (item.get('type') === 'style'
                                ? getStyleClasses(item.get('value').style)
                                : '')
                        }
                        data-qa="Controls-Colors_colormark_List__itemCaption"
                        style={{
                            ...styles,
                            color:
                                disabled ||
                                isExcluded ||
                                (isEditing && !editingTemplateProps.item.isEditing())
                                    ? 'var(--readonly_text-color)'
                                    : styles.color,
                        }}
                        title={item.get('tooltip') || item.get('caption')}
                    >
                        {item.get('caption')}
                    </span>
                    {CustomItemActionsTemplate && <CustomItemActionsTemplate />}
                </>
            )}
            {isExcluded ? (
                <Icon
                    icon="icon-Annul"
                    iconSize="m"
                    iconStyle="danger"
                    className="Colormark__List_excludeIcon_position Colormark__List_itemActionsPosition controls-padding_left-xs controls-padding_right-xs"
                    data-qa="Controls-Colors_colormark_List__itemIcon"
                />
            ) : null}
        </div>
    );
}

function EditingTemplateList({
    contentTemplateProps,
    palette,
    excludedKeys,
    excludable,
    editableStyle,
}) {
    const itemsPaletteView = useMemo(() => {
        return new RecordSet({
            keyProperty: 'color',
            rawData: palette,
        });
    }, [palette]);
    return (
        <EditingTemplate
            {...contentTemplateProps}
            viewTemplate={useCallback(
                (editingTemplateProps) => {
                    return (
                        <ViewTemplate
                            {...contentTemplateProps}
                            editingTemplateProps={editingTemplateProps}
                            excludedKeys={excludedKeys}
                            excludable={excludable}
                        />
                    );
                },
                [
                    contentTemplateProps.itemActionsTemplate,
                    contentTemplateProps.multiSelectTemplate,
                    excludedKeys,
                ]
            )}
            editorTemplate={useCallback(
                (editingTemplateProps) => {
                    return (
                        <EditorTemplate
                            {...contentTemplateProps}
                            editingTemplateProps={editingTemplateProps}
                            itemsPaletteView={itemsPaletteView}
                            editableStyle={editableStyle}
                        />
                    );
                },
                [contentTemplateProps.itemActionsTemplate, contentTemplateProps.multiSelectTemplate]
            )}
        />
    );
}

function ItemTemplateList({
    itemTemplateProps,
    palette,
    excludedKeys,
    excludable,
    editableStyle,
    highlightOnHover,
}) {
    const item = itemTemplateProps.item;
    const isEditing = useContext(EditingContext);
    const isExcluded = excludedKeys?.includes(item.contents.getKey());
    return (
        <ItemTemplate
            {...itemTemplateProps}
            className={isEditing && !item.isEditing() ? 'Colormark__List_item_disabled' : ''}
            fontColorStyle={isExcluded ? 'readonly' : 'default'}
            highlightOnHover={highlightOnHover}
            markerClassName={
                'Colormark__List_markerPosition' +
                (itemTemplateProps.isAdaptive ? '_adaptive' : '_default')
            }
            contentTemplate={useCallback(
                (contentTemplateProps) => {
                    return (
                        <EditingTemplateList
                            contentTemplateProps={contentTemplateProps}
                            palette={palette}
                            excludedKeys={excludedKeys}
                            excludable={excludable}
                            editableStyle={editableStyle}
                        />
                    );
                },
                [isEditing, excludedKeys]
            )}
        />
    );
}

function StyleSettings({ settings, onSettingsChanged, isAdaptive }) {
    const { b = false, u = false, i = false, s = false } = settings;
    const styleButtonClickHandler = useCallback(
        (actionName) => {
            const newSettings = { b, u, i, s };
            newSettings[actionName] = !settings[actionName];
            onSettingsChanged(newSettings);
        },
        [settings, onSettingsChanged]
    );

    return (
        <div className="Colormark__List_styleSettings_container">
            <div className="tw-flex">
                <div
                    className={
                        'controls-icon controls-icon_size-' +
                        (isAdaptive ? 'l' : 'default') +
                        ' icon-Bold' +
                        ' controls-margin_right-s controls-icon_style-' +
                        (b ? 'secondary' : 'unaccented')
                    }
                    onClick={() => styleButtonClickHandler('b')}
                    title={rk('Жирность')}
                    data-qa="Controls-Colors_colormark_List__styleSettingsBold"
                ></div>
                <div
                    className={
                        'controls-icon controls-icon_size-' +
                        (isAdaptive ? 'l' : 'default') +
                        ' icon-Underline' +
                        ' controls-margin_right-s controls-icon_style-' +
                        (u ? 'secondary' : 'unaccented')
                    }
                    onClick={() => styleButtonClickHandler('u')}
                    title={rk('Подчеркнутый')}
                    data-qa="Controls-Colors_colormark_List__styleSettingsUnderline"
                ></div>
                <div
                    className={
                        'controls-icon controls-icon_size-' +
                        (isAdaptive ? 'l' : 'default') +
                        ' icon-Italic' +
                        ' controls-margin_right-s controls-icon_style-' +
                        (i ? 'secondary' : 'unaccented')
                    }
                    onClick={() => styleButtonClickHandler('i')}
                    title={rk('Курсив')}
                    data-qa="Controls-Colors_colormark_List__styleSettingsItalic"
                ></div>
                <div
                    className={
                        'controls-icon controls-icon_size-' +
                        (isAdaptive ? 'l' : 'default') +
                        ' icon-Stroked' +
                        ' controls-margin_right-s controls-icon_style-' +
                        (s ? 'secondary' : 'unaccented')
                    }
                    onClick={() => styleButtonClickHandler('s')}
                    title={rk('Зачеркнутый')}
                    data-qa="Controls-Colors_colormark_List__styleSettingsStroked"
                ></div>
            </div>
        </div>
    );
}
