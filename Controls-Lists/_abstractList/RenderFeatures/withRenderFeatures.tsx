/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ComponentType } from 'react';

import { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';

import type { TWithInteractorProvidedProps } from '../HoC/withInteractor';
import type { TWithInteractorCommandsProvidedProps } from '../HoC/withInteractorCommands';
import type { TWithRenderRefsProvidedProps } from '../HoC/withRenderRefs';
import type { TWithCollectionVersionProvidedProps } from '../HoC/withCollectionVersion';

import ScrollContainer, { IScrollControllerWrapperProps } from './Scroll/Container';
import DNDContainer, { TDragNDropContainerProps } from './DND/Container';
import { Container as ListActionsContainer } from 'Controls/itemActions';
import { IConnectableToSlice } from '../interface/IConnectableToSlice';
import { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import { IAbstractRenderProps } from '../interface/IAbstractRender';

export type TFeaturesProps = TWithCollectionVersionProvidedProps &
    Pick<
        TDragNDropContainerProps,
        | 'itemsDragNDrop'
        | 'dragStartDelay'
        | 'draggingRender'
        | 'onDragStart'
        | 'onDragMove'
        | 'onDragEnd'
        | 'onChangeDragTarget'
        | 'readOnly'
    > &
    Pick<
        IScrollControllerWrapperProps,
        | 'virtualScrollConfig'
        | 'pagingLeftTemplate'
        | 'pagingRightTemplate'
        | 'pagingContentTemplate'
    >;

export type TInnerComponentProps<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
> = TWithInteractorProvidedProps<TListAPI, TListState> &
    TWithInteractorCommandsProvidedProps<TViewCommandHandlers> &
    IConnectableToSlice &
    TWithRenderRefsProvidedProps &
    Pick<IAbstractRenderProps, 'viewTriggerProps'>;

export function withRenderFeatures<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TOuter extends TInnerComponentProps<TListAPI, TListState, TViewCommandHandlers>,
>(Component: ComponentType<TOuter>) {
    function Composed({
        onDragStart,
        onDragMove,
        onDragEnd,
        onChangeDragTarget,
        draggingRender,
        itemsDragNDrop,
        dragStartDelay,
        pagingLeftTemplate,
        pagingContentTemplate,
        pagingRightTemplate,

        ...clearRenderProps
    }: TOuter & TFeaturesProps) {
        const { viewModelState, viewModelAPI } = clearRenderProps;

        if (!viewModelState.collection) {
            throw Error('Missing collection!');
        }

        return (
            <DNDContainer
                listContainerRef={clearRenderProps.listContainerRef}
                viewModelAPI={viewModelAPI}
                viewModelState={viewModelState}
                readOnly={clearRenderProps.readOnly}
                draggingRender={draggingRender}
                itemsDragNDrop={itemsDragNDrop}
                dragStartDelay={dragStartDelay}
                hasDragScrolling={
                    /* TODO: Нужно будет подружить со скроллом колонок, когда он появится. */
                    false
                }
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onChangeDragTarget={onChangeDragTarget}
            >
                <ListActionsContainer
                    storeId={clearRenderProps.storeId}
                    contextMenuConfig={undefined}
                >
                    <ScrollContainer
                        collection={viewModelState.collection}
                        navigation={viewModelState.navigation}
                        collectionVersion={clearRenderProps.collectionVersion}
                        viewModelAPI={viewModelAPI}
                        virtualScrollConfig={clearRenderProps.virtualScrollConfig}
                        pagingLeftTemplate={pagingLeftTemplate}
                        pagingContentTemplate={pagingContentTemplate}
                        pagingRightTemplate={pagingRightTemplate}
                        listContainerRef={clearRenderProps.listContainerRef}
                        apiRef={clearRenderProps.scrollAPIRef}
                    >
                        <Component {...(clearRenderProps as unknown as TOuter)} />
                    </ScrollContainer>
                </ListActionsContainer>
            </DNDContainer>
        );
    }

    Composed.displayName = `withRenderFeatures(${Component.displayName || Component.name})`;

    return Composed;
}

export default withRenderFeatures;
