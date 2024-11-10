/*
 * Файл содержит компонент View, который является корневым для отображения грида,
 * а также вспомогательные функции, необходимые этому компоненту
 */

import * as React from 'react';
import {
    CollectionItemContext,
    CollectionTriggerComponent,
    TriggerComponent,
} from 'Controls/baseList';
import type { GridRow } from 'Controls/grid';
import { FocusRoot } from 'UI/Focus';
import { IndicatorComponent, TrackedPropertiesComponentWrapper } from 'Controls/listVisualAspects';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import GroupRowComponent from 'Controls/_gridReact/group/GroupRowComponent';
import EditRowWrapper from 'Controls/_gridReact/row/EditRowWrapper';
import { getHeaderElements } from 'Controls/_gridReact/header/Header';
import { getResults } from 'Controls/_gridReact/results/Results';
import { getFooter } from 'Controls/_gridReact/footer/Footer';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';
import { IListData, ListDataContext } from 'Controls/_gridReact/hooks/useListData';
import { getEmptyView } from 'Controls/_gridReact/emptyView/EmptyView';

import 'css!Controls/gridReact';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';
import { templateLoader } from 'Controls/_gridReact/utils/templateLoader';
import { getRowComponentMasterStyleProps } from 'Controls/_gridReact/utils/masterDecorationStyleUtils';

/*
 * Функция, необходимая для рассчета стилей, указываемых в аттребуте style у списка
 */
function getStyles(props: IGridViewProps): React.CSSProperties {
    let gridTemplateColumns = '';

    if (props.cCount) {
        gridTemplateColumns += props.collection.getColumnWidths().slice(0, props.cCount).join(' ');
    } else {
        gridTemplateColumns += props.collection.getColumnWidths().join(' ');
    }

    return { gridTemplateColumns };
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
    if (props.groupViewMode === 'blocks' || props.groupViewMode === 'titledBlocks') {
        className += ` controls-List__groupViewMode_${props.groupViewMode}`;
    }
    return className;
}

/*
 * Функция, для рассчета классов, передаваемых компоненту ряда
 */
function getRowClassName(item: GridRow): string {
    let className = '';
    if (item.isEditing()) {
        className += ' js-controls-ListView__item_editing';
    }
    if (item.isDragged()) {
        className += ' controls-ListView__itemContent_faded';
    }
    if (item['Controls/treeGrid:TreeGridGroupDataRow'] && item.isHiddenGroup()) {
        className += ' controls-ListView__groupHidden';
    }
    return className;
}

/*
 * Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд )
 */
function getWrapperedRow(item: GridRow, props: IGridViewProps, rowProps: IRowComponentProps) {
    const {
        itemHandlers,
        onValidateCreated,
        onValidateDestroyed,
        itemTemplate,
        itemTemplateOptions = {},
        groupTemplate,
    } = props;
    const rowGroupProperty = item.getOwner().getGroupProperty();

    let row = null;

    if (item['[Controls/_display/grid/GroupRow]']) {
        row = (
            <GroupRowComponent {...rowProps} groupTemplate={groupTemplate} cCount={props.cCount} />
        );
    } else {
        row = <RowComponent {...rowProps} cCount={props.cCount} groupProperty={rowGroupProperty} />;
        // Группа не должна рендериться через прикладной itemTemplate.
        // groupTemplate - шаблон ячейки.
        if (itemTemplate) {
            row = templateLoader(itemTemplate, {
                originalRowComponent: row,
                item,
                rowProps,
                ...itemTemplateOptions,
            });
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

    return (
        <CollectionItemContext.Provider value={item} key={item.key}>
            {row}
        </CollectionItemContext.Provider>
    );
}

/*
 * Функция, формирующая контейнер с элементами списка
 */
function getItemsContainer(
    props: IGridViewProps,
    ref: React.MutableRefObject<HTMLDivElement>
): React.ReactElement {
    const { collection, itemHandlers, needShowEmptyTemplate } = props;
    if (needShowEmptyTemplate) {
        return null;
    }

    const rows = [];

    const viewIterator = collection.getViewIterator();
    viewIterator.each((item: GridRow, index) => {
        let rowProps = item.getRowComponentProps(itemHandlers, props.actionHandlers);
        rowProps.innerFocusElement = props.innerFocusElement;
        rowProps.pixelRatioBugFix = props.pixelRatioBugFix;
        rowProps.subPixelArtifactFix = props.subPixelArtifactFix;
        rowProps.actionsClassName = rowProps.actionsClassName
            ? rowProps.actionsClassName + ` ${props.itemActionsClass}`
            : props.itemActionsClass;
        rowProps.groupViewMode = props.groupViewMode;
        rowProps.className =
            (rowProps.className || '') +
            (viewIterator.isItemAtIndexHidden(index) ? 'ws-hidden' : '') +
            getRowClassName(item);
        rowProps.decorationStyle = props.style;

        if (props.style === 'master') {
            rowProps = getRowComponentMasterStyleProps(rowProps, props);
        }

        const row = getWrapperedRow(item, props, rowProps);
        rows.push(row);
    });

    let itemsContainerClass =
        'tw-contents controls-Grid__itemsContainer' +
        ` controls-BaseControl_showActions_${props.itemActionsVisibility}`;
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
const View = React.memo(
    React.forwardRef(function ViewRender(
        props: IGridViewProps,
        forwardRef: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const { collection } = props;
        const itemsContainerRef = React.useRef<HTMLDivElement>();

        React.useLayoutEffect(() => {
            props.itemsContainerReadyCallback?.(() => itemsContainerRef.current);
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
                >
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
    }),
    propsAreEqual
);

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
function FixViewRef(props: IGridViewProps) {
    return (
        <View
            collection={props.collection}
            collectionVersion={props.collectionVersion}
            itemHandlers={props.itemHandlers}
            actionHandlers={props.actionHandlers}
            itemsContainerClass={props.itemsContainerClass}
            itemsContainerReadyCallback={props.itemsContainerReadyCallback}
            viewResized={props.viewResized}
            trackedPropertiesTemplate={props.trackedPropertiesTemplate}
            cCount={props.cCount}
            innerFocusElement={props.innerFocusElement}
            beforeItemsContent={props.beforeItemsContent}
            afterItemsContent={props.afterItemsContent}
            needShowEmptyTemplate={props.needShowEmptyTemplate}
            onHeaderClick={props.onHeaderClick}
            viewTriggerProps={props.viewTriggerProps}
            onViewTriggerVisibilityChanged={props.onViewTriggerVisibilityChanged}
            onValidateCreated={props.onValidateCreated}
            onValidateDestroyed={props.onValidateDestroyed}
            itemTemplate={props.itemTemplate}
            itemActionsVisibility={props.itemActionsVisibility}
            itemTemplateOptions={props.itemTemplateOptions}
            pixelRatioBugFix={props.pixelRatioBugFix}
            subPixelArtifactFix={props.subPixelArtifactFix}
            placeholderAfterContent={props.placeholderAfterContent}
            bottomPaddingClass={props.bottomPaddingClass}
            groupViewMode={props.groupViewMode}
            groupTemplate={props.groupTemplate}
            itemActionsClass={props.itemActionsClass}
            style={props.style}
            itemPadding={props.itemPadding}
        />
    );
}

/*
 * Рендер таблицы.
 * В опции принимает только коллекцию и ее версию. Перерисовка вызывается только на их основе.
 * Сделано так, чтобы из-за scope лишние перерисовки не доходили хотя бы до For-а.
 */
export default Object.assign(FixViewRef, {
    defaultProps: {
        itemActionsVisibility: 'onhover',
    } as Partial<IGridViewProps>,
});
