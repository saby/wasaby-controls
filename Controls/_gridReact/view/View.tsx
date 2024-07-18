import * as React from 'react';

import {
    TriggerComponent,
    CollectionTriggerComponent,
    CollectionItemContext,
} from 'Controls/baseList';
import type { GridRow } from 'Controls/grid';
import { TrackedPropertiesComponentWrapper } from 'Controls/listVisualAspects';
import { IndicatorComponent } from 'Controls/listVisualAspects';

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
import { loadSync } from 'WasabyLoader/ModulesLoader';

function getStyles(props: IGridViewProps): React.CSSProperties {
    let gridTemplateColumns = '';

    if (props.cCount) {
        gridTemplateColumns += props.collection.getColumnWidths().slice(0, props.cCount).join(' ');
    } else {
        gridTemplateColumns += props.collection.getColumnWidths().join(' ');
    }

    return { gridTemplateColumns };
}

function getClassName(props: IGridViewProps): string {
    let className = 'tw-grid controls-Grid';
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (props.needShowEmptyTemplate) {
        className += ' tw-h-full';
    }
    return className;
}

function getRowClassName(item: GridRow): string {
    let className = '';
    if (item.isEditing()) {
        className += ' js-controls-ListView__item_editing';
    }
    if (item.isDragged()) {
        className += ' controls-ListView__itemContent_faded';
    }
    return className;
}

function getWrapperedRow(item: GridRow, props: IGridViewProps, rowProps: IRowComponentProps) {
    const {
        itemHandlers,
        onValidateCreated,
        onValidateDestroyed,
        itemTemplate: ItemTemplate,
    } = props;
    const rowGroupProperty = item.getOwner().getGroupProperty();

    let row = null;

    if (item['[Controls/_display/grid/GroupRow]']) {
        row = <GroupRowComponent {...rowProps} cCount={props.cCount} />;
    } else {
        row = <RowComponent {...rowProps} cCount={props.cCount} groupProperty={rowGroupProperty} />;
    }

    if (ItemTemplate) {
        if (typeof ItemTemplate === 'string') {
            const ItemTemplateComponent = loadSync(ItemTemplate);
            row = <ItemTemplateComponent originalRowComponent={row} item={item} />;
        }
        if (typeof ItemTemplate === 'function') {
            row = <ItemTemplate originalRowComponent={row} item={item} />;
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
        const rowProps = item.getRowComponentProps(itemHandlers, props.actionHandlers);
        rowProps.innerFocusElement = props.innerFocusElement;
        rowProps.className =
            (rowProps.className || '') +
            (viewIterator.isItemAtIndexHidden(index) ? 'ws-hidden' : '') +
            getRowClassName(item);
        const row = getWrapperedRow(item, props, rowProps);
        rows.push(row);
    });

    return (
        <div
            ref={ref}
            className={'tw-contents controls-Grid__itemsContainer ' + props.itemsContainerClass}
            data-qa="items-container"
        >
            {rows}
        </div>
    );
}

/**
 * @private
 * @param props
 * @param forwardRef
 * @constructor
 */
const View = React.memo(
    React.forwardRef(function ViewRender(
        props: IGridViewProps,
        forwardRef: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const { collection } = props;
        const itemsContainerRef = React.useRef<HTMLDivElement>();

        React.useLayoutEffect(() => {
            return props.itemsContainerReadyCallback?.(() => {
                return itemsContainerRef.current;
            });
        }, [collection, props.itemsContainerReadyCallback, props.needShowEmptyTemplate]);

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
                <div ref={forwardRef} style={getStyles(props)} className={getClassName(props)}>
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
                </div>
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
        />
    );
}

/*
 * Рендер таблицы.
 * В опции принимает только коллекцию и ее версию. Перерисовка вызывается только на их основе.
 * Сделано так, чтобы из-за scope лишние перерисовки не доходили хотя бы до For-а.
 */
export default FixViewRef;
