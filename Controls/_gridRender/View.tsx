/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Файл содержит компонент View, который является корневым для отображения грида,
 * а также вспомогательные функции, необходимые этому компоненту
 */
import * as React from 'react';
import type { IItemEventHandlers } from 'Controls/baseList';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { getChangedOptions } from 'UI/Vdom';
import { FocusRoot } from 'UI/Focus';
import {
    CollectionItemContext,
    IndicatorComponent,
    CollectionTriggerComponent,
    TriggerComponent,
} from 'Controls/listsCommonLogic';

import { default as DefaultRC } from 'Controls/_gridRender/row/Base';
import Editing from 'Controls/_gridRender/row/Editing';
import { getHeaderElements } from 'Controls/_gridRender/row/Header';
import { getResults } from 'Controls/_gridRender/row/Results';
import { getFooter } from 'Controls/_gridRender/row/Footer';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';
import { IListData, ListDataContext } from 'Controls/_gridRender/hooks/useListData';
import { getEmptyView } from 'Controls/_gridRender/row/Empty';

import 'css!Controls/grid';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
import { getRowProps } from 'Controls/_gridRender/utils/DecorationStyle';
import { default as GroupCellComponent } from 'Controls/_gridRender/cell/Group';
import { itemPropsAreEqual } from 'Controls/_gridRender/utils/itemPropsAreEqual';
import { isGroupRow, isNodeFooterRow, isSpaceRow } from 'Controls/_gridRender/utils/Type';
import IEColgroup from 'Controls/_gridRender/row/IEColgroup';
import { getGroupRowComponentProps } from 'Controls/_gridRender/row/utils/Group';
import type { GridRow } from 'Controls/gridDisplay';
import { isOldBrowser } from 'Controls/_gridRender/utils/isOldBrowser';
import getVisualComponent from 'Controls/_gridRender/utils/getVisualComponent';
import ResizerComponent from 'Controls/_gridRender/components/Resizer';
import { getCheckValidator, initValidator } from 'Controls/_gridRender/utils/compatibleValidator';
import { ChainOfRef } from 'UICore/Ref';

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
    if (beforeItemsContent && collection.hasColumnScroll()) {
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
    let className = `tw-grid tw-w-full tw-relative controls-Grid controls-Grid_${props.style}`;
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

interface IGetRowComponentProps {
    row: GridRow;
    gridViewProps: IGridViewProps;
    itemHandlers: IItemEventHandlers;
    isHiddenForVirtualScroll: boolean;
    isAdaptive: boolean;
}

/*
 * Возвращает пропсы, по которым обновляется GridRowComponent
 */
function getRowComponentProps({
    row,
    isHiddenForVirtualScroll,
    gridViewProps: props,
    itemHandlers,
    isAdaptive,
}: IGetRowComponentProps): IRowComponentProps {
    // Пока большинство пропсов зашито в коллекции и завият от её логики
    let rowProps = row.getRowComponentProps(itemHandlers, props.actionHandlers);
    rowProps.innerFocusElement = props.innerFocusElement;
    rowProps.pixelRatioBugFix = props.pixelRatioBugFix;
    rowProps.subPixelArtifactFix = props.subPixelArtifactFix;
    rowProps.actionsClassName = rowProps.actionsClassName
        ? rowProps.actionsClassName + ` ${props.itemActionsClass}`
        : props.itemActionsClass;
    rowProps.groupViewMode = props.groupViewMode;
    rowProps.compatibleMultiSelectTemplate = templateLoader(props.multiSelectTemplate, {
        row,
    });
    rowProps.className =
        (rowProps.className || '') +
        (isHiddenForVirtualScroll ? 'ws-hidden' : '') +
        getRowClassName(row);
    rowProps.decorationStyle = props.style;

    if (isGroupRow(row)) {
        // todo: опции groupTemplateOptions никогда не было.
        //  Но, за счёт wml создавались reactiveProps, которые заполнялись зависимыми значениями.
        //  Поэтому работала перерисовка. Сделал по блокеру, т.к. платформа счетов не сможет использовать другой
        //  вариант до перехода на react, который свершится в 2024-25 году.
        //  https://online.sbis.ru/opendoc.html?guid=8476007d-2942-4a5f-83b1-2e36a85965b2&client=3
        rowProps.groupTemplateOptions = props.groupTemplateOptions;
        rowProps = getGroupRowComponentProps({
            row,
            rowProps,
        });
    } else if (props.style === 'master') {
        rowProps = getRowProps(rowProps, props, isAdaptive);
    }
    return rowProps;
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
    } = props;
    const RowComponent = props._$FRC || DefaultRC;
    let row;

    const currentRowProps: IRowComponentProps = {
        cCountStart: props.cCountStart,
        cCountEnd: props.cCountEnd,
        groupProperty: props.groupProperty,
        _$FCC: props._$FCC,
    };

    // Тут рендерится ИЛИ прикладной шаблон ItemTemplate ИЛИ платформенный шаблон RowComponent
    const isValidForItemTemplate = !isGroupRow(item) && !isSpaceRow(item) && !isNodeFooterRow(item);
    if (itemTemplate && isValidForItemTemplate) {
        const expectedTemplate = item['[Controls/_display/TreeItem]']
            ? 'TreeGridItemTemplate'
            : 'GridItemTemplate';
        const compatibleCallValidator = initValidator();
        const checkValidator = rowProps._$checkTemplateValidator;
        row = templateLoader(itemTemplate, {
            ...currentRowProps,
            item,
            itemData: item,
            rowProps,
            ...itemTemplateOptions,
            _$compatibleCallValidator: compatibleCallValidator,
            _$expectedTemplate: expectedTemplate,
        });
        checkValidator(compatibleCallValidator, expectedTemplate);
    } else {
        // TODO При рефакторинге надо убрать GroupCellComponent отсюда.
        if (isGroupRow(item)) {
            currentRowProps['data-qa'] = 'group';
            currentRowProps.groupTemplate = props.groupTemplate;
            currentRowProps.groupTemplateOptions = props.groupTemplateOptions;
            currentRowProps.contentRender = props.groupRender;
            currentRowProps._$FCC = GroupCellComponent;
        }
        row = <RowComponent {...rowProps} {...currentRowProps} />;
    }

    if (item.isEditing()) {
        row = (
            <Editing
                item={item.contents}
                handlers={itemHandlers}
                onValidateCreated={onValidateCreated}
                onValidateDestroyed={onValidateDestroyed}
            >
                {row}
            </Editing>
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
function ItemsContainer(
    props: IGridViewProps,
    ref: React.MutableRefObject<HTMLDivElement>
): React.ReactElement {
    const { collection, needShowEmptyTemplate } = props;
    const itemHandlers = patchItemEventHandlers(props);
    const isAdaptive = useAdaptiveMode()?.device.isPhone();
    if (needShowEmptyTemplate) {
        return null;
    }

    const rows: React.ReactElement[] = [];
    if (props.virtualScrollRange) {
        collection.each((item: GridRow, index: number) => {
            if (
                props.virtualScrollRange &&
                (index >= props.virtualScrollRange.endIndex ||
                    index < props.virtualScrollRange.startIndex)
            ) {
                return;
            }
            const rowProps = getRowComponentProps({
                row: item,
                isHiddenForVirtualScroll: false,
                gridViewProps: props,
                itemHandlers,
                isAdaptive,
            });

            rowProps._$checkTemplateValidator = props._$checkTemplateValidator;

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
    } else {
        const viewIterator = collection.getViewIterator();
        viewIterator.each((item: GridRow, index) => {
            const rowProps = getRowComponentProps({
                row: item,
                isHiddenForVirtualScroll: viewIterator.isItemAtIndexHidden(index),
                gridViewProps: props,
                itemHandlers,
                isAdaptive,
            });

            rowProps._$checkTemplateValidator = props._$checkTemplateValidator;

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
    }

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
    const gridWrapperRef = React.useRef<HTMLDivElement>();
    // const notifiedParamsRef = React.useRef<unknown[]>();

    const finalRef = React.useMemo(() => {
        const mergedGridWrapperAndForwardRefs = ChainOfRef.both(
            forwardRef,
            gridWrapperRef
        ) as React.RefObject<HTMLElement>;
        return mergedGridWrapperAndForwardRefs;
    }, [forwardRef, gridWrapperRef.current]);

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

    const TPC =
        collection.isTrackedValuesVisible() &&
        getVisualComponent('TrackedPropertiesComponentWrapper');
    const trackedProperties = TPC && (
        <TPC
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

    const checkTemplateValidator = React.useMemo(
        () => getCheckValidator(gridWrapperRef),
        [gridWrapperRef.current]
    );

    const preparedProps = React.useMemo(
        () => ({ ...props, _$checkTemplateValidator: checkTemplateValidator }),
        [props, checkTemplateValidator]
    );

    return (
        <ListDataContext.Provider value={listData}>
            <FocusRoot
                ref={finalRef}
                as="div"
                style={getStyles(props)}
                className={getClassName(props)}
                data-qa={'gridWrapper'}
                onClick={props.onClick}
            >
                {isOldBrowser && IEColgroup(props.collection.getColgroup())}
                {trackedProperties}

                {getHeaderElements(preparedProps, headerHandlers)}
                {collection.getResultsPosition() === 'top' && getResults(preparedProps)}
                {props.beforeItemsContent}

                {collection.getTopIndicator() && (
                    <IndicatorComponent
                        item={collection.getTopIndicator()}
                        v={collection.getTopIndicator().getVersion()}
                    />
                )}

                {TopTrigger}

                {getEmptyView(preparedProps)}
                {ItemsContainer(preparedProps, itemsContainerRef)}

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
                {getFooter(preparedProps)}
                {collection.getResultsPosition() === 'bottom' && getResults(preparedProps)}
                {collection.hasResizer() && (
                    <ResizerComponent
                        startColumn={
                            +collection.hasMultiSelectColumn() + collection.getStickyColumnsCount()
                        }
                        resizerCollection={collection.getResizer()}
                        selectors={collection.getColumnScrollSelectors()}
                    />
                )}
            </FocusRoot>
        </ListDataContext.Provider>
    );
});

const ReactGridViewMemo = React.memo(ReactGridViewRef, propsAreEqual);

const COMPATIBILITY_PROPS = ['itemTemplate', 'groupTemplate', 'nodeFooterTemplate'];

function areEqualCompatibleProps(prevProps: IGridViewProps, nextProps: IGridViewProps) {
    return COMPATIBILITY_PROPS.every((propName) => {
        return prevProps[propName] === nextProps[propName];
    });
}

export function propsAreEqual(prevProps: IGridViewProps, nextProps: IGridViewProps): boolean {
    return (
        prevProps.virtualScrollRange === nextProps.virtualScrollRange &&
        prevProps.viewTriggerProps === nextProps.viewTriggerProps &&
        prevProps.collection === nextProps.collection &&
        prevProps.collectionVersion === nextProps.collectionVersion &&
        prevProps.needShowEmptyTemplate === nextProps.needShowEmptyTemplate &&
        areEqualCompatibleProps(prevProps, nextProps)
    );
}

function getCompatibilityProps(props: IGridViewProps) {
    const result = {};

    COMPATIBILITY_PROPS.forEach((propName) => {
        result[propName] = props[propName];
    });

    return result;
}

// Данная обертка служит для предотвращения перерисовки из-за генерации новых ref + wasabyRef, которые создаются ядром
// из-за обертки данного компонента, написанной на wasaby (Controls/baseList:BaseControl).
// Удалить можно после перевода Controls/baseList:BaseControl на react.
// itemPadding, groupTemplate, itemTemplate, itemTemplateOptions пробрасывается для совместимости со старым API.
// searchBreadCrumbsItemTemplate относится к searchBreadcrumbs. Вроде стоит экспортировать не мемоизированный View для композиции.
function ReactGridView(props: IGridViewProps) {
    const compatibilityProps = getCompatibilityProps(props);
    const [statefulProps, setStatefulProps] = React.useState(compatibilityProps);
    const changedOptions = getChangedOptions(compatibilityProps, statefulProps);

    // typeof ради IE, т.к. полифил "Object.keys" не работает с типами, отличными от "object"
    // https://online.sbis.ru/opendoc.html?guid=77b57706-ccfc-411c-9efa-5f0e1908ee06
    if (typeof changedOptions === 'object' && Object.keys(changedOptions).length) {
        setStatefulProps(compatibilityProps);
    }

    return (
        <ReactGridViewMemo
            {...statefulProps}
            virtualScrollRange={props.virtualScrollRange}
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
            groupProperty={props.groupProperty}
            groupRender={props.groupRender}
            groupViewMode={props.groupViewMode}
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
            itemTemplateOptions={props.itemTemplateOptions}
            multiSelectTemplate={props.multiSelectTemplate}
            needShowEmptyTemplate={props.needShowEmptyTemplate}
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
            _$FCC={props._$FCC}
            _$FRC={props._$FRC}
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
