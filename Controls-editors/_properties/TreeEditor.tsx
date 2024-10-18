import {
    Fragment,
    forwardRef,
    useCallback,
    useContext,
    useMemo,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { HierarchicalMemory, LOCAL_MOVE_POSITION, Memory } from 'Types/source';
import { ItemTemplate, View } from 'Controls/treeGrid';
import { ColumnTemplate, ItemTemplate as GridItemTemplate, View as GridView } from 'Controls/grid';
import { EditingTemplate } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { Model } from 'Types/entity';
import { Collection, Input } from 'Controls/lookup';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { ItemsEntity } from 'Controls/dragnDrop';
import { RecordSet } from 'Types/collection';
import { DataContext, Provider, useConnectedValue } from 'Controls-DataEnv/context';
import { CheckboxMarker } from 'Controls/checkbox';
import { switchCircleTemplate as SwitchCircleTemplate } from 'Controls/RadioGroup';
import * as rk from 'i18n!Controls-editors';
import { useContent } from 'UICore/Jsx';
import { FocusRoot } from 'UI/Focus';
import {
    IPropertyGridPropertyEditorProps,
    PropertyGridGroupHeader,
} from 'Controls-editors/propertyGrid';
import 'css!Controls-editors/_properties/TreeEditor';
import {
    FIELD_DATA_SLICE,
    FIELD_LIST_SLICE,
    POPUP_FIELD_LIST_SLICE,
} from 'Controls-editors/_properties/NameEditor/dataFactory/constants';
import FieldListFactory from 'Controls-editors/_properties/NameEditor/dataFactory/FieldsListFactory';
import { Slice } from 'Controls-DataEnv/slice';
import clone = require('Core/core-clone');
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';

const DATA = [
    { id: 1, title: rk('Совещание'), parent: null, 'parent@': true },
    { id: 2, title: rk('Название'), parent: 1 },
    { id: 3, title: rk('Ссылка'), parent: null },
    { id: 4, title: rk('Группа'), parent: null },
    { id: 5, title: rk('Помещение'), parent: null },
    { id: 6, title: rk('Тип'), parent: null },
    { id: 7, title: rk('Состояние'), parent: null },
];

interface IItem {
    id: number;
    clonedId: number;
    title: string;
    parent: number;
    node: true | false | null;
}

interface IValue {
    items: IItem[];
    selectedKeys?: string[];
}

/**
 * @public
 */
export interface ITreeEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    /**
     * Видимость чекбоксов
     */
    multiSelectVisibility: 'visible' | 'onhover' | 'hidden';
    /**
     * Режим отображения маркера
     */
    markerVisibility: 'visible' | 'hidden';
    /**
     * Режим отображения чекбокса
     */
    checkboxVisibility: 'visible' | 'hidden';
    /**
     * Режим отображения кнопки-экспандера в дереве
     */
    expanderVisibility: string;
    /**
     * Определяет наличие иерархии
     */
    allowHierarchy: boolean;
    /**
     * Определяет возможность выбора
     */
    selectable?: boolean;
    /**
     * Определяет набор записей по которым строится контрол.
     */
    items: IItem[];
    /**
     * Текст заголовка редактора.
     */
    groupCaption?: string;
    /**
     * Расположение экспандера
     */
    expanderPosition?: string;
}

interface IItemRef {
    items?: IItem[];
    record?: RecordSet;
    isDefaultValue?: boolean;
    config?: object;
}

interface IResultSelector {
    id: number;
    data: string;
    parent?: number;
}

const defaultItemActions = [
    {
        id: 'delete',
        icon: 'icon-Trash-bucket',
        showType: showType.TOOLBAR,
        iconStyle: 'danger',
        iconSize: 'm',
        tooltip: rk('Удалить'),
    },
    {
        id: 'delete',
        icon: 'icon-Trash-bucket',
        title: rk('Удалить'),
        showType: showType.MENU,
    },
    {
        id: 'copy',
        icon: 'icon-Copy',
        title: rk('Дублировать'),
        showType: showType.MENU,
    },
    {
        id: 'nesting',
        icon: 'icon-AutoIndent',
        title: rk('Создать вложенность'),
        showType: showType.MENU,
    },
    {
        id: 'noNesting',
        icon: 'icon-AutoIndent2',
        title: rk('Убрать вложенность'),
        showType: showType.MENU,
    },
];

function getDefaultCorrectValue(data: Record<string, unknown>) {
    return data;
}

function EditorTemplate(props): JSX.Element {
    const items = useRef(
        new RecordSet({
            keyProperty: 'id',
            rawData: [],
        })
    );
    const source = useMemo(() => {
        return new Memory({
            data: DATA,
            keyProperty: 'id',
        });
    }, []);

    const fieldsSlice = props?.dataContext?.[FIELD_DATA_SLICE] as Slice<unknown>;
    const fieldListSlice = props?.dataContext?.[FIELD_LIST_SLICE] as Slice<unknown>;
    const fields = fieldsSlice?.state.fields;

    /*
     * TODO: удалить после появления опенера списка полей https://online.sbis.ru/opendoc.html?guid=4448fd3d-7a2b-40f6-bc33-16d3745822f9&client=3
     * Создаём слайс самостоятельно, пока не появится возможность добавлять в существующий контекст новые слайсы
     */
    const fieldListPopupContext = useMemo(() => {
        const config = {
            fields,
            filter: { isTreeFilter: true },
            markerVisibility: 'hidden',
            expanderVisibility: 'hasChildren',
            searchParam: 'title',
            loadDataTimeout: 0,
            keyProperty: 'Id',
            parentProperty: 'Parent',
            nodeProperty: 'Parent_',
            hasChildrenProperty: 'Parent_',
            titleProperty: 'FullDisplayName',
            displayProperty: 'DisplayName',
            descriptionField: '',
            columns: fieldListSlice?.state?.columns,
        };
        return {
            ...props.dataContext,
            [POPUP_FIELD_LIST_SLICE]: new FieldListFactory.slice({
                config,
                loadResult: {
                    fields,
                },
                onChange: () => {},
            }),
        };
    }, [fields]);

    const selectorTemplate = {
        templateName: 'Controls-editors/properties:NameEditorPopup',
        templateOptions: {
            dataContext: fieldListPopupContext,
            sendResultCallback: (result: IResultSelector) => {
                const itemId = props.item.item.get('id');
                const item = props.currentValue.items.filter((item) => item.id === itemId);
                item[0].name = result.data;
                props.onChange({
                    items: [...props.currentValue.item],
                    selectedKeys: props.selectedKeys,
                });
            },
        },
        popupOptions: {
            width: 500,
            height: 500,
        },
    };
    const onSelectorCallback = (keys) => {
        if (!keys.length) {
            const itemId = props.item.item.get('id');
            const item = props.currentValue.item.filter((item) => item.id === itemId);
            delete item[0].name;
            props.onChange({
                items: [...props.currentValue.items],
                selectedKeys: props.selectedKeys,
            });
        }
    };

    const onValueChanged = useCallback((value) => {
        props.item.item.set('title', value);
    }, []);

    return (
        <div className="ws-flexbox ws-flex-column controls-padding_left-2xs">
            <FocusRoot autofocus={true} ref={props.$wasabyRef} as={'div'}>
                <Input
                    showSelectButton={false}
                    className="controls-TreeEditor-Lookup"
                    value={props.item.item.get('title')}
                    searchParam="title"
                    keyProperty="id"
                    placeholder={props.editorPlaceholder}
                    multiSelect={false}
                    commentVisibility="always"
                    selectorTemplate={selectorTemplate}
                    source={source}
                    onValueChanged={onValueChanged}
                    onSelectorCallback={onSelectorCallback}
                    contrastBackground={true}
                    horizontalPadding="null"
                    minSearchLength={items.current.getCount() ? 3 : null}
                    customEvents={['onValueChanged', 'onSelectorCallback']}
                />
                {items.current.getCount() ? (
                    <Collection
                        displayProperty="title"
                        keyProperty="id"
                        items={items.current}
                        fontSize="xs"
                        fontColorStyle="label"
                    />
                ) : null}
            </FocusRoot>
        </div>
    );
}

function isCheckboxSelected(items, item, selectedKeys) {
    let res = selectedKeys?.includes(item.item.get('id'));
    if (!res) {
        let triState = false;
        if (item.item.get('node')) {
            items.forEach((el) => {
                if (el.parent === item.item.get('id')) {
                    if (selectedKeys?.includes(el.id)) {
                        res = true;
                    } else {
                        triState = true;
                    }
                }
            });
            if (res && triState) {
                res = null;
            }
        }
    }
    return res;
}

export function InnerContentTemplate(props): JSX.Element {
    let className = props.contentClassName || '';
    if (props.item?.isEditing()) {
        className += ' tw-w-full';
    }
    const attrs = useMemo(() => {
        const res = { ...props.attrs };
        res.className = `${res.className || ''}${
            (props.allowHierarchy && props.checkboxVisibility !== 'hidden') ||
            props.markerVisibility === 'visible'
                ? ''
                : ' controls-padding_left-m'
        } controls-margin_right-${!props.item.isEditing?.() ? 'm' : 's'}`;
        return res;
    }, [props.item.isEditing?.()]);
    return (
        <div className={className}>
            <div className="tw-flex tw-items-baseline">
                {(props.allowHierarchy || props.selectable) &&
                props.markerVisibility === 'visible' ? (
                    <SwitchCircleTemplate
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            props.onChange({
                                items: props.currentValue.items,
                                selectedKeys: [props.item.item.get('id')],
                            });
                        }}
                        className="controls-margin_left-m controls-margin_right-2xs"
                        selected={props.selectedKeys?.[0] === props.item.item.get('id')}
                    />
                ) : props.allowHierarchy && props.checkboxVisibility !== 'hidden' ? (
                    <CheckboxMarker
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const selectedKeys = props.selectedKeys || [];
                            const index = selectedKeys.indexOf(props.item.item.get('id'));
                            if (index !== -1) {
                                selectedKeys.splice(index, 1);
                            } else {
                                selectedKeys.push(props.item.item.get('id'));
                            }
                            props.onChange({ items: props.currentValue.items, selectedKeys });
                        }}
                        attrs={{ tabIndex: -1 }}
                        viewMode="ghost"
                        className="controls-margin_left-s"
                        triState={true}
                        value={isCheckboxSelected(
                            props.currentValue.items,
                            props.item,
                            props.selectedKeys
                        )}
                    />
                ) : null}
                <EditingTemplate
                    value={props.item.item.get('title')}
                    {...props}
                    attrs={attrs}
                    size="m"
                    editorTemplate={useContent((contentProps) => {
                        return (
                            <EditorTemplate
                                {...contentProps}
                                dataContext={props.dataContext}
                                currentValue={props.currentValue}
                                selectedKeys={props.selectedKeys}
                                editorPlaceholder={props.editorPlaceholder}
                                onChange={props.onChange}
                            />
                        );
                    })}
                />
                {props.expanderTemplate && <props.expanderTemplate />}
            </div>
        </div>
    );
}

function InnerTreeItemTemplate(props): JSX.Element {
    return (
        <ItemTemplate
            {...props}
            size="m"
            contentTemplate={<InnerContentTemplate {...props} />}
            className={`controls-TreeEditor-itemTemplate ${props.className}`}
        />
    );
}

function InnerGridItemTemplate(props): JSX.Element {
    return (
        <GridItemTemplate
            {...props}
            contentTemplate={<InnerContentTemplate {...props} />}
            className={`controls-TreeEditor-itemTemplate ${props.className}`}
        />
    );
}

function InnerColumnTemplate(props): JSX.Element {
    return (
        <ColumnTemplate
            {...props}
            contentTemplate={<InnerContentTemplate {...props} />}
            className={
                'controls-TreeEditor-itemTemplate' +
                (props.item?.isEditing() ? ' tw-w-full ' : ' ') +
                props.className
            }
        />
    );
}

function onFooterClickHandler(component, getCorrectValue): void {
    component.beginAdd({
        item: new Model({
            keyProperty: 'id',
            rawData: getCorrectValue({
                id: Date.now(),
                title: '',
                parent: null,
                node: false,
            }),
        }),
    });
}

const getConfig = (
    data: object[],
    allowHierarchy: boolean,
    expanderVisibility: string,
    expandedItems?: number[]
) => {
    return {
        treeEditorId: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                parentProperty: 'parent',
                expanderIcon: 'hiddenNode',
                expanderPosition: 'right',
                hasChildrenProperty: 'node',
                nodeProperty: allowHierarchy ? 'node' : null,
                keyProperty: 'id',
                markerVisibility: 'hidden',
                multiSelectVisibility: 'hidden',
                expanderVisibility,
                itemsDragNDrop: true,
                expandedItems,
                source: new HierarchicalMemory({
                    keyProperty: 'id',
                    data,
                }),
            },
        },
    };
};

/**
 * Реакт компонент, редактор, позволяющий настроить данные в виде иерархического списка
 * @class Controls-editors/_properties/TreeEditor
 * @implements Controls-editors/properties:ITreeEditorProps
 * @public
 */
export const TreeEditor = forwardRef((props: ITreeEditorProps, ref): JSX.Element | null => {
    const {
        type,
        onChange,
        LayoutComponent = Fragment,
        expanderVisibility,
        allowHierarchy,
        items,
        markerVisibility = 'hidden',
        checkboxVisibility,
        footerCaption = rk('Добавить вариант'),
        editorPlaceholder = rk('Введите название позиции'),
        getCorrectValue = getDefaultCorrectValue,
        value = {} as IValue,
        itemActionsPosition = 'outside',
    } = props;
    const readOnly = type.isDisabled();
    const { name } = useContext(ObjectTypeEditorValueContext);
    const connectedValue = useConnectedValue(name);
    const viewRef = useRef(null);
    const currentItem = useRef<IItemRef>({});
    const [expandedItems, setExpandedItems] = useState(undefined);

    useImperativeHandle(ref, () => {
        return viewRef.current;
    });
    const source = useMemo(() => {
        if (value.items) {
            if (
                currentItem.current.isDefaultValue ||
                JSON.stringify(value.items) !== JSON.stringify(currentItem.current.items)
            ) {
                currentItem.current.isDefaultValue = false;
                currentItem.current.items = clone(value.items);
                currentItem.current.record = new RecordSet({
                    keyProperty: 'id',
                    rawData: [...currentItem.current.items],
                });
                currentItem.current.config = getConfig(
                    currentItem.current.items,
                    allowHierarchy,
                    expanderVisibility,
                    expandedItems
                );
            }
        } else {
            currentItem.current.items = clone(items);
            currentItem.current.isDefaultValue = true;
            currentItem.current.record = new RecordSet({
                keyProperty: 'id',
                rawData: [...currentItem.current.items],
            });
            currentItem.current.config = getConfig(
                currentItem.current.items,
                allowHierarchy,
                expanderVisibility,
                expandedItems
            );
        }
        return currentItem.current.record;
    }, [items, value.items]);
    const loadResults = useMemo(() => {
        return {
            treeEditorId: {
                displayProperty: 'title',
                parentProperty: 'parent',
                items: source,
                type: 'list',
            },
        };
    }, [source]);
    const dataContext = useContext(DataContext);

    const onBeforeEndEdit = useCallback(
        (model, willSave, isAdd) => {
            if (willSave) {
                const rawData = model.getRawData();
                const itemsData = [...currentItem.current.items];
                if (isAdd) {
                    if (!rawData.title.length) {
                        viewRef.current.cancelEdit();
                        return Promise.resolve(false);
                    } else {
                        itemsData.push(rawData);
                        onChange({ ...value, items: itemsData });
                    }
                } else {
                    for (let i = 0; i < itemsData.length; i++) {
                        if (itemsData[i].id === rawData.id) {
                            itemsData[i] = rawData;
                            break;
                        }
                    }
                    onChange({ ...value, items: itemsData });
                }
            }
        },
        [value]
    );

    const onAfterEndEdit = useCallback(() => {
        onChange({ ...value, items: [...currentItem.current.items] });
    }, [value]);

    const onActionClick = useCallback(
        (action: IItemAction, item: Model) => {
            if (defaultItemActions.find(({ id }) => id === action.id)) {
                const itemsData = currentItem.current.items;
                switch (action.id) {
                    case 'delete':
                        const result = itemsData.filter((elem) => {
                            return elem.parent !== item.get('id') && elem.id !== item.get('id');
                        });
                        onChange({ ...value, items: [...result] });
                        break;
                    case 'copy':
                        const copyItem = {
                            ...itemsData.filter((elem) => {
                                return elem.id === item.get('id');
                            })[0],
                        };
                        copyItem.clonedId = copyItem.id;
                        copyItem.id = Date.now() + copyItem.id;
                        itemsData.push(copyItem);
                        onChange({ ...value, items: [...itemsData] });
                        viewRef.current.reload();
                        break;
                    case 'nesting':
                        for (let i = 0; i < itemsData.length; i++) {
                            if (itemsData[i].id === item.get('id') && itemsData[i - 1]) {
                                let correctIndex = i - 1;
                                if (itemsData[i].parent !== itemsData[correctIndex].parent) {
                                    correctIndex = itemsData.findIndex((item) => {
                                        return item.id === itemsData[correctIndex].parent;
                                    });
                                }
                                itemsData[i].parent = itemsData[correctIndex].id;
                                itemsData[correctIndex].node = true;
                            }
                        }
                        onChange({ ...value, items: [...itemsData] });
                        viewRef.current.reload();
                        break;
                    case 'noNesting':
                        const nestingItem = itemsData.filter((elem) => {
                            return elem.id === item.get('id');
                        })[0];
                        if (nestingItem.parent) {
                            const parentItem = itemsData.filter((elem) => {
                                return elem.id === item.get('parent');
                            })[0];
                            nestingItem.parent = parentItem.parent;
                            const childrenItems = itemsData.filter((elem) => {
                                return elem.parent === parentItem.id;
                            });
                            if (!childrenItems.length) {
                                parentItem.node = null;
                            }
                            onChange({ ...value, items: [...itemsData] });
                            viewRef.current.reload();
                        }
                        break;
                }
            } else {
                if (props.onActionClick) {
                    props.onActionClick(action, item);
                }
            }
        },
        [value, props.onActionClick]
    );

    const onCustomdragEnd = useCallback(
        (entity: ItemsEntity, target: Model, position: LOCAL_MOVE_POSITION) => {
            const selection = {
                selected: entity.getItems(),
                excluded: [],
            };
            return viewRef.current.moveItems(selection, target.getKey(), position).then(() => {
                const treeComponent = viewRef.current;
                const itemsData = clone(currentItem.current.items);
                itemsData.forEach((item) => {
                    // папки после DnD оставляем папками
                    item.node =
                        item.node || itemsData.some((elem) => elem.parent === item.id) || null;
                });
                onChange({ ...value, items: itemsData });
                treeComponent.reload();
            });
        },
        [value]
    );

    const itemActionVisibilityCallback = useCallback((action: IItemAction, item: Model) => {
        if (!defaultItemActions.find(({ id }) => id === action.id)) {
            return props.itemActionVisibilityCallback?.(action.item, action, item);
        }
        switch (action.id) {
            case 'nesting':
                if (allowHierarchy) {
                    const itemsData = currentItem.current.items;
                    for (let i = 0; i < itemsData.length; i++) {
                        if (
                            itemsData[i].id === item.get('id') &&
                            itemsData[i - 1] &&
                            itemsData[i - 1].id !== item.get('parent')
                        ) {
                            return true;
                        }
                    }
                }
                return false;
            case 'noNesting':
                if (allowHierarchy) {
                    return !!item.get('parent');
                }
                return false;
            default:
                return (
                    currentItem.current.items.findIndex((el) => {
                        return el.id === item.get('id');
                    }) !== -1
                );
        }
    }, []);

    const onDeactivated = () => {
        viewRef.current.commitEdit();
    };
    const contentClassName = 'controls-TreeEditor-contentTemplate ws-flexbox';
    const listOptions = {
        className: `controls-TreeEditor ${props.className}`,
        ref: viewRef,
        editingConfig: {
            editOnClick: props.editOnClick !== false,
            toolbarVisibility: true,
        },
        itemTemplate: allowHierarchy ? InnerTreeItemTemplate : InnerGridItemTemplate,
        readOnly,
        rowSeparatorSize: 'null',
        itemActions: [...(props.itemActions || []), ...defaultItemActions],
        itemActionVisibilityCallback,
        itemActionsPosition,
        expanderIcon: 'hiddenNode',
        expanderPosition: props.expanderPosition || 'right',
        itemPadding: { top: 'S', bottom: 'S', left: 'null', right: 'null' },
        expanderVisibility,
        itemsDragNDrop: true,
        onBeforeEndEdit,
        onAfterEndEdit,
        onCustomdragEnd,
        onActionClick,
        onDeactivated,
        itemTemplateOptions: {
            contentClassName,
        },
        columns: props.columns || [
            {
                displayProperty: 'title',
                cellPadding: { right: 'null', left: 'null' },
                template: InnerColumnTemplate,
                templateOptions: {
                    onChange,
                    contentClassName,
                    selectedKeys: props.value?.selectedKeys,
                    currentValue: currentItem.current,
                    allowHierarchy,
                    selectable: props.selectable,
                    markerVisibility,
                    checkboxVisibility,
                    dataContext,
                    editorPlaceholder,
                },
            },
        ],
        footerTemplate: useContent(() => {
            return footerCaption ? (
                <Button
                    icon="icon-Add"
                    iconStyle="unaccented"
                    iconSize="s"
                    fontColorStyle="unaccented"
                    caption={footerCaption}
                    underlineVisible={false}
                    viewMode="link"
                    className="controls-margin_top-s controls-margin_left-s"
                    data-qa="Controls-editors_TreeEditor__add-button"
                    onClick={() => onFooterClickHandler(viewRef.current, getCorrectValue)}
                />
            ) : null;
        }),
        storeId: 'treeEditorId',
        onAfterItemExpand: (model) => {
            const node = model.get('id');
            if (expandedItems) {
                if (!expandedItems.includes(node)) {
                    expandedItems.push(node);
                    setExpandedItems([...expandedItems]);
                }
            } else {
                setExpandedItems([node]);
            }
        },
        onAfterItemCollapse: (model) => {
            const node = model.get('id');
            if (expandedItems) {
                const result = expandedItems.filter((item) => {
                    return item !== node;
                });
                if (!result.length) {
                    setExpandedItems(undefined);
                } else {
                    setExpandedItems(result);
                }
            } else {
                setExpandedItems(undefined);
            }
        },
        customEvents: [
            'onBeforeEndEdit',
            'onAfterEndEdit',
            'onActionClick',
            'onCustomdragEnd',
            'onDeactivated',
            'onAfterItemExpand',
            'onAfterItemCollapse',
        ],
    };
    const valueType = connectedValue.type?.getType();

    return typeof valueType === 'string' &&
        (valueType.toLowerCase() === 'enum' || valueType.toLowerCase() === 'flags') ? null : (
        <LayoutComponent>
            {!!props.groupCaption ? (
                <div className={'controls-TreeEditor_heading-caption'}>
                    <PropertyGridGroupHeader title={props.groupCaption} />
                </div>
            ) : null}
            <Provider loadResults={loadResults} configs={currentItem.current.config}>
                {allowHierarchy ? <View {...listOptions} /> : <GridView {...listOptions} />}
            </Provider>
        </LayoutComponent>
    );
});
