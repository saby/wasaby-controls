import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
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
import { List, RecordSet } from 'Types/collection';
import { Provider } from 'Controls-DataEnv/context';
import { CheckboxMarker } from 'Controls/checkbox';
import { switchCircleTemplate as SwitchCircleTemplate } from 'Controls/RadioGroup';
import * as rk from 'i18n!Controls-editors';
import { useContent } from 'UICore/Jsx';
import clone = require('Core/core-clone');
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import 'css!Controls-editors/_properties/TreeEditor';

const DATA = [
    {id: 1, title: rk('Совещание'), parent: null, 'parent@': true},
    {id: 2, title: rk('Название'), parent: 1},
    {id: 3, title: rk('Ссылка'), parent: null},
    {id: 4, title: rk('Группа'), parent: null},
    {id: 5, title: rk('Помещение'), parent: null},
    {id: 6, title: rk('Тип'), parent: null},
    {id: 7, title: rk('Состояние'), parent: null},
];

interface IItem {
    id: number;
    title: string;
    parent: number;
    node: true | false | null;
}

interface IValue {
    items: IItem[];
    selectedKeys?: string[];
}

interface ITreeEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    multiSelectVisibility: 'visible' | 'onhover' | 'hidden';
    markerVisibility: 'visible' | 'hidden';
    expanderVisibility: string;
    allowHierarchy: boolean;
    items: IItem[];
}

interface IItemRef {
    items?: IItem[];
    record?: RecordSet;
    isDefaultValue?: boolean;
    config?: object;
}

const itemActions = [
    {
        id: 'delete',
        icon: 'FrameEditor-icons/toolbar:icon-Delete',
        showType: showType.TOOLBAR,
        iconStyle: 'danger',
        tooltip: rk('Удалить'),
    }
];

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

    const selectorTemplate = {
        templateName: 'Controls-editors/_properties/LookupEditor/LookupEditorPopup',
        templateOptions: {
            source,
        },
        popupOptions: {
            width: 500,
            height: 500,
        },
    };
    const onSelectorCallback = (initialItems: List<Model<IItem>>, newItems: List<Model<IItem>>) => {
        const item = DATA.filter((item) => item.id === newItems.at(0).get('id'));
        props.item.item.set('name', item[0].id);
        items.current.setRawData(item);
        const resultItems: List<Model<IItem>> = newItems.clone();
        onChange({items});
        resultItems.clear();
        return resultItems;
    };

    const onValueChanged = useCallback((value) => {
        props.item.item.set('title', value);
    }, []);

    return (
        <div className="ws-flexbox ws-flex-column controls-padding_left-2xs">
            <Input
                className="controls-TreeEditor-Lookup"
                value={props.item.item.get('title')}
                searchParam="title"
                keyProperty="id"
                placeholder={rk('Введите название позиции')}
                multiSelect={false}
                commentVisibility="always"
                selectorTemplate={selectorTemplate}
                source={source}
                onValueChanged={onValueChanged}
                onSelectorCallback={onSelectorCallback}
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
        </div>
    );
}

function InnerContentTemplate(props): JSX.Element {
    let className = props.contentClassName || '';
    if (props.item?.isEditing()) {
        className += ' tw-w-full';
    }
    return (
        <div className={className}>
            <div className="tw-flex">
                {
                    props.allowHierarchy && props.markerVisibility === 'visible' ?
                        (
                            <SwitchCircleTemplate
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    props.onChange({...props.currentValue, selectedKeys: [props.item.item.get('id')]});
                                }}
                                className="controls-margin_left-2xs controls-margin_right-2xs"
                                selected={props.selectedKeys?.[0] === props.item.item.get('id')}
                            />
                        ) :
                        (props.allowHierarchy ? (
                            <CheckboxMarker
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const selectedKeys = props.selectedKeys || [];
                                    const index = selectedKeys.indexOf(props.item.item.get('id'));
                                    if (index !== -1) {
                                        delete selectedKeys[index];
                                    } else {
                                        selectedKeys.push(props.item.item.get('id'));
                                    }
                                    props.onChange({...props.currentValue, selectedKeys});
                                }}
                                viewMode='ghost'
                                value={props.selectedKeys?.includes(props.item.item.get('id'))}
                            />
                        ) : null)
                }
                <EditingTemplate
                    className="controls-margin_left-2xs"
                    value={props.item.item.get('title')}
                    {...props}
                    size="m"
                    editorTemplate={EditorTemplate}
                />
                <props.expanderTemplate/>
            </div>
        </div>
    );
}

function InnerTreeItemTemplate(props): JSX.Element {
    return (
        <ItemTemplate
            {...props}
            size="m"
            contentTemplate={<InnerContentTemplate {...props}/>}
            className={`controls-TreeEditor-itemTemplate ${props.className}`}/>
    );
}

function InnerGridItemTemplate(props): JSX.Element {
    return (
        <GridItemTemplate
            {...props}
            contentTemplate={<InnerContentTemplate {...props}/>}
            className={`controls-TreeEditor-itemTemplate ${props.className}`}/>
    );
}

function InnerColumnTemplate(props): JSX.Element {
    return (
        <ColumnTemplate
            {...props}
            contentTemplate={<InnerContentTemplate {...props}/>}
            className={'controls-TreeEditor-itemTemplate' +
                (props.item?.isEditing() ? ' tw-w-full ' : ' ') + props.className}/>
    );
}

function onFooterClickHandler(component): void {
    component.beginAdd({
        item: new Model({
            keyProperty: 'id',
            rawData: {id: Math.floor(Math.random() * 100), title: '', parent: null, node: false},
        }),
    });
}

const getConfig = (
    data: object[],
    allowHierarchy: boolean,
    expanderVisibility: string
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
                expanderVisibility,
                itemsDragNDrop: true,
                source: new HierarchicalMemory({
                    keyProperty: 'id',
                    data
                }),
            },
        },
    };
};

/**
 * Реакт компонент, редактор, позволяющий настроить данные в виде иерархического списка
 * @class Controls-editors/_properties/TreeEditor
 * @public
 */
export const TreeEditor = memo((props: ITreeEditorProps): JSX.Element => {
    const {
        type,
        onChange,
        LayoutComponent = Fragment,
        expanderVisibility,
        allowHierarchy,
        items,
        markerVisibility = 'hidden',
        value = {} as IValue
    } = props;
    const readOnly = type.isDisabled();
    const viewRef = useRef(null);
    const currentItem = useRef<IItemRef>({});
    const source = useMemo(() => {
        if (value.items) {
            if (currentItem.current.isDefaultValue ||
                JSON.stringify(value.items) !== JSON.stringify(currentItem.current.items)) {
                currentItem.current.isDefaultValue = false;
                currentItem.current.items = clone(value.items);
                currentItem.current.record = new RecordSet({
                    keyProperty: 'id',
                    rawData: [...currentItem.current.items]
                });
                currentItem.current.config = getConfig(currentItem.current.items,
                    allowHierarchy, expanderVisibility);
            }
        } else {
            currentItem.current.items = [...items];
            currentItem.current.isDefaultValue = true;
            currentItem.current.record = new RecordSet({
                keyProperty: 'id',
                rawData: [...currentItem.current.items]
            });
            currentItem.current.config = getConfig(currentItem.current.items,
                allowHierarchy, expanderVisibility);
        }
        return currentItem.current.record;
    }, [items, value.items]);

    const loadResults = useMemo(() => {
        return {
            treeEditorId: {
                displayProperty: 'title',
                parentProperty: 'parent',
                items: source,
                type: 'list'
            }
        };
    }, [source]);

    const onBeforeEndEdit = useCallback((model, willSave, isAdd) => {
        if (willSave) {
            const rawData = model.getRawData();
            const itemsData = [...currentItem.current.items];
            if (isAdd) {
                if (!rawData.title.length) {
                    viewRef.current.cancelEdit();
                    return Promise.resolve(false);
                } else {
                    itemsData.push(rawData);
                }
            } else {
                for (let i = 0; i < itemsData.length; i++) {
                    if (itemsData[i].id === rawData.id) {
                        itemsData[i] = rawData;
                        break;
                    }
                }
                onChange({...value, items: itemsData});
            }
        }
    }, [value]);

    const onAfterEndEdit = useCallback(() => {
        onChange({...value, items: [...currentItem.current.items]});
    }, [value]);

    const onActionClick = useCallback((action: IItemAction, item: Model) => {
        if (action.id === 'delete') {
            let itemsData = currentItem.current.items;
            itemsData = itemsData.filter((elem) => {
                return elem.parent !== item.get('id') && elem.id !== item.get('id');
            });
            onChange({...value, items: [...itemsData]});
        }
    }, [value]);

    const itemActionVisibilityCallback = useCallback((itemAction: IItemAction, item: Model) => {
        return !!item.get('title');
    }, []);

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
                    item.node = itemsData.some((elem) => elem.parent === item.id);
                });
                onChange({...value, items: itemsData});
                treeComponent.reload();
            });
        },
        [value]
    );

    const onDeactivated = () => {
        viewRef.current.commitEdit();
    };
    const contentClassName = 'controls-TreeEditor-contentTemplate ws-flexbox';
    const listOptions = {
        className: 'controls-TreeEditor',
        ref: viewRef,
        editingConfig: {
            editOnClick: true
        },
        parentProperty: 'parent',
        nodeProperty: allowHierarchy ? 'node' : null,
        keyProperty: 'id',
        itemTemplate: allowHierarchy ? InnerTreeItemTemplate : InnerGridItemTemplate,
        readOnly,
        rowSeparatorSize: 's',
        itemActions,
        itemActionVisibilityCallback,
        itemActionsPosition: 'outside',
        multiSelectVisibility: 'hidden',
        markerVisibility: 'hidden',
        expanderIcon: 'hiddenNode',
        expanderPosition: 'right',
        hasChildrenProperty: 'node',
        itemPadding: {top: 'S', bottom: 'S', left: 'null'},
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
        columns: [
            {
                displayProperty: 'title',
                cellPadding: {right: 'null', left: 'null'},
                template: InnerColumnTemplate,
                templateOptions: {
                    onChange,
                    contentClassName,

                    selectedKeys: props.value?.selectedKeys,
                    currentValue: value,
                    allowHierarchy,
                    markerVisibility
                }
            }
        ],
        footerTemplate: useContent(() => {
            return <Button
                icon="icon-Add"
                iconStyle="unaccented"
                iconSize="s"
                fontColorStyle="unaccented"
                caption={rk('Добавить вариант')}
                underlineVisible={false}
                viewMode="link"
                className="controls-margin_top-s"
                onClick={() => onFooterClickHandler(viewRef.current)}
            />;
        }),
        storeId: 'treeEditorId',
        customEvents: ['onBeforeEndEdit', 'onAfterEndEdit', 'onActionClick', 'onCustomdragEnd', 'onDeactivated'],
    };

    return (
        <LayoutComponent>
            <Provider loadResults={loadResults}
                      configs={currentItem.current.config}>
                {
                    (allowHierarchy) ? (
                        <View {...listOptions}/>
                    ) : (
                        <GridView {...listOptions}/>
                    )
                }
            </Provider>
        </LayoutComponent>
    );
});
