/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import {
    default as ActionsWrapper,
    IActionsWrapperProps,
} from 'Controls/_gridRender/components/Actions';

/**
 * Приватный компонент для рендера ItemActions в отдельной стики ячейке
 * @private
 */
export function StickyActions(props: IActionsWrapperProps) {
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
