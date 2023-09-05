import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { HierarchicalMemory, Memory } from 'Types/source';
import { View } from 'Controls/treeGrid';
import { View as GridView } from 'Controls/grid';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { EditingTemplate } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { Model } from 'Types/entity';
import { Input, Collection } from 'Controls/lookup';
import { ItemTemplate } from 'Controls/treeGrid';
import { ItemTemplate as GridItemTemplate, ColumnTemplate } from 'Controls/grid';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { ItemsEntity } from 'Controls/dragnDrop';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import { RecordSet, List } from 'Types/collection';
import { Provider } from 'Controls-DataEnv/context';
import * as rk from 'i18n!Controls-editors';
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

interface ITreeEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
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
    },
    {
        id: 'move',
        icon: 'icon-dragHandle',
        showType: showType.TOOLBAR,
        iconStyle: 'unaccented',
    },
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
            <EditingTemplate
                value={props.item.item.get('title')}
                {...props}
                size="m"
                editorTemplate={EditorTemplate}
            />
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
    markerVisibility: string,
    expanderVisibility: string,
    selectedKeys: string[]
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
                markerVisibility,
                expanderVisibility,
                selectedKeys,
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
        multiSelectVisibility,
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
                currentItem.current.items = [...value.items];
                currentItem.current.record = new RecordSet({
                    keyProperty: 'id',
                    rawData: [...value.items]
                });
                currentItem.current.config = getConfig(currentItem.current.items,
                    allowHierarchy, markerVisibility, expanderVisibility,
                    props.value?.selectedKeys);
            }
        } else {
            currentItem.current.items = [...items];
            currentItem.current.isDefaultValue = true;
            currentItem.current.record = new RecordSet({
                keyProperty: 'id',
                rawData: [...currentItem.current.items]
            });
            currentItem.current.config = getConfig(currentItem.current.items,
                allowHierarchy, markerVisibility, expanderVisibility,
                props.value?.selectedKeys);
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
                    return;
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
            currentItem.current.items = itemsData;
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

    const onCustomDragEnd = useCallback(
        (entity: ItemsEntity, target: Model, position: LOCAL_MOVE_POSITION) => {
            const selection = {
                selected: entity.getItems(),
                excluded: [],
            };
            viewRef.current.moveItems(selection, target.getKey(), position).then(() => {
                const treeComponent = viewRef.current;
                const itemsData = [...currentItem.current.items];
                itemsData.forEach((item) => {
                    item.node = itemsData.some((elem) => elem.parent === item.id);
                });
                onChange({...value, items: [...itemsData]});
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
        onSelectedKeysChanged: (selectedKeys: string[]) => {
            onChange({items: currentItem.current.items, selectedKeys});
        },
        onMarkedKeyChanged: (markedKey: string) => {
            if (markerVisibility === 'visible' && value.selectedKeys?.[0] !== markedKey) {
                onChange({items: currentItem.current.items, selectedKeys: [markedKey]});
            }
        },
        parentProperty: 'parent',
        nodeProperty: allowHierarchy ? 'node' : null,
        keyProperty: 'id',
        itemTemplate: allowHierarchy ? InnerTreeItemTemplate : InnerGridItemTemplate,
        readOnly,
        rowSeparatorSize: 's',
        //rowSeparatorVisibility: 'all',
        itemActions,
        itemActionVisibilityCallback,
        multiSelectVisibility,
        //multiSelectTemplate: InnerMultiSelectTemplate,
        markerVisibility,
        expanderIcon: 'hiddenNode',
        expanderPosition: 'right',
        hasChildrenProperty: 'node',
        itemPadding: {top: 'S', bottom: 'S'},
        expanderVisibility,
        itemsDragNDrop: true,
        onBeforeEndEdit,
        onAfterEndEdit,
        onCustomDragEnd,
        onActionClick,
        onDeactivated,
        itemTemplateOptions: {
            contentClassName,
        },
        columns: [
            {
                displayProperty: 'title',
                template: InnerColumnTemplate,
                templateOptions: {
                    onChange,
                    contentClassName,
                }
            }
        ],
        storeId: 'treeEditorId',
        selectedKeys: props.value?.selectedKeys,
        customEvents: ['onBeforeEndEdit', 'onAfterEndEdit', 'onActionClick', 'onCustomDragEnd', 'onSelectedKeysChanged',
            'onDeactivated', 'onMarkedKeyChanged'],
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
            <Button
                icon="icon-Add"
                iconStyle="unaccented"
                iconSize="s"
                fontColorStyle="unaccented"
                caption={rk('Добавить вариант')}
                underlineVisible={false}
                viewMode="link"
                className="controls-margin_top-s"
                onClick={() => onFooterClickHandler(viewRef.current)}
            />
        </LayoutComponent>
    );
});
