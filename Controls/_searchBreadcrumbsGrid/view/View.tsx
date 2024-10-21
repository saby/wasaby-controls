/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { TreeItem } from 'Controls/baseTree';
import { TSearchNavigationMode } from 'Controls/interface';
import { usePreviousProps } from 'Controls/Utils/Hooks/usePreviousProps';
import { GridRow, IRowComponentProps } from 'Controls/grid';
import { CollectionItemContext, getKey, TItemEventHandler } from 'Controls/baseList';
import { ReactTreeGridView, getRowComponent as getTreeGridRowComponent } from 'Controls/treeGrid';
import { ISearchBreadcrumbsTreeGridViewProps } from 'Controls/_searchBreadcrumbsGrid/view/interface';
import {
    default as SearchBreadcrumbsGridRowComponent,
    getCleanCellComponent,
    getCompatibleCellComponent,
    getDirtyCellComponentContentRender,
} from 'Controls/_searchBreadcrumbsGrid/row/RowComponent';
import SearchGridCollection from 'Controls/_searchBreadcrumbsGrid/display/SearchGridCollection';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';

/*
 * Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд )
 */
function getRowComponent(
    item: GridRow,
    props: ISearchBreadcrumbsTreeGridViewProps,
    rowProps: IRowComponentProps
): React.ReactElement {
    let row;
    // Строка хлебной крошки обёрнута в компонент,
    // чтобы корректно передать шаблон ячейки searchBreadCrumbsItemTemplate.
    if (
        item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]'] ||
        item['[Controls/_display/SearchSeparator]']
    ) {
        row = (
            <SearchBreadcrumbsGridRowComponent
                {...rowProps}
                onSearchBreadcrumbsClick={props.onSearchBreadcrumbsClick}
                beforeItemContentRender={props.beforeItemContentRender}
                searchBreadCrumbsItemTemplate={props.searchBreadCrumbsItemTemplate}
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
            />
        );
    }
    return row ? (
        <CollectionItemContext.Provider value={item} key={item.key}>
            {row}
        </CollectionItemContext.Provider>
    ) : (
        getTreeGridRowComponent(item, props, {
            ...rowProps,
            _$getCompatibleCellComponent:
                rowProps._$getCompatibleCellComponent ?? getCompatibleCellComponent,
            _$getCleanCellComponent: rowProps._$getCleanCellComponent ?? getCleanCellComponent,
            _$getDirtyCellComponentContentRender:
                rowProps._$getDirtyCellComponentContentRender ?? getDirtyCellComponentContentRender,
        })
    );
}

// Возвращает true, если событие остановлено при взаимодействии с разделителем записей из корня
function isEventStoppedOnSeparator(event: MouseEvent<HTMLDivElement>, item: TreeItem): boolean {
    if (item['[Controls/_display/SearchSeparator]']) {
        event.stopPropagation();
        return true;
    }
    return false;
}

// Возвращает true, если событие остановлено при взаимодействии с крошками в режиме readOnly
function isEventStoppedOnReadOnly(
    event: MouseEvent<HTMLDivElement>,
    item: BreadcrumbsItemRow<Model[]>,
    searchNavigationMode: TSearchNavigationMode
): boolean {
    if (
        item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]'] &&
        searchNavigationMode === 'readonly'
    ) {
        event.stopPropagation();
        return true;
    }
    return false;
}

// Возвращает true, если событие остановлено при клике на чекбокс
function isClickedOnCheckbox(
    event: MouseEvent<HTMLDivElement>,
    item: BreadcrumbsItemRow<Model[]>,
    onCheckboxClickCallback: TItemEventHandler
) {
    if (event.target.closest('.js-controls-ListView__checkbox')) {
        onCheckboxClickCallback(event, item.contents);
        return true;
    }
    return false;
}

// Возвращает true, если событие остановлено при клике на хлебную крошку
function isClickedOnBreadCrumb(
    event: MouseEvent<HTMLDivElement>,
    item: BreadcrumbsItemRow<Model[]>,
    onClickCallback: TItemEventHandler
): boolean {
    if (item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]']) {
        const recordItem = item.contents[item.contents.length - 1];
        if (recordItem && onClickCallback) {
            // Хлебная крошка всегда занимает одну ячейку
            onClickCallback(event, recordItem);
        }
        event.stopPropagation();
        return true;
    }
    return false;
}

// Дополняет обработчики взаимодействия с записью логикой для breadCrumbs
function patchItemEventHandlers({
    itemHandlers,
    searchNavigationMode,
    collection,
}: {
    collection: ISearchBreadcrumbsTreeGridViewProps['collection'];
    itemHandlers: ISearchBreadcrumbsTreeGridViewProps['itemHandlers'];
    searchNavigationMode?: TSearchNavigationMode;
}): ISearchBreadcrumbsTreeGridViewProps['itemHandlers'] {
    const getCollectionItem = (item: Model | BreadcrumbsItemRow[]): BreadcrumbsItemRow => {
        return collection.getItemBySourceKey(getKey(item), false);
    };
    return {
        ...itemHandlers,
        onClickCallback(event, item) {
            const collectionItem = getCollectionItem(item);
            if (
                isClickedOnCheckbox(event, collectionItem, itemHandlers.onClickCallback) ||
                isEventStoppedOnReadOnly(event, collectionItem, searchNavigationMode) ||
                isEventStoppedOnSeparator(event, collectionItem) ||
                isClickedOnBreadCrumb(event, collectionItem, itemHandlers.onClickCallback)
            ) {
                return;
            }

            // Событие клика по узлу в режиме поиска должно возвращать false,
            // _notifyItemActivate запускаться не должен.
            // TODO Возможно, это придётся сестить в TreeGridControl
            if (collectionItem.isNode() === true) {
                return false;
            }

            if (itemHandlers.onClickCallback) {
                itemHandlers.onClickCallback(event, item);
            }
        },
        onMouseDown(event, item) {
            const collectionItem = getCollectionItem(item);
            if (isEventStoppedOnSeparator(event, collectionItem)) {
                return;
            }
            if (itemHandlers.onMouseDown) {
                itemHandlers.onMouseDown(event, item);
            }
        },
        onMouseUp(event, item) {
            const collectionItem = getCollectionItem(item);
            if (isEventStoppedOnSeparator(event, collectionItem)) {
                return;
            }
            if (itemHandlers.onMouseDown) {
                itemHandlers.onMouseDown(event, item);
            }
        },
    };
}

// Возвращает true, если хлебная крошка должна занимать все колонки
function getColspanBreadcrumbs({
    breadCrumbsMode,
    columnScroll,
    isColumnScrollVisible,
}: {
    breadCrumbsMode: ISearchBreadcrumbsTreeGridViewProps['breadCrumbsMode'];
    columnScroll: ISearchBreadcrumbsTreeGridViewProps['columnScroll'];
    isColumnScrollVisible: ISearchBreadcrumbsTreeGridViewProps['isColumnScrollVisible'];
}) {
    let colspan = breadCrumbsMode === 'row';
    // Если сказано что нужно колспанить строку с крошками и виден скрол колонок
    // то нужно принудительно сбросить колспан иначе содержимое строки с хлебными
    // крошками будет скролиться вместе с колонками
    if (colspan && columnScroll && isColumnScrollVisible) {
        colspan = false;
    }
    return colspan;
}

/**
 * Рендер результатов поиска
 * @param props
 * @constructor
 */
export function ReactSearchBreadcrumbsTreeGridView(
    props: ISearchBreadcrumbsTreeGridViewProps
): React.ReactElement {
    const { breadCrumbsMode, containerWidth } = props;
    const collection = props.collection as unknown as SearchGridCollection;
    const colspanBreadCrumbs = getColspanBreadcrumbs({
        breadCrumbsMode,
        columnScroll: props.columnScroll,
        isColumnScrollVisible: props.isColumnScrollVisible,
    });

    // Обработчики по умолчанию
    const itemHandlers = React.useMemo(() => {
        return patchItemEventHandlers({
            itemHandlers: props.itemHandlers,
            searchNavigationMode: props.searchNavigationMode,
            collection: props.collection,
        });
    }, [props.itemHandlers, props.searchNavigationMode, props.collection]);

    // Обработка клика в компоненте PathWrapper
    const onSearchBreadcrumbsClick = React.useCallback(
        (event: Event, item: Model) => {
            if (props.searchNavigationMode === 'readonly') {
                event.stopPropagation();
                return;
            }
            // Обработка должна быть через оригинальный клик, т.к. мы не сможем найти запись коллекции
            // по итему хлебной крошки.
            if (props.itemHandlers.onClickCallback) {
                props.itemHandlers.onClickCallback(event, item);
            }
        },
        [props.itemHandlers]
    );

    // mount
    // props.isColumnScrollVisible это опция из контекста скролла колонок,
    // которая в список прилетает из слоя совместимости WasabyGridContextCompatibilityConsumer.
    // Завязываться на initialBreadCrumbsMode explorer не имеет смысла, т.к. на уровне
    // explorer нет этого контекста, и explorer не знает, есть реально кролл или нет.
    collection.setColspanBreadcrumbs(colspanBreadCrumbs);

    // Раньше это происходило при маунте коллекции,
    // теперь мы находимся ниже уровня её инициализации
    collection.setOnBreadcrumbItemClickCallback(onSearchBreadcrumbsClick);

    // update
    React.useEffect(() => {
        collection.setColspanBreadcrumbs(colspanBreadCrumbs);
        collection.setBreadCrumbsMode(breadCrumbsMode);
        collection.setContainerWidth(containerWidth);
    }, [collection, breadCrumbsMode, containerWidth, colspanBreadCrumbs]);

    return (
        <ReactTreeGridView
            {...props}
            itemHandlers={itemHandlers}
            _$FunctionalRowComponent={SearchBreadcrumbsGridRowComponent}
            _$getRowComponent={getRowComponent}
        />
    );
}
