/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { ISwipeActionsComponentProps } from 'Controls/_itemActions/resources/templatesReact/SwipeActionsComponent';
import SwipeAction from 'Controls/_itemActions/resources/templatesReact/SwipeAction';
import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';

export default function SwipeTwoColumnsFor(props: ISwipeActionsComponentProps) {
    return props.actions.map((column, columnIndex) => {
        const actions = (column as unknown as IShownItemAction[]).map((action, actionIndex) => {
            const actionTemplate = (
                <SwipeAction
                    key={action.id}
                    action={action}
                    needIcon={props.needIcon}
                    needTitle={props.needTitle}
                    swipeAnimation={props.swipeAnimation}
                    twoColumns={props.twoColumns}
                    actionAlignment={'horizontal'}
                    itemActionsSize={props.itemActionsSize}
                    paddingSize={props.paddingSize}
                    actionCaptionPosition={props.actionCaptionPosition}
                    hasActionWithIcon={props.hasActionWithIcon}
                    onActionMouseDown={props.onActionMouseDown}
                    onActionClick={props.onActionClick}
                />
            );
            const separator = actionIndex === 0 && (
                <div
                    className={`controls-Swipe__separator controls-Swipe__separator_columns_${
                        columnIndex === 0 ? 'first' : 'second'
                    }`}
                    key={`${action.id}-separator`}
                />
            );
            return (
                <>
                    {actionTemplate}
                    {separator}
                </>
            );
        });

        return (
            <>
                <div className={'controls-Swipe__action_columns'} key={column.id}>
                    {actions}
                </div>
                {columnIndex === 0 && (
                    <div
                        className={'controls-Swipe__separator controls-Swipe__separator_horizontal'}
                    />
                )}
            </>
        );
    });
}
