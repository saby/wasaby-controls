import {
    default as ActionsWrapper,
    IActionsWrapperProps,
} from 'Controls/_grid/dirtyRender/cell/components/ActionsWrapper';

export function CellComponentStickyItemActions(props: IActionsWrapperProps) {
    return (
        <div
            className="js-controls-DragScroll__notDraggable controls-itemActionsV__container controls-Grid__itemAction controls-Grid__itemAction_sticky tw-w-0 tw-min-w-0 tw-max-w-0 tw-p-0"
            data-qa="actions-cell"
        >
            <ActionsWrapper
                actionsVisibility={props.actionsVisibility}
                actionsPosition={props.actionsPosition}
                actionHandlers={props.actionHandlers}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                backgroundStyle={props.backgroundStyle}
                actionsClassName={props.actionsClassName}
            />
        </div>
    );
}
