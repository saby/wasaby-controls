import * as React from 'react';

import {
    TriggerComponent,
    CollectionItemContext,
    TrackedPropertiesComponentWrapper
} from 'Controls/baseList';
import { GridRow, IndicatorComponent } from 'Controls/grid';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import EditRowWrapper from 'Controls/_gridReact/row/EditRowWrapper';
import { getHeaderElements } from 'Controls/_gridReact/header/Header';
import { getResults } from 'Controls/_gridReact/results/Results';
import { getFooter } from 'Controls/_gridReact/footer/Footer';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';
import { IListData, ListDataContext } from 'Controls/_gridReact/hooks/useListData';
import { getEmptyView } from 'Controls/_gridReact/emptyView/EmptyView';

import 'css!Controls/gridReact';

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

function getItemsContainer(
    props: IGridViewProps,
    ref: React.MutableRefObject<HTMLDivElement>
): React.ReactElement {
    const { collection, itemHandlers, needShowEmptyTemplate } = props;
    if (needShowEmptyTemplate) {
        return null;
    }

    const rows = [];

    collection.getViewIterator().each((item: GridRow) => {
        const rowProps = item.getRowComponentProps(itemHandlers, props.actionHandlers);
        const row = <RowComponent {...rowProps} cCount={props.cCount} />;
        rows.push(
            <CollectionItemContext.Provider value={item} key={item.key}>
                {item.isEditing() ? (
                    <EditRowWrapper item={item.contents} handlers={itemHandlers}>
                        {row}
                    </EditRowWrapper>
                ) : (
                    row
                )}
            </CollectionItemContext.Provider>
        );
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
                className={collection.hasMultiSelectColumn() ? 'controls-padding_left-l' : null}
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

        return (
            <ListDataContext.Provider value={listData}>
                <div ref={forwardRef} style={getStyles(props)} className={getClassName(props)}>
                    {trackedProperties}

                    {getHeaderElements(props, headerHandlers)}
                    {collection.getResultsPosition() === 'top' && getResults(props)}
                    {props.beforeItemsContent}

                    {collection.getTopIndicator() && (
                        <IndicatorComponent item={collection.getTopIndicator()} />
                    )}
                    <TriggerComponent trigger={collection.getTopTrigger()} />

                    {getEmptyView(props)}
                    {getItemsContainer(props, itemsContainerRef)}

                    <TriggerComponent trigger={collection.getBottomTrigger()} />
                    {collection.getBottomIndicator() && (
                        <IndicatorComponent item={collection.getBottomIndicator()} />
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
            beforeItemsContent={props.beforeItemsContent}
            afterItemsContent={props.afterItemsContent}
            needShowEmptyTemplate={props.needShowEmptyTemplate}
            onHeaderClick={props.onHeaderClick}
        />
    );
}

/*
 * Рендер таблицы.
 * В опции принимает только коллекцию и ее версию. Перерисовка вызывается только на их основе.
 * Сделано так, чтобы из-за scope лишние перерисовки не доходили хотя бы до For-а.
 */
export default FixViewRef;
