import * as React from 'react';

import { TriggerComponent, CollectionItemContext } from 'Controls/baseList';
import { GridRow, IndicatorComponent } from 'Controls/grid';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import EditRowWrapper from 'Controls/_gridReact/row/EditRowWrapper';
import { getHeaderElements } from 'Controls/_gridReact/header/header';
import { IGridViewProps } from './interface';

import 'css!Controls/gridReact';

function getStyles(props: IGridViewProps): React.CSSProperties {
    let gridTemplateColumns = '';

    if (props.cCount) {
        gridTemplateColumns += props.collection
            .getColumnWidths()
            .slice(0, props.cCount)
            .join(' ');
    } else {
        gridTemplateColumns += props.collection.getColumnWidths().join(' ');
    }

    return { gridTemplateColumns };
}

function getRowElements(props: IGridViewProps): React.ReactElement[] {
    const { collection, itemHandlers } = props;
    const rows = [];

    collection.getViewIterator().each((item: GridRow) => {
        const rowProps = item.getRowComponentProps();
        const row = (
            <RowComponent
                {...rowProps}
                handlers={itemHandlers}
                actionHandlers={props.actionHandlers}
                cCount={props.cCount}
            />
        );
        rows.push(
            <CollectionItemContext.Provider value={item} key={item.key}>
                {item.isEditing() ? (
                    <EditRowWrapper
                        item={item.contents}
                        handlers={itemHandlers}
                    >
                        {row}
                    </EditRowWrapper>
                ) : (
                    row
                )}
            </CollectionItemContext.Provider>
        );
    });

    return rows;
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
        const ref = React.useRef<HTMLDivElement>();
        React.useImperativeHandle(forwardRef, () => {
            return ref.current;
        });

        React.useLayoutEffect(() => {
            return props.itemsContainerReadyCallback(() => {
                return ref.current;
            });
        }, [collection]);

        // TODO при переписывании BaseControl - удалить и утащить эту логику в BaseControl
        React.useLayoutEffect(() => {
            return props.viewResized();
        }, [props.collectionVersion]);

        const trackedProperties = collection.isTrackedValuesVisible() && (
            <props.trackedPropertiesTemplate
                trackedValues={collection.getTrackedValues()}
                trackedProperties={collection.getTrackedProperties()}
                className={
                    collection.hasMultiSelectColumn()
                        ? 'controls-padding_left-l'
                        : null
                }
            />
        );

        return (
            <div
                ref={ref}
                style={getStyles(props)}
                className={'tw-grid ' + (props.className || '')}
            >
                {trackedProperties}

                {collection.getTopIndicator() && (
                    <IndicatorComponent item={collection.getTopIndicator()} />
                )}
                <TriggerComponent trigger={collection.getTopTrigger()} />
                {getHeaderElements(props)}
                <div
                    className={'tw-contents ' + props.itemsContainerClass}
                    data-qa="items-container"
                >
                    {getRowElements(props)}
                </div>
                <TriggerComponent trigger={collection.getBottomTrigger()} />
                {collection.getBottomIndicator() && (
                    <IndicatorComponent
                        item={collection.getBottomIndicator()}
                    />
                )}
            </div>
        );
    }),
    propsAreEqual
);

export function propsAreEqual(
    prevProps: IGridViewProps,
    nextProps: IGridViewProps
): boolean {
    return (
        prevProps.collection === nextProps.collection &&
        prevProps.collectionVersion === nextProps.collectionVersion
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
            renderFakeHeader={props.renderFakeHeader}
        />
    );
}

/*
 * Рендер таблицы.
 * В опции принимает только коллекцию и ее версию. Перерисовка вызывается только на их основе.
 * Сделано так, чтобы из-за scope лишние перерисовки не доходили хотя бы до For-а.
 */
export default FixViewRef;
