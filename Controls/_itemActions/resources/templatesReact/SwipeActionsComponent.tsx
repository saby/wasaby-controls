/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import * as React from 'react';
import { ISwipeActionTemplateConfig } from 'Controls/_itemActions/interface/ISwipeActionTemplateConfig';
import { IShownItemAction as IAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { IActionHandlers } from 'Controls/_itemActions/resources/templatesReact/ActionsComponent';
import SwipeAction from 'Controls/_itemActions/resources/templatesReact/SwipeAction';

export interface ISwipeActionsComponentProps
    extends ISwipeActionTemplateConfig,
        Partial<IActionHandlers> {
    actions: IAction[];
}

export default function SwipeActionsComponent(props: ISwipeActionsComponentProps) {
    return props.actions.map((action, index) => {
        const actionTemplate = (
            <SwipeAction
                key={action.id}
                action={action}
                swipeAnimation={props.swipeAnimation}
                twoColumns={props.twoColumns}
                needIcon={props.needIcon}
                needTitle={props.needTitle}
                actionAlignment={props.actionAlignment}
                itemActionsSize={props.itemActionsSize}
                paddingSize={props.paddingSize}
                actionCaptionPosition={props.actionCaptionPosition}
                hasActionWithIcon={props.hasActionWithIcon}
                onActionMouseDown={props.onActionMouseDown}
                onActionClick={props.onActionClick}
            />
        );
        const separator = index !== props.actions.length - 1 && (
            <div
                className={`controls-Swipe__separator controls-Swipe__separator_${props.actionAlignment}`}
                key={`${action.id}-separator`}
            />
        );
        return (
            <React.Fragment key={`${action.id}-wrapper`}>
                {actionTemplate}
                {separator}
            </React.Fragment>
        );
    });
}
