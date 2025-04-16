import * as React from 'react';
import { ITileViewProps, ICompatibleTileProps } from './interface/ITileView';
import { FocusRoot } from 'UI/Focus';

// todo
import { IListData, ListDataContext } from 'Controls/_gridRender/hooks/useListData';
import { IndicatorComponentWrapper } from './components/Indicator';
import { TriggerComponentWrapper } from './components/Trigger';
import { getEmptyView } from './components/EmptyView';
import { getFooter } from './components/Footer';
import {
    getItemsContainerClasses,
    getWrapperClasses,
} from 'Controls/_tileRender/utils/classes/View';
import { TileRenderFor } from 'Controls/_tileRender/components/For';

const TILE_COMPATIBILITY_PROPS: (keyof ICompatibleTileProps)[] = ['itemTemplate', 'groupTemplate'];

type TTileCompatibleProps = Pick<ITileViewProps, (typeof TILE_COMPATIBILITY_PROPS)[number]>;

function areEqualCompatibleProps(prevProps: TTileCompatibleProps, nextProps: TTileCompatibleProps) {
    return TILE_COMPATIBILITY_PROPS.every((propName) => {
        return prevProps[propName] === nextProps[propName];
    });
}

function propsAreEqual(prevProps: ITileViewProps, nextProps: ITileViewProps) {
    return (
        prevProps.collection === nextProps.collection &&
        prevProps.collectionVersion === nextProps.collectionVersion &&
        areEqualCompatibleProps(prevProps, nextProps)
    );
}

const ReactTileViewRef = React.forwardRef(
    (props: ITileViewProps, forwardRef: React.ForwardedRef<HTMLDivElement>) => {
        const { collection, onViewTriggerVisibilityChanged, viewTriggerProps } = props;

        const metaData = collection.getMetaData();
        const searchValue = collection.getSearchValue();
        const listData = React.useMemo<IListData>(() => {
            return {
                metaData,
                searchValue,
            };
        }, [metaData, searchValue]);

        const wrapperClasses = React.useMemo(
            () => getWrapperClasses(props),
            [
                props.orientation,
                props.needShowEmptyTemplate,
                props.itemPadding,
                props.itemsContainerPadding,
            ]
        );

        const itemsContainerClasses = React.useMemo(
            () => getItemsContainerClasses(props),
            [props.orientation, props.itemActionsVisibility, props.itemsContainerClass]
        );

        return (
            <ListDataContext.Provider value={listData}>
                <div className={wrapperClasses}>
                    <FocusRoot
                        as="div"
                        ref={forwardRef}
                        data-qa="tile-container"
                        className={itemsContainerClasses}
                    >
                        <IndicatorComponentWrapper position="backward" collection={collection} />
                        <TriggerComponentWrapper
                            position="backward"
                            collection={collection}
                            onViewTriggerVisibilityChanged={onViewTriggerVisibilityChanged}
                            viewTriggerProps={viewTriggerProps}
                        />

                        {getEmptyView(props)}

                        {TileRenderFor(props)}

                        <TriggerComponentWrapper
                            position="forward"
                            collection={collection}
                            onViewTriggerVisibilityChanged={onViewTriggerVisibilityChanged}
                            viewTriggerProps={viewTriggerProps}
                        />
                        <IndicatorComponentWrapper position="forward" collection={collection} />

                        {getFooter(props)}

                        {/* GLOBAL LOADING INDICATOR ВЫВОДИТЬ ТУТ */}
                    </FocusRoot>
                </div>
            </ListDataContext.Provider>
        );
    }
);

const ReactTileViewMemo = React.memo(ReactTileViewRef, propsAreEqual);

/**
 * Рендер плитки.
 * Прокидывает конкретные опции в соответствии с интерфейсом ITileViewProps, за счёт чего отсекает лишние опции,
 * передаваемые из-за использования "scope".
 */
function ReactTileView(props: ITileViewProps) {
    return (
        <ReactTileViewMemo
            collection={props.collection}
            collectionVersion={props.collectionVersion}
            onViewTriggerVisibilityChanged={props.onViewTriggerVisibilityChanged}
            viewTriggerProps={props.viewTriggerProps}
            itemRender={props.itemRender}
            itemActions={props.itemActions}
            itemPadding={props.itemPadding}
            onActionMouseDown={props.onActionMouseDown}
            itemsContainerPadding={props.itemsContainerPadding}
            onActionClick={props.onActionClick}
            onActionMouseUp={props.onActionMouseUp}
            onActionsMouseEnter={props.onActionsMouseEnter}
            onActionMouseEnter={props.onActionMouseEnter}
            onActionMouseLeave={props.onActionMouseLeave}
            onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
            itemHandlers={props.itemHandlers}
            onCustomdragStart={props.onCustomdragStart}
            onCustomdragEnd={props.onCustomdragEnd}
            // Footer props
            stickyFooter={props.stickyFooter}
            footerTemplateOptions={props.footerTemplateOptions}
            orientation={props.orientation}
            backgroundStyle={props.backgroundStyle}
            style={props.style}
            //EmptyProps
            needShowEmptyTemplate={props.needShowEmptyTemplate}
            emptyRender={props.emptyRender}
        />
    );
}

/**
 * Передача дефолтных значений для опций.
 */
export default Object.assign(ReactTileView, {
    defaultProps: {
        imageProperty: 'image',
        displayProperty: 'title',
    } as Partial<ITileViewProps>,
});
