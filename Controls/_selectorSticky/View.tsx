import {
    forwardRef,
    useMemo,
    useCallback,
    useState,
    useRef,
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useContext,
} from 'react';
import { View as ExplorerView } from 'Controls/explorer';
import {
    ControlFooterTemplate,
    IMenuControlOptions,
    itemActionPin,
    itemActionsUnpin,
    ItemTemplate,
    Util as menuUtil,
} from 'Controls/menu';
import { Container as ScrollContainer, SHADOW_MODE, SHADOW_VISIBILITY } from 'Controls/scroll';
import MultiSelectTemplate from './templates/MultiSelectPlusTemplate';
import ListItemTemplate from './templates/ListItemTemplate';
import ColumnTemplate from './templates/ColumnTemplate';
import SearchBreadCrumbsItemTemplate from './templates/SearchBreadCrumbsItemTemplate';
import isEmptyKeySelected from './Utils/IsEmptyKeySelected';
import { Context as PopupContext } from 'Controls/popupTemplate';
import { Model } from 'Types/entity';
import { ISelectorBaseOptions } from './interface/ISelectorBase';
import { TKey, IPadding, ISelectionObject } from 'Controls/interface';
import { IKeysDifference, ISelectionDifference } from 'Controls/multiselection';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { IColumn, TGetGroupPropsCallback } from 'Controls/grid';
import { controller } from 'I18n/i18n';
import { useSlice } from 'Controls-DataEnv/context';
import { IListState } from 'Controls/dataFactory';
import { default as SelectorSlice } from './Factory/Slice';
import { Button } from 'Controls/buttons';
import { View as TreeGridView } from 'Controls/treeGrid';
import GroupTemplate from 'Controls/_selectorSticky/templates/GroupTemplate';

const ROUND_BORDER = { tl: 'menu-m', tr: 'menu-m', bl: 'menu-m', br: 'menu-m' };
const EMPTY_VIEW = [{ render: <div>Не найдено</div> }];
const EMPTY_VIEW_PROPS = {
    padding: {
        top: 'm',
        bottom: 'l',
    },
};

interface ISelectorViewOptions extends ISelectorBaseOptions {
    headerContentVisible?: boolean;
    isAdaptive?: boolean;
    allowAdaptive?: boolean;
    onExpanderButtonClick: Function;
}

export default forwardRef(function SelectorStickyView(props: ISelectorViewOptions, _) {
    const explorerRef: MutableRefObject<ExplorerView | null> = useRef(null);
    const selectorContext = useSlice<SelectorSlice>('_selectorStoreId');
    const popupContext = useContext(PopupContext);
    const initSelectedKeys = useRef(selectorContext?.state.selectedKeys);
    const initExcludedKeys = useRef(selectorContext?.state.excludedKeys);
    const selectedItems = useRef(
        getSelectedItems(selectorContext?.state.items, selectorContext?.state.selectedKeys)
    );
    const [prevItems, setPrevItems] = useState(props.items);

    const emptyKeys = useMemo(() => {
        if (props.emptyKey === undefined && props.emptyText) {
            return [null];
        } else {
            return props.emptyKey instanceof Array ? props.emptyKey : [props.emptyKey];
        }
    }, [props.emptyKey, props.emptyText]);

    const selectionChanged = useRef(
        !!props.selectedKeys?.length && !isEmptyKeySelected(emptyKeys, props.selectedKeys)
    );
    const [applyButtonVisible, setApplyButtonVisible] = useState(() => false);

    const columns = useMemo(() => getColumns(props), []);

    useEffect(() => {
        if (explorerRef.current && props.openedSubMenuKey) {
            explorerRef.current.scrollToItem(props.openedSubMenuKey, 'top', true);
        }
    }, []);

    useEffect(() => {
        props.onControlResize();
    }, [selectorContext?.state.root]);

    useEffect(() => {
        if (props.items && prevItems && props.items !== prevItems) {
            selectorContext?.setItems(props.items);
            setPrevItems(props.items);
        }
    }, [props.items]);

    useEffect(() => {
        if (!selectorContext?.state.searchValue && selectorContext?.state.isRoot) {
            addSingleSelectionItem(
                props.emptyText,
                props.emptyKey,
                selectorContext?.state.items,
                selectorContext?.state
            );
        }
    }, [selectorContext?.state.searchValue, selectorContext?.state.isRoot]);

    const sendResult = useCallback(
        (actionName, args) => {
            popupContext.sendResult(actionName, ...args);
        },
        [popupContext]
    );

    const itemPadding = useMemo(() => {
        return {
            top: 'null',
            bottom: 'null',
            ...props.itemPadding,
            left: getLeftPadding(
                props,
                !!selectorContext?.state.searchValue && !!selectorContext?.state.items?.getCount(),
                selectorContext?.state.isRoot
            ),
            right: !props.headerContentVisible ? 'l' : props.multiSelect ? 'm' : 's',
        } as IPadding;
    }, [
        props.itemPadding,
        props.multiSelect,
        props.markerVisibility,
        props.allowAdaptive,
        selectorContext?.state.searchValue,
    ]);

    const itemActions = useMemo(() => {
        if (props.allowPin) {
            const baseConfig = {
                showType: TItemActionShowType.TOOLBAR,
                iconStyle: 'unaccented',
                handler: (item) => {
                    return sendResult('pinClick', [item]);
                },
            };
            const historyActions: IItemAction[] = [
                {
                    ...baseConfig,
                    ...itemActionPin,
                    iconSize: 's',
                },
                {
                    ...baseConfig,
                    ...itemActionsUnpin,
                    iconSize: 's',
                },
            ];
            return historyActions.concat(props.itemActions || []);
        }
        return props.itemActions;
    }, [props.allowPin, props.itemActions]);

    const itemActionVisibilityCallback = useCallback(
        (action: IItemAction, item: Model, isEditing: boolean) => {
            if (action.id === 'pin' || action.id === 'unpin') {
                const hasPin = menuUtil.hasPinIcon(
                    {
                        parentProperty: props.parentProperty,
                        nodeProperty: props.nodeProperty,
                        allowPin: props.allowPin,
                        historyRoot: props.historyRoot ?? null,
                    },
                    item,
                    selectorContext?.state.searchValue
                );
                const isPinned = item.get('pinned');
                return (
                    hasPin &&
                    ((action.id === 'pin' && !isPinned) || (action.id === 'unpin' && isPinned))
                );
            } else if (props.itemActionVisibilityCallback) {
                return props.itemActionVisibilityCallback(action, item, isEditing);
            }
            return true;
        },
        [
            props.allowPin,
            selectorContext?.state.searchValue,
            props.itemActionVisibilityCallback,
            props.parentProperty,
            props.historyRoot,
        ]
    );

    const beforeItemExpand = useCallback(
        (item: Model) => {
            if (props.isAdaptive) {
                selectorContext?.setRoot(item.getKey());
            }
        },
        [props.isAdaptive, selectorContext]
    );

    const onItemClick = useCallback(
        (item, event) => {
            if (selectorContext?.state.sourceController?.isLoading()) {
                return;
            }
            const onItemClickHandler = () => {
                if (props.onItemClick) {
                    return props.onItemClick(item, event);
                } else {
                    sendResult('itemClick', [item, event]);
                }
            };
            const isNode = item.get(props.nodeProperty);
            let result;
            if (isNode === false) {
                result = onItemClickHandler();
                if (result !== 'enter') {
                    if (selectorContext?.state.expandedItems?.includes(item.getKey())) {
                        selectorContext?.collapse(item.getKey());
                    } else {
                        selectorContext?.expand(item.getKey());
                    }
                } else {
                    selectorContext?.setRoot(item.getKey());
                }
            } else if (isNode) {
                if (props.viewMode === 'table' && selectorContext?.state.searchValue) {
                    // В этом случае строится TreeGrid, а он не умеет сам делать проваливание
                    selectorContext?.setRoot(item.getKey());
                }
                onItemClickHandler();
            } else if (
                props.multiSelect &&
                (selectionChanged.current || applyButtonVisible) &&
                !emptyKeys.includes(item.getKey())
            ) {
                if (
                    (props.emptyText || props.emptyKey instanceof Array) &&
                    needUpdateEmptyKeySelected(
                        item.getKey(),
                        emptyKeys,
                        selectorContext?.state.selectedKeys
                    )
                ) {
                    selectorContext?.select(emptyKeys[0]);
                }
                selectorContext?.select(item.getKey());
                selectionChanged.current = true;
            } else {
                onItemClickHandler();
            }
        },
        [sendResult, props.selectedKeys, emptyKeys, applyButtonVisible]
    );

    const applyButtonClick = useCallback(() => {
        sendResult('applyClick', [
            {
                items: selectedItems.current,
                selection: {
                    selected: selectorContext?.state.selectedKeys,
                    excluded: selectorContext?.state.excludedKeys,
                },
            },
        ]);
    }, [sendResult, selectorContext?.state.selectedKeys, selectorContext?.state.excludedKeys]);

    const toggleExpanded = useCallback(() => {
        selectorContext?.toggleExpanded?.();
        props.onExpanderButtonClick();
    }, [selectorContext]);

    useLayoutEffect(() => {
        const newApplyButtonVisible =
            isKeysChanged(selectorContext?.state.selectedKeys, initSelectedKeys.current || []) ||
            isKeysChanged(selectorContext?.state.excludedKeys, initExcludedKeys.current || []);
        props.updateApplyButtonVisible(newApplyButtonVisible);
        setApplyButtonVisible(newApplyButtonVisible);
    }, [selectorContext?.state.selectedKeys, selectorContext?.state.excludedKeys]);

    const onBeforeSelectionChanged = useCallback(
        (newSelection: ISelectionDifference): ISelectionObject => {
            const selection = {
                selected: getSelectedKeys(
                    newSelection.selectedKeysDifference.keys,
                    newSelection.selectedKeysDifference.added,
                    emptyKeys
                ),
                excluded: newSelection.excludedKeysDifference.keys,
            };
            if (selectorContext?.state.searchValue) {
                toggleSelectedItem(
                    selectedItems?.current,
                    selectorContext?.state,
                    newSelection.selectedKeysDifference
                );
            } else {
                selectedItems.current = getSelectedItems(
                    selectorContext?.state.items,
                    selection.selected
                );
            }
            return selection;
        },
        [emptyKeys]
    );

    const itemTemplateOptions = useMemo(() => {
        return {
            ...props.itemTemplateOptions,
            multiSelect: props.multiSelect,
            parentProperty: props.parentProperty,
            nodeProperty: props.nodeProperty,
            historyRoot: props.historyRoot,
            emptyText: props.emptyText,
            emptyKey: props.emptyKey,
            allowPin: props.allowPin,
        };
    }, [
        props.multiSelect,
        props.parentProperty,
        props.nodeProperty,
        props.historyRoot,
        props.emptyText,
        props.emptyKey,
        props.allowPin,
        props.itemTemplateOptions,
    ]);

    const getGroupProps = useCallback(
        (groupName: string) => {
            return {
                expanderVisible: false,
                textVisible: false,
                ...(props.getGroupProps?.(groupName) || {}),
                paddingTop: 'null',
                paddingBottom: 'selectorSticky_group-bottom',
            };
        },
        [props.getGroupProps]
    ) as unknown as TGetGroupPropsCallback;

    const bottomShadowVisibility = useMemo(() => {
        if (
            props.stickyFooter &&
            ((selectorContext?.state.isRoot && props.footerContentTemplate) ||
                (!selectorContext?.state.isRoot && props.nodeFooterTemplate) ||
                selectorContext?.state.expanderButtonVisible)
        ) {
            return SHADOW_VISIBILITY.AUTO;
        }
        return SHADOW_VISIBILITY.HIDDEN;
    }, [
        selectorContext?.state.expanderButtonVisible,
        props.stickyFooter,
        selectorContext?.state.isRoot,
        props.footerContentTemplate,
        props.nodeFooterTemplate,
    ]);

    const ListView =
        props.viewMode === 'table' && selectorContext?.state.searchValue
            ? TreeGridView
            : ExplorerView;

    return (
        <>
            {applyButtonVisible ? (
                <div
                    className={`controls-Layout-SelectorPopup-Sticky__applyButton
                           controls-Layout-SelectorPopup-Sticky__applyButton-${
                               props.allowAdaptive ? 'adaptive' : 'default'
                           }`}
                >
                    <Button
                        viewMode="filled"
                        contrastBackground={props.allowAdaptive}
                        icon="icon-Yes"
                        iconSize={props.isAdaptive ? 'm' : 's'}
                        iconStyle="contrast"
                        buttonStyle="success"
                        caption={null}
                        className="controls-Menu__applyButton"
                        onClick={applyButtonClick}
                    />
                </div>
            ) : null}
            <ScrollContainer
                className={`controls-ScrollContainer__flex controls-SlidingPanel__scrollWrapper
                       ${
                           props.allowAdaptive && !props.adaptiveMenuIsSwiped
                               ? 'tw-flex-shrink-0'
                               : 'controls-Menu__scroll'
                       }
                       ${
                           !props.searchParam && props.headerContentTemplate && !props.isAdaptive
                               ? 'controls-Menu__popup-list_margin-top'
                               : ''
                       }`}
                shadowMode={SHADOW_MODE.JS}
                scrollbarVisible={props.scrollbarVisible}
                topShadowVisibility={SHADOW_VISIBILITY.AUTO}
                bottomShadowVisibility={bottomShadowVisibility}
            >
                <ListView
                    className={`${props.className} controls-menu`}
                    ref={explorerRef}
                    storeId="_selectorStoreId"
                    items={selectorContext?.state.items}
                    breadcrumbsVisibility="hidden"
                    columns={columns}
                    emptyTemplate={props.emptyTemplate}
                    emptyView={props.emptyView || EMPTY_VIEW}
                    emptyViewProps={EMPTY_VIEW_PROPS}
                    expanderIcon="hiddenNode"
                    expanderPosition={props.allowAdaptive ? 'custom' : props.expanderPosition}
                    dataLoadCallback={props.dataLoadCallback}
                    fontSize="xl"
                    getGroupProps={getGroupProps}
                    groupProperty={props.groupProperty}
                    groupRender={props.groupRender}
                    groupTemplate={<GroupTemplate groupTemplate={props.groupTemplate} />}
                    itemActions={itemActions}
                    itemActionsPosition="custom"
                    itemActionVisibilityCallback={itemActionVisibilityCallback}
                    itemPadding={itemPadding}
                    itemsSpacing={props.allowAdaptive ? null : 'xs'}
                    itemTemplate={ListItemTemplate}
                    itemTemplateOptions={itemTemplateOptions}
                    multiSelect={props.multiSelect}
                    multiSelectAccessibilityProperty={props.multiSelectAccessibilityProperty}
                    multiSelectPosition="custom"
                    multiSelectTemplate={MultiSelectTemplate}
                    roundBorder={props.allowAdaptive ? undefined : ROUND_BORDER}
                    searchBreadCrumbsItemTemplate={SearchBreadCrumbsItemTemplate}
                    stickyGroup={props.stickyGroup ?? false}
                    onBeforeItemExpand={beforeItemExpand}
                    onItemClick={onItemClick}
                    onBeforeSelectionChanged={onBeforeSelectionChanged}
                />
                <ControlFooterTemplate
                    stickyFooter={props.stickyFooter}
                    backgroundStyle={props.backgroundStyle}
                    onExpanderButtonClick={toggleExpanded}
                    expanded={selectorContext?.state.expandedButton}
                    footerContentTemplate={props.footerContentTemplate}
                    footerItemData={props.footerItemData}
                    showMoreRightTemplate={
                        selectorContext?.state.isRoot ? props.showMoreRightTemplate : null
                    }
                    expanderButtonVisible={selectorContext?.state.expanderButtonVisible || false}
                    className={`${
                        !props.allowAdaptive
                            ? 'controls-padding_left-2xs controls-padding_right-2xs'
                            : ''
                    }`}
                />
            </ScrollContainer>
        </>
    );
});

function getLeftPadding(props: ISelectorViewOptions, isSearch?: boolean, isRoot?: boolean): string {
    const hasNode =
        (!isRoot || hasNodeInRoot(props.items, props.nodeProperty)) && props.nodeProperty;
    let leftSpacing = props.isAdaptive
        ? 'xl'
        : (isSearch && props.viewMode !== 'table') || props.expanderPosition === 'custom'
        ? '2xl'
        : hasNode || props.multiSelect || props.markerVisibility !== 'hidden'
        ? '2xs'
        : '2xl';
    if (props.itemPadding?.left) {
        leftSpacing = props.itemPadding.left;
    }
    return leftSpacing;
}

function hasNodeInRoot(items: RecordSet<Model>, nodeProperty: string): boolean {
    let result = false;
    items?.each((item) => {
        if (!result) {
            const isNode = item.get(nodeProperty);
            result = isNode === false || isNode === true;
        }
    });
    return result;
}

function getColumns(options: ISelectorViewOptions): IColumn[] {
    const hoverBackgroundStyle =
        options.hoverBackgroundStyle !== 'default' ? options.hoverBackgroundStyle : 'menu-default';

    return [
        {
            displayProperty: options.displayProperty,
            hoverBackgroundStyle,
            fontColorStyle: options.fontColorStyle,
            fontSize: 'xl',
            template: ColumnTemplate,
            width: '100%',
            templateOptions: {
                allowAdaptive: options.allowAdaptive,
                source: options.source,
                root: options.root,
                itemTemplate: options.itemTemplate || ItemTemplate,
                itemTemplateProperty: options.itemTemplateProperty,
                cellPadding: null,
                allowAdaptive: options.allowAdaptive,
                markerVisibility: options.markerVisibility,
                multiSelect: options.multiSelect,
                emptyKey: options.emptyKey,
                emptyText: options.emptyText,
                selectedAllKey: options.selectedAllKey,
                selectedAllText: options.selectedAllText,
                hoverBackgroundStyle,
                breadCrumbsItemTemplate: options.breadCrumbsItemTemplate,
                iconSize: options.iconSize,
                iconStyle: options.iconStyle,
                iconPadding: options.iconPadding,
                markerPosition: options.markerPosition,
                allowPin: options.allowPin,
                itemAlign: options.itemAlign,
                historyRoot: options.historyRoot,
                width: options.width,
                directionality: controller.currentLocaleConfig.directionality,
                focusable: options.focusable,
                fontColorStyle: options.fontColorStyle,
            },
        },
    ];
}

function isKeysChanged(newKeys: TKey[], oldKeys: TKey[]): boolean {
    const diffKeys: TKey[] = newKeys.filter((key) => {
        return !oldKeys.includes(key);
    });
    return newKeys.length !== oldKeys.length || !!diffKeys.length;
}

function addSingleSelectionItem(
    emptyText: string,
    emptyKey: TKey | TKey[],
    items: RecordSet,
    options: IMenuControlOptions
): void {
    if (!(emptyKey instanceof Array) && emptyText && !items.getRecordById(emptyKey)) {
        const emptyItem = menuUtil.getEmptyItemConfig(items, {
            emptyText,
            emptyKey,
            root: options.root,
            nodeProperty: options.nodeProperty,
            keyProperty: options.keyProperty,
            parentProperty: options.parentProperty,
            displayProperty: options.displayProperty,
        });
        items.add(emptyItem, 0);
    }
}

function getSelectedKeys(keys: TKey[], added: TKey[], emptyKeys: TKey[]): TKey[] {
    const removeEmptyKey = !!added?.length && isEmptyKeySelected(emptyKeys, keys);

    const isEmptySelection = !keys?.length;
    let selected;
    if (removeEmptyKey) {
        selected = added;
    } else if (isEmptySelection && emptyKeys[0] !== undefined) {
        selected = [emptyKeys[0]];
    } else {
        selected = keys;
    }
    return selected;
}

function needUpdateEmptyKeySelected(
    newKey: TKey,
    emptyKeys: TKey[],
    selectedKeys?: TKey[]
): boolean {
    return (
        (selectedKeys?.includes(newKey) && selectedKeys?.length === 1) ||
        !selectedKeys?.length ||
        isEmptyKeySelected(emptyKeys, selectedKeys)
    );
}

function getSelectedItems(items?: RecordSet, selectedKeys: TKey[] = []): Model[] {
    const selectedItems: Model[] = [];
    items?.forEach((item) => {
        if (selectedKeys.includes(item.getKey())) {
            selectedItems.push(item);
        }
    });
    return selectedItems;
}

function toggleSelectedItem(
    selectedItems: Model[],
    state: IListState,
    { added, removed }: IKeysDifference
): void {
    if (state.items) {
        if (added?.length) {
            added.forEach((addedKey) => {
                selectedItems.push(state.items.getRecordById(addedKey));
            });
        } else if (removed?.length) {
            removed.forEach((removedKey) => {
                const index = selectedItems.findIndex((item) => item.getKey() === removedKey);
                selectedItems.splice(index, 1);
            });
        }
    }
}
