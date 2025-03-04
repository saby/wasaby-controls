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
import isEmptyKeySelected from './Utils/IsEmptyKeySelected';
import { Context as PopupContext } from 'Controls/popupTemplate';
import { Model } from 'Types/entity';
import { ISelectorBaseOptions } from './interface/ISelectorBase';
import { TKey, IPadding, ISelectionObject } from 'Controls/interface';
import { ISelectionDifference } from 'Controls/multiselection';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { IColumn, TGetGroupPropsCallback } from 'Controls/grid';
import { controller } from 'I18n/i18n';
import { useSlice } from 'Controls-DataEnv/context';
import { default as SelectorSlice } from './Factory/Slice';
import { Button } from 'Controls/buttons';
import { View as TreeGridView } from 'Controls/treeGrid';

const ROUND_BORDER = { tl: 'menu-m', tr: 'menu-m', bl: 'menu-m', br: 'menu-m' };
interface ISelectorViewOptions extends ISelectorBaseOptions {
    sendResult: Function;
    isAdaptive?: boolean;
    allowAdaptive?: boolean;
}

export default forwardRef(function SelectorStickyView(props: ISelectorViewOptions, _) {
    const explorerRef: MutableRefObject<ExplorerView | null> = useRef(null);
    const selectorContext = useSlice<SelectorSlice>('_selectorStoreId');
    const popupContext = useContext(PopupContext);
    const initSelectedKeys = useRef(selectorContext?.state.selectedKeys);
    const initExcludedKeys = useRef(selectorContext?.state.excludedKeys);
    const [prevItems, setPrevItems] = useState(props.items);

    const emptyKeys = useMemo(
        () => (props.emptyKey instanceof Array ? props.emptyKey : [props.emptyKey]),
        [props.emptyKey]
    );
    const selectionChanged = useRef(
        !!props.selectedKeys?.length && !isEmptyKeySelected(emptyKeys, props.selectedKeys)
    );
    const [applyButtonVisible, setApplyButtonVisible] = useState(() => false);

    const columns = useMemo(() => getColumns(props), []);

    useEffect(() => {
        if (props.items && prevItems && props.items !== prevItems) {
            selectorContext?.setItems(props.items);
            setPrevItems(props.items);
        }
    }, [props.items]);

    useEffect(() => {
        if (!selectorContext?.state.searchValue && !selectorContext?.state.root) {
            addSingleSelectionItem(
                props.emptyText,
                props.emptyKey,
                selectorContext?.state.items,
                selectorContext?.state
            );
        }
    }, [selectorContext?.state.searchValue, selectorContext?.state.root]);

    const sendResult = useCallback(
        (actionName, args) => {
            popupContext.sendResult(actionName, ...args);
        },
        [popupContext]
    );

    const expanderPosition = useMemo(
        () => getExpanderPosition(props),
        [props.nodeProperty, props.parentProperty, props.items, props.root, props.expanderPosition]
    );

    const itemPadding = useMemo(() => {
        return {
            left: getLeftPadding(props),
            right:
                props.multiSelect || props.markerVisibility !== 'hidden'
                    ? 's'
                    : expanderPosition === 'right'
                    ? 'm'
                    : null,
            top: 'null',
            bottom: 'null',
        } as IPadding;
    }, [expanderPosition, props.itemPadding, props.multiSelect, props.markerVisibility]);

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
            const isNode = item.get(props.nodeProperty);
            if (isNode === false) {
                sendResult('itemClick', [item, event]);
                if (selectorContext?.state.expandedItems?.includes(item.getKey())) {
                    selectorContext?.collapse(item.getKey());
                } else {
                    selectorContext?.expand(item.getKey());
                }
            } else if (isNode) {
                if (props.viewMode === 'table' && selectorContext?.state.searchValue) {
                    // В этом случае строится TreeGrid, а он не умеет сам делать проваливание
                    selectorContext?.setRoot(item.getKey());
                }
                // Надо править прикладников и включать событие, оно должно стрелять https://online.sbis.ru/opendoc.html?guid=eb55dc25-989d-4547-9421-94b5ecff85bc&client=3
                // props.sendResult('itemClick', [item, event]);
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
                sendResult('itemClick', [item, event]);
            }
        },
        [sendResult, props.selectedKeys, emptyKeys, applyButtonVisible]
    );

    const applyButtonClick = useCallback(() => {
        const selectedItems: Model<any>[] = [];
        selectorContext?.state.items.forEach((item) => {
            if (selectorContext?.state.selectedKeys.includes(item.getKey())) {
                selectedItems.push(item);
            }
        });
        sendResult('applyClick', [
            {
                items: selectedItems,
                selection: {
                    selected: selectorContext?.state.selectedKeys,
                    excluded: selectorContext?.state.excludedKeys,
                },
            },
        ]);
    }, [sendResult, selectorContext?.state.selectedKeys, selectorContext?.state.excludedKeys]);

    const toggleExpanded = useCallback(() => {
        selectorContext?.toggleExpanded?.();
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
            return {
                selected: getSelectedKeys(
                    newSelection.selectedKeysDifference.keys,
                    newSelection.selectedKeysDifference.added,
                    emptyKeys
                ),
                excluded: newSelection.excludedKeysDifference.keys,
            };
        },
        [emptyKeys]
    );

    const itemTemplateOptions = useMemo(() => {
        return {
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

    const ListView =
        props.viewMode === 'table' && selectorContext?.state.searchValue
            ? TreeGridView
            : ExplorerView;

    return (
        <>
            {applyButtonVisible ? (
                <div
                    className={`controls-Menu__popup_applyButton
                           controls-Menu_${
                               !props.allowAdaptive ? 'withClose' : 'withoutClose'
                           }__applyButton`}
                >
                    <Button
                        viewMode="filled"
                        contrastBackground={props.allowAdaptive}
                        icon="icon-Yes"
                        iconSize="s"
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
                bottomShadowVisibility={
                    props.stickyFooter &&
                    (!selectorContext?.state.root
                        ? props.footerContentTemplate
                        : props.nodeFooterTemplate)
                        ? SHADOW_VISIBILITY.AUTO
                        : SHADOW_VISIBILITY.HIDDEN
                }
            >
                <ListView
                    className={props.className}
                    ref={explorerRef}
                    storeId="_selectorStoreId"
                    items={selectorContext?.state.items}
                    breadcrumbsVisibility="hidden"
                    columns={columns}
                    emptyTemplate={props.emptyTemplate}
                    expanderIcon="hiddenNode"
                    expanderPosition={expanderPosition}
                    dataLoadCallback={props.dataLoadCallback}
                    fontSize="xl"
                    groupProperty={props.groupProperty}
                    getGroupProps={getGroupProps}
                    groupRender={props.groupRender}
                    itemActions={itemActions}
                    itemActionsPosition="custom"
                    itemActionVisibilityCallback={itemActionVisibilityCallback}
                    itemPadding={itemPadding}
                    itemsSpacing="xs"
                    itemTemplate={ListItemTemplate}
                    itemTemplateOptions={itemTemplateOptions}
                    multiSelect={props.multiSelect}
                    multiSelectAccessibilityProperty={props.multiSelectAccessibilityProperty}
                    multiSelectPosition="custom"
                    multiSelectTemplate={MultiSelectTemplate}
                    roundBorder={ROUND_BORDER}
                    onBeforeItemExpand={beforeItemExpand}
                    onItemClick={onItemClick}
                    onBeforeSelectionChanged={onBeforeSelectionChanged}
                />
            </ScrollContainer>
            <ControlFooterTemplate
                stickyFooter={props.stickyFooter}
                backgroundStyle={props.backgroundStyle}
                onExpanderButtonClick={toggleExpanded}
                expanded={selectorContext?.state.expandedButton}
                footerContentTemplate={props.footerContentTemplate}
                footerItemData={props.footerItemData}
                showMoreRightTemplate={!props.root ? props.showMoreRightTemplate : null}
                expanderButtonVisible={selectorContext?.state.expanderButtonVisible || false}
            />
        </>
    );
});

function getLeftPadding(props: ISelectorViewOptions): string {
    let leftSpacing = props.multiSelect || props.markerVisibility !== 'hidden' ? 's' : 'm';
    if (props.itemPadding?.left) {
        leftSpacing = props.itemPadding.left;
    }
    return leftSpacing;
}

function getExpanderPosition({
    nodeProperty,
    parentProperty,
    root,
    items,
    expanderPosition,
}: ISelectorViewOptions): string {
    if (expanderPosition) {
        return expanderPosition;
    }
    if (nodeProperty && parentProperty && withIcons(items, parentProperty, root)) {
        return 'right';
    }
    return 'default';
}

function withIcons(items: RecordSet<Model>, parentProperty: string, root: TKey = null): boolean {
    let result = false;
    items.each((item) => {
        const itemParent = item.get(parentProperty);
        if (!result && item.get('icon') && (itemParent === undefined || itemParent === root)) {
            result = true;
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
    } else if (isEmptySelection) {
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
