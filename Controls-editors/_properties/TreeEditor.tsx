import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { HierarchicalMemory, Memory } from 'Types/source';
import { View } from 'Controls/tree';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { useContent } from 'UICore/Jsx';
import { FooterTemplate, EditingTemplate, MultiSelectTemplate } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { Model } from 'Types/entity';
import { Input, Collection } from 'Controls/lookup';
import { ItemTemplate } from 'Controls/tree';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { ItemsEntity } from 'Controls/dragnDrop';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import { RecordSet, List } from 'Types/collection';
import * as rk from 'i18n!Controls';
import 'css!Controls-editors/_properties/TreeEditor';

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
    title: string;
    parent: number;
    node: true | false | null;
}

interface ITreeEditorProps<T> extends IPropertyEditorProps<T | undefined> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    multiSelectVisibility: 'visible' | 'onhover' | 'hidden';
    expanderVisibility: string;
    allowHierarchy: boolean;
    items: RecordSet<IItem>;
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

function InnerItemTemplate(props): JSX.Element {
    const contentTemplate = (
        <div className="controls-TreeEditor-contentTemplate">
            <EditingTemplate
                value={props.item.item.get('title')}
                {...props}
                editorTemplate={EditorTemplate}
            />
        </div>
    );
    return (
        <ItemTemplate
            {...props}
            contentTemplate={contentTemplate}
            className="controls-TreeEditor-itemTemplate"
        />
    );
}

function FooterContent(): JSX.Element {
    return (
        <Button
            icon="icon-Add"
            iconStyle="unaccented"
            iconSize="s"
            fontColorStyle="unaccented"
            caption={rk('Добавить вариант')}
            underlineVisible={false}
            viewMode="link"
        />
    );
}

function InnerMultiSelectTemplate(props): JSX.Element {
    return (
        <MultiSelectTemplate
            {...props}
            className="controls-padding_top-3xs"
            contrastBackground={true}
        />
    );
}

function onFooterClickHandler(component): void {
    component.beginAdd({
        item: new Model({
            keyProperty: 'id',
            rawData: { id: Math.floor(Math.random() * 100), title: '', parent: null, node: false },
        }),
    });
}

/**
 * Реакт компонент, редактор, позволяющий настроить данные в виде иерархического списка
 * @class Controls-editors/_properties/TreeEditor
 * @public
 */
export const TreeEditor = memo(<T extends any>(props: ITreeEditorProps<T>): JSX.Element => {
    const {
        type,
        onChange,
        LayoutComponent = Fragment,
        multiSelectVisibility,
        expanderVisibility,
        allowHierarchy,
        items,
    } = props;
    const readOnly = type.isDisabled();
    const viewRef = useRef(null);
    const source = useMemo(() => {
        return new HierarchicalMemory({
            keyProperty: 'id',
            data: items.getRawData(),
        });
    }, [items, items.getRawData()]);

    const footerTemplate = useContent(
        (outerProps: object) => (
            <div
                onClick={() => onFooterClickHandler(viewRef.current)}
                className="controls-margin_top-s"
            >
                <FooterTemplate {...outerProps} content={FooterContent} />
            </div>
        ),
        []
    );

    const onAfterEndEdit = useCallback(() => {
        const itemsData = viewRef.current.getItems().getRawData();
        items.setRawData(itemsData);
        const newItems = new RecordSet({
            keyProperty: 'id',
            rawData: itemsData,
        });
        onChange(newItems);
    }, []);

    const onActionClick = useCallback((action: IItemAction, item: Model) => {
        if (action.id === 'delete') {
            let itemsData = items.getRawData();
            itemsData = itemsData.filter((elem) => elem.id !== item.get('id'));
            items.setRawData(itemsData);
            const newItems = new RecordSet({
                keyProperty: 'id',
                rawData: itemsData,
            });
            onChange(newItems);
        }
    }, []);

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
                const itemsData = treeComponent.getItems().getRawData();
                itemsData.forEach((item) => {
                    item.node = itemsData.some((elem) => elem.parent === item.id);
                });
                items.setRawData(itemsData);
                const newItems = new RecordSet({
                    keyProperty: 'id',
                    rawData: itemsData,
                });
                onChange(newItems);
                treeComponent.reload();
            });
        },
        []
    );

    return (
        <LayoutComponent>
            <View
                className="controls-TreeEditor"
                source={source}
                ref={viewRef}
                parentProperty="parent"
                nodeProperty={allowHierarchy ? 'node' : null}
                keyProperty="id"
                footerTemplate={footerTemplate}
                itemTemplate={InnerItemTemplate}
                readOnly={readOnly}
                rowSeparatorSize="s"
                rowSeparatorVisibility="items"
                itemActions={itemActions}
                itemActionVisibilityCallback={itemActionVisibilityCallback}
                multiSelectVisibility={multiSelectVisibility}
                multiSelectTemplate={InnerMultiSelectTemplate}
                markerVisibility="hidden"
                expanderIcon="hiddenNode"
                expanderPosition="right"
                hasChildrenProperty="node"
                itemPadding={{ top: 'S', bottom: 'S' }}
                expanderVisibility={expanderVisibility}
                itemsDragNDrop={true}
                onAfterEndEdit={onAfterEndEdit}
                onCustomDragEnd={onCustomDragEnd}
                onActionClick={onActionClick}
                customEvents={['onAfterEndEdit', 'onActionClick', 'onCustomDragEnd']}
            />
        </LayoutComponent>
    );
});
