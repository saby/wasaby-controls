/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Файл содержит компонент View, который является корневым для отображения грида,
 * а также вспомогательные функции, необходимые этому компоненту
 */
import * as React from 'react';
import {
    CollectionItemContext,
    CollectionTriggerComponent,
    IItemEventHandlers,
    TriggerComponent,
} from 'Controls/baseList';
import type { GridRow } from 'Controls/grid';
import { FocusRoot } from 'UI/Focus';
import { IndicatorComponent, TrackedPropertiesComponentWrapper } from 'Controls/listVisualAspects';

import { default as DefaultRowComponent } from 'Controls/_grid/gridReact/row/RowComponent';
import EditRowWrapper from 'Controls/_grid/gridReact/row/EditRowWrapper';
import { getHeaderElements } from 'Controls/_grid/gridReact/header/Header';
import { getResults } from 'Controls/_grid/gridReact/results/Results';
import { getFooter } from 'Controls/_grid/gridReact/footer/Footer';
import { IGridViewProps } from 'Controls/_grid/gridReact/view/interface';
import { IListData, ListDataContext } from 'Controls/_grid/gridReact/hooks/useListData';
import { getEmptyView } from 'Controls/_grid/gridReact/emptyView/EmptyView';

import 'css!Controls/grid';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import { getRowComponentMasterStyleProps } from 'Controls/_grid/compatibleLayer/utils/masterDecorationStyleUtils';
import { default as GroupCellComponent } from 'Controls/_grid/dirtyRender/group/GroupCellComponent';
import { itemPropsAreEqual } from 'Controls/_grid/utils/itemPropsAreEqual';
import { isGroupRow, isNodeFooterRow, isSpaceRow } from 'Controls/_grid/compatibleLayer/utils/Type';
import getColgroup from 'Controls/_grid/gridReact/IE/getColgroup';
import { detection } from 'Env/Env';

// Проверка для идентификации старого браузера. Одного флага isIE недостаточно, так как в реестрах с 1с
// используется старый 1с-овский браузер, который эту проверку не проходит. Там можно завязаться только на флаг
// isNotFullGridSupport, но сафари на десктопе эту проверку тоже пройдёт, поэтому нужно исключить сафари.
const isOldBrowser = detection.isIE || (detection.isNotFullGridSupport && !detection.safari);

function shouldStretchEmptyTemplate({
    needShowEmptyTemplate,
    emptyTemplateOptions,
}: IGridViewProps): boolean {
    return !!(needShowEmptyTemplate && emptyTemplateOptions?.height !== 'auto');
}

// Фукция, расчитывающая стиль, определяющий фиксированное число строк
// для корректного растягивания в высоту пустого представления таблицы.
function getGridEmptyTemplateRows({
    collection,
    beforeItemsContent,
}: IGridViewProps): React.CSSProperties {
    const gridTemplateRows = [];
    const hasHeader = !!collection.getHeader();
    const hasResults = !!collection.getResults();
    const resultsPosition = collection.getResultsPosition();

    if (collection.isTrackedValuesVisible()) {
        gridTemplateRows.push('auto');
    }

    // Пустое представление таблицы растягивается на 100% по высоте
    // В результате, каждая из существующих строк таблицы:
    // (Заголовок, результаты, полоса скролла, строка с ширинами колонок для скролла,
    // сам контент пустого представления и футер) занимают одинаковое место по вертикали.
    // Правки ниже добавляют для пустого представления жёстко заданную сетку строк,
    // определяя, что строки заголовок, результаты, полоса скролла, строка с ширинами колонок для скролла и футер
    // занимают по высоте ровно столько, сколько есть в их контенте,
    // а строка контента пустого представления растягивается максимально,
    // заполняя собой всё пространство между результатами и футером.
    if (hasHeader) {
        gridTemplateRows.push('auto');
    }
    if (hasResults && resultsPosition === 'top') {
        gridTemplateRows.push('auto');
    }

    // TODO не понятно, как тут делать, чтобы не затягивать знание о columnScroll
    if (beforeItemsContent && (collection.hasColumnScroll() || collection.hasColumnScrollReact())) {
        gridTemplateRows.push('auto', 'auto', 'auto');
    }

    // Сама строка пустого представления должна максимально растягиваться
    gridTemplateRows.push('1fr');

    return {
        gridTemplateRows: gridTemplateRows.join(' '),
    };
}

/*
 * Функция, необходимая для рассчета стилей, указываемых в аттребуте style у списка
 */
function getStyles(props: IGridViewProps): React.CSSProperties {
    let style: React.CSSProperties = {};

    if (props.cCountStart) {
        style.gridTemplateColumns = props.collection
            .getColumnWidths()
            .slice(0, props.cCountStart)
            .join(' ');
    } else if (props.cCountEnd) {
        const widths = props.collection.getColumnWidths();
        style.gridTemplateColumns = widths.slice(widths.length - props.cCountEnd).join(' ');
    } else {
        style.gridTemplateColumns = props.collection.getColumnWidths().join(' ');
    }

    // В случае отображения пустого представления надо растянуть ячейку
    // с пустым представлением на всю высоту таблицы.
    // Это можно сделать при помощи grid-template-rows.
    if (shouldStretchEmptyTemplate(props)) {
        style = {
            ...style,
            ...getGridEmptyTemplateRows(props),
        };
    }

    return style;
}

/*
 * Функция, для рассчета классов, навешиваемых на верхний div списка
 */
function getClassName(props: IGridViewProps): string {
    let className = `tw-grid controls-Grid controls-Grid_${props.style}`;
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (props.needShowEmptyTemplate) {
        className += ' tw-h-full';
    }
    // Для группировки в виде блоков добавляем класс, от которого строятся каскады.
    if (props.groupViewMode === 'blocks' || props.groupViewMode === 'titledBlocks') {
        className += ` controls-List__groupViewMode_${props.groupViewMode}`;
    }
    // Во время днд отключаем лесенку, От этого класса строятся каскады.
    if (props.collection?.isDragging()) {
        className += ' controls-Grid_dragging_process';
    }
    // Если нужно отобразить пустое представление, растягиваем grid на всю высоту
    if (shouldStretchEmptyTemplate(props)) {
        className += ' tw-h-full';
    }
    if (isOldBrowser) {
        className += ' controls-GridReact-IE-grid';
    }
    return className;
}

/*
 * Функция, для рассчета классов, передаваемых компоненту ряда
 */
function getRowClassName(item: GridRow): string {
    let className = '';
    if (item.isEditing()) {
        className += ' controls-List_DragNDrop__notDraggable js-controls-DragScroll__notDraggable';
        className += ' js-controls-ListView__item_editing';
    }
    return className;
}

/*
 * Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд )
 */
export function getRowComponent(
    item: GridRow,
    props: IGridViewProps,
    rowProps: IRowComponentProps
) {
    const {
        itemHandlers,
        onValidateCreated,
        onValidateDestroyed,
        itemTemplate,
        itemTemplateOptions = {},
        groupTemplate,
    } = props;
    const rowGroupProperty = item.getOwner().getGroupProperty();
    const RowComponent = props._$FunctionalRowComponent || DefaultRowComponent;
    let row;

    if (isGroupRow(item)) {
        // Простая не иерархическая группировка НИКОГДА не рендерится через прикладной шаблон ItemTemplate.
        // groupTemplate - шаблон ячейки, он всегда рендерится в платформенном RowComponent.
        // groupRender - шаблон текста заголовка группы : ----groupRender----
        row = (
            <RowComponent
                {...rowProps}
                data-qa={'group'}
                groupTemplate={groupTemplate}
                groupTemplateOptions={props.groupTemplateOptions}
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
                contentRender={props.groupRender}
                _$FunctionalCellComponent={GroupCellComponent}
            />
        );
    } else {
        // Тут рендерится ИЛИ прикладной шаблон ItemTemplate ИЛИ платформенный шаблон RowComponent
        const isValidForItemTemplate = !isSpaceRow(item) && !isNodeFooterRow(item);
        if (itemTemplate && isValidForItemTemplate) {
            row = templateLoader(itemTemplate, {
                item,
                itemData: item,
                rowProps,
                cCountStart: props.cCountStart,
                cCountEnd: props.cCountEnd,
                _$FunctionalCellComponent: props._$FunctionalCellComponent,
                groupProperty: rowGroupProperty,
                ...itemTemplateOptions,
            });
        } else {
            row = (
                <RowComponent
                    {...rowProps}
                    _$FunctionalCellComponent={props._$FunctionalCellComponent}
                    cCountStart={props.cCountStart}
                    cCountEnd={props.cCountEnd}
                    groupProperty={rowGroupProperty}
                />
            );
        }
    }

    if (item.isEditing()) {
        row = (
            <EditRowWrapper
                item={item.contents}
                handlers={itemHandlers}
                onValidateCreated={onValidateCreated}
                onValidateDestroyed={onValidateDestroyed}
            >
                {row}
            </EditRowWrapper>
        );
    }

    return <CollectionItemContext.Provider value={item}>{row}</CollectionItemContext.Provider>;
}

interface RowWrapperProps {
    item: GridRow;
    gridViewProps: IGridViewProps;
    rowProps: IRowComponentProps;
}

/*
 * Компонент-обертка, который внутри себя получает компонент ряда и возвращает его
 * Используется внутри rowIterator, необходим для мемоизации каждого ряда с сравнением пропсов
 */
const MemoizedRowComponent = React.memo(function MemoizedRowComponent(props: RowWrapperProps) {
    const _getRowComponent = React.useCallback(
        props.gridViewProps._$getRowComponent ?? getRowComponent,
        [props.gridViewProps._$getRowComponent]
    );
    return _getRowComponent(props.item, props.gridViewProps, props.rowProps);
}, RowWrapperPropsAreEqual);

function RowWrapperPropsAreEqual(prevProps: RowWrapperProps, nextProps: RowWrapperProps) {
    return (
        prevProps.gridViewProps.itemTemplate === nextProps.gridViewProps.itemTemplate &&
        itemPropsAreEqual(prevProps.rowProps, nextProps.rowProps)
    );
}

/*
 * Патч обработчиков события свайпа и логтапа для вложенных списков.
 * Надо стопать событие, иначе во вложенных списках
 * при лонгтапе и свайпе на внутреннем списке будет срабатывать обработчик на внешнем.
 */
function patchItemEventHandlers(props: IGridViewProps): IItemEventHandlers {
    const hasItemActions = !!props.itemActions || !!props.itemActionsProperty;
    const hasEditArrow = props.showEditArrow;
    const hasContextMenu = props.contextMenuVisibility !== false;

    function stopTouchEventForLongTap(event: React.SyntheticEvent): void {
        if (hasItemActions && hasContextMenu) {
            event.stopPropagation();
        }
    }

    function stopTouchEventForSwipe(event: React.SyntheticEvent): void {
        if (hasItemActions || hasEditArrow) {
            event.stopPropagation();
        }
    }

    return {
        ...props.itemHandlers,
        /**
         * позволяет в шаблоне элемента стопать и обрабатывать свайп только тогда, когда есть ItemActions
         * @private
         */
        onItemTouchMoveCallback: stopTouchEventForSwipe,
        onTouchStart: stopTouchEventForLongTap,
        onTouchEnd: stopTouchEventForLongTap,
    };
}

/*
 * Функция, формирующая контейнер с элементами списка
 */
function getItemsContainer(
    props: IGridViewProps,
    ref: React.MutableRefObject<HTMLDivElement>
): React.ReactElement {
    const { collection, needShowEmptyTemplate } = props;
    const itemHandlers = patchItemEventHandlers(props);
    if (needShowEmptyTemplate) {
        return null;
    }

    const rows: React.ReactElement[] = [];

    const viewIterator = collection.getViewIterator();
    viewIterator.each((item: GridRow, index) => {
        let rowProps = item.getRowComponentProps(itemHandlers, props.actionHandlers);
        // todo: опции groupTemplateOptions никогда не было.
        // Но, за счёт wml создавались reactiveProps, которые заполнялись зависимыми значениями.
        // Поэтому работала перерисовка. Сделал по блокеру, т.к. платформа счетов не сможет использовать другой
        // вариант до перехода на react, который свершится в 2024-25 году.
        // https://online.sbis.ru/opendoc.html?guid=8476007d-2942-4a5f-83b1-2e36a85965b2&client=3
        rowProps.groupTemplateOptions = props.groupTemplateOptions;
        rowProps.innerFocusElement = props.innerFocusElement;
        rowProps.pixelRatioBugFix = props.pixelRatioBugFix;
        rowProps.subPixelArtifactFix = props.subPixelArtifactFix;
        rowProps.actionsClassName = rowProps.actionsClassName
            ? rowProps.actionsClassName + ` ${props.itemActionsClass}`
            : props.itemActionsClass;
        rowProps.groupViewMode = props.groupViewMode;
        rowProps.compatibleMultiSelectTemplate = templateLoader(props.multiSelectTemplate, {
            item,
        });
        rowProps.className =
            (rowProps.className || '') +
            (viewIterator.isItemAtIndexHidden(index) ? 'ws-hidden' : '') +
            getRowClassName(item);
        rowProps.decorationStyle = props.style;

        // TODO Для группы не надо ставить padding для master, они там свои.
        //  Надо придумать, как собрать в одном месте для группы эту размазанную логику.
        if (props.style === 'master' && !item['[Controls/_display/grid/GroupRow]']) {
            rowProps = getRowComponentMasterStyleProps(rowProps, props);
        }

        const row = (
            <MemoizedRowComponent
                item={item}
                gridViewProps={props}
                rowProps={rowProps}
                key={item.key}
            />
        );
        rows.push(row);
    });

    const isGridEditing = collection.isEditing();
    const itemActionsVisibility = isGridEditing ? 'hidden' : props.itemActionsVisibility;

    let itemsContainerClass =
        'tw-contents controls-Grid__itemsContainer' +
        ` controls-BaseControl_showActions_${itemActionsVisibility}`;
    if (props.itemsContainerClass) {
        itemsContainerClass += ` ${props.itemsContainerClass}`;
    }

    return (
        <div ref={ref} className={itemsContainerClass} data-qa="items-container">
            {rows}
        </div>
    );
}

/*
 * Компонент списка
 */

const ReactGridViewRef = React.forwardRef(function ReactGridView(
    props: IGridViewProps,
    forwardRef: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { collection } = props;
    const itemsContainerRef = React.useRef<HTMLDivElement>();
    // const notifiedParamsRef = React.useRef<unknown[]>();

    React.useLayoutEffect(() => {
        // // Без проверки на то, что параметры отличаются, мы получаем двойное срабатывание itemsContainerReadyCallback на маунте:
        // // Перед первым маунтом itemsContainerRef еще не содержит значения (в зависимостях null)
        // // на useLayoutEffect уже маунт произошел и значение верное -- ссылка на элемент
        // // и следом второй раз - в зависимостях ссылка и это повод для срабатывания useLayoutEffect.
        // const deps = [
        //     collection,
        //     props.itemsContainerReadyCallback,
        //     props.needShowEmptyTemplate,
        //     itemsContainerRef?.current,
        // ];
        // const needNotify = deps.some((e, i) => e !== notifiedParamsRef.current?.[i]);
        // if (needNotify) {
        props.itemsContainerReadyCallback?.(() => itemsContainerRef.current);
        // notifiedParamsRef.current = deps;
        // }
    }, [
        collection,
        props.itemsContainerReadyCallback,
        props.needShowEmptyTemplate,
        itemsContainerRef?.current,
    ]);

    // TODO при переписывании BaseControl - удалить и утащить эту логику в BaseControl
    React.useLayoutEffect(() => {
        return props.viewResized?.();
    }, [props.collectionVersion, props.viewResized]);

    const trackedProperties = collection.isTrackedValuesVisible() && (
        <TrackedPropertiesComponentWrapper
            trackedPropertiesTemplate={props.trackedPropertiesTemplate}
            trackedProperties={collection.getTrackedProperties()}
            paddingSize={collection.getLeftPadding().toLowerCase()}
        />
    );

    const metaData = collection.getMetaData();
    const searchValue = collection.getSearchValue();
    const listData = React.useMemo<IListData>(() => {
        return {
            metaData,
            searchValue,
        };
    }, [metaData, searchValue]);

    const headerHandlers = React.useMemo(
        () => ({ onClick: props.onHeaderClick }),
        [props.onHeaderClick]
    );

    const TopTrigger = props.onViewTriggerVisibilityChanged ? (
        <TriggerComponent
            position="top"
            callback={props.onViewTriggerVisibilityChanged}
            instId="gridReact"
            {...props.viewTriggerProps}
        />
    ) : (
        <CollectionTriggerComponent trigger={collection.getTopTrigger()} />
    );

    const BottomTrigger = props.onViewTriggerVisibilityChanged ? (
        <TriggerComponent
            position="bottom"
            callback={props.onViewTriggerVisibilityChanged}
            instId="gridReact"
            {...props.viewTriggerProps}
        />
    ) : (
        <CollectionTriggerComponent trigger={collection.getBottomTrigger()} />
    );

    return (
        <ListDataContext.Provider value={listData}>
            <FocusRoot
                ref={forwardRef}
                as="div"
                style={getStyles(props)}
                className={getClassName(props)}
                data-qa={'gridWrapper'}
                onClick={props.onClick}
            >
                {isOldBrowser && getColgroup(props.collection.getColgroup())}
                {trackedProperties}

                {getHeaderElements(props, headerHandlers)}
                {collection.getResultsPosition() === 'top' && getResults(props)}
                {props.beforeItemsContent}

                {collection.getTopIndicator() && (
                    <IndicatorComponent
                        item={collection.getTopIndicator()}
                        v={collection.getTopIndicator().getVersion()}
                    />
                )}

                {TopTrigger}

                {getEmptyView(props)}
                {getItemsContainer(props, itemsContainerRef)}

                {props.bottomPaddingClass && <div className={props.bottomPaddingClass}></div>}

                {BottomTrigger}

                {collection.getBottomIndicator() && (
                    <IndicatorComponent
                        item={collection.getBottomIndicator()}
                        v={collection.getBottomIndicator().getVersion()}
                    />
                )}
                {collection.getGlobalIndicator() && (
                    <IndicatorComponent
                        item={collection.getGlobalIndicator()}
                        v={collection.getGlobalIndicator().getVersion()}
                    />
                )}
                {props.afterItemsContent}
                {collection.getResultsPosition() === 'bottom' && getResults(props)}
                {getFooter(props)}
            </FocusRoot>
        </ListDataContext.Provider>
    );
});

const ReactGridViewMemo = React.memo(ReactGridViewRef, propsAreEqual);

export function propsAreEqual(prevProps: IGridViewProps, nextProps: IGridViewProps): boolean {
    return (
        prevProps.collection === nextProps.collection &&
        prevProps.collectionVersion === nextProps.collectionVersion &&
        prevProps.needShowEmptyTemplate === nextProps.needShowEmptyTemplate
    );
}

// Данная обертка служит для предотвращения перерисовки из-за генерации новых ref + wasabyRef, которые создаются ядром
// из-за обертки данного компонента, написанной на wasaby (Controls/baseList:BaseControl).
// Удалить можно после перевода Controls/baseList:BaseControl на react.
// itemPadding, groupTemplate, itemTemplate, itemTemplateOptions пробрасывается для совместимости со старым API.
// searchBreadCrumbsItemTemplate относится к searchBreadcrumbs. Вроде стоит экспортировать не мемоизированный View для композиции.
function ReactGridView(props: IGridViewProps) {
    return (
        <ReactGridViewMemo
            className={props.className}
            actionHandlers={props.actionHandlers}
            afterItemsContent={props.afterItemsContent}
            beforeItemContentRender={props.beforeItemContentRender}
            beforeItemsContent={props.beforeItemsContent}
            bottomPaddingClass={props.bottomPaddingClass}
            cCountStart={props.cCountStart}
            cCountEnd={props.cCountEnd}
            collection={props.collection}
            collectionVersion={props.collectionVersion}
            groupRender={props.groupRender}
            groupViewMode={props.groupViewMode}
            groupTemplate={props.groupTemplate}
            groupTemplateOptions={props.groupTemplateOptions}
            innerFocusElement={props.innerFocusElement}
            // Нужно для того, чтобы стопать свайп и лонгтач
            itemActions={props.itemActions}
            itemActionsClass={props.itemActionsClass}
            itemActionsVisibility={props.itemActionsVisibility}
            itemHandlers={props.itemHandlers}
            itemsContainerClass={props.itemsContainerClass}
            itemsContainerReadyCallback={props.itemsContainerReadyCallback}
            itemPadding={props.itemPadding}
            itemTemplate={props.itemTemplate}
            itemTemplateOptions={props.itemTemplateOptions}
            multiSelectTemplate={props.multiSelectTemplate}
            needShowEmptyTemplate={props.needShowEmptyTemplate}
            nodeFooterTemplate={props.nodeFooterTemplate}
            onClick={props.onClick}
            onHeaderClick={props.onHeaderClick}
            onValidateCreated={props.onValidateCreated}
            onValidateDestroyed={props.onValidateDestroyed}
            onViewTriggerVisibilityChanged={props.onViewTriggerVisibilityChanged}
            pixelRatioBugFix={props.pixelRatioBugFix}
            placeholderAfterContent={props.placeholderAfterContent}
            // region searchBreadcrumbsGrid
            searchBreadCrumbsItemTemplate={props.searchBreadCrumbsItemTemplate}
            // endregion searchBreadcrumbsGrid
            showEditArrow={props.showEditArrow}
            style={props.style}
            subPixelArtifactFix={props.subPixelArtifactFix}
            trackedPropertiesTemplate={props.trackedPropertiesTemplate}
            viewResized={props.viewResized}
            viewTriggerProps={props.viewTriggerProps}
            // compatibility
            emptyTemplateOptions={props.emptyTemplateOptions}
            _$FunctionalCellComponent={props._$FunctionalCellComponent}
            _$FunctionalRowComponent={props._$FunctionalRowComponent}
            _$getRowComponent={props._$getRowComponent}
        />
    );
}

/*
 * Рендер таблицы.
 * В опции принимает только коллекцию и ее версию. Перерисовка вызывается только на их основе.
 * Сделано так, чтобы из-за scope лишние перерисовки не доходили хотя бы до For-а.
 */
export default Object.assign(ReactGridView, {
    defaultProps: {
        itemActionsVisibility: 'onhover',
    } as Partial<IGridViewProps>,
});
