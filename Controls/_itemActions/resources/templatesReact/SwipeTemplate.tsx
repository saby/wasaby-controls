/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import * as React from 'react';
import ItemActionsTemplate, {
    IItemActionsTemplateProps,
} from 'Controls/_itemActions/resources/templatesReact/ItemActionsTemplate';
import { ISwipeActionTemplateConfig } from 'Controls/_itemActions/interface/ISwipeActionTemplateConfig';
import SwipeTwoColumnsFor from 'Controls/_itemActions/resources/templatesReact/SwipeTwoColumnsFor';
import SwipeActionsComponent from 'Controls/_itemActions/resources/templatesReact/SwipeActionsComponent';
import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';

export interface ISwipeTemplateProps extends IItemActionsTemplateProps, ISwipeActionTemplateConfig {
    onActionsAnimationEnd: (event: React.AnimationEvent) => void;
}

export default function SwipeTemplate(props: ISwipeTemplateProps): JSX.Element {
    if (props.itemActionsPosition === 'outside') {
        return (
            <ItemActionsTemplate
                showedActions={props.showedActions}
                actionPadding={props.actionPadding}
                actionStyle={props.actionStyle}
                actionMode={props.actionMode}
                actionsVisibility={props.actionsVisibility}
                actionAlignment={props.actionAlignment}
                actionCaptionPosition={props.actionCaptionPosition}
                itemActionsClass={props.itemActionsClass}
                itemActionsPosition={props.itemActionsPosition}
                itemActionsBackgroundStyle={props.itemActionsBackgroundStyle}
                attrs={props.attrs}
                highlightOnHover={props.highlightOnHover}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                isEditing={props.isEditing}
                isSwiped={props.isSwiped}
                iconStyle={props.iconStyle}
                toolbarVisibility={props.toolbarVisibility}
                editingStyle={props.editingStyle}
                style={props.style}
                onActionMouseEnter={props.onActionMouseEnter}
                onActionMouseLeave={props.onActionMouseLeave}
                onActionMouseDown={props.onActionMouseDown}
                onActionMouseUp={props.onActionMouseUp}
                onActionClick={props.onActionClick}
                onActionsMouseEnter={props.onActionsMouseEnter}
            />
        );
    }

    return (
        <div className={'controls-itemActionsV_swipe_animationContainer'}>
            <div
                className={`controls-Swipe controls-Swipe_${props.swipeAnimation || 'none'}`}
                onAnimationEnd={props.onActionsAnimationEnd}
            >
                <div
                    className={`controls-Swipe_${
                        props.twoColumns ? 'columns' : props.actionAlignment
                    }`}
                >
                    {props.twoColumns ? (
                        <SwipeTwoColumnsFor
                            actions={props.twoColumnsActions as unknown as IShownItemAction[]}
                            actionAlignment={props.actionAlignment}
                            actionCaptionPosition={props.actionCaptionPosition}
                            twoColumns={props.twoColumns}
                            paddingSize={props.paddingSize}
                            itemActionsSize={props.itemActionsSize}
                            needTitle={props.needTitle}
                            needIcon={props.needIcon}
                            hasActionWithIcon={props.hasActionWithIcon}
                            swipeAnimation={props.swipeAnimation}
                            onActionMouseEnter={props.onActionMouseEnter}
                            onActionMouseLeave={props.onActionMouseLeave}
                            onActionMouseDown={props.onActionMouseDown}
                            onActionMouseUp={props.onActionMouseUp}
                            onActionClick={props.onActionClick}
                        />
                    ) : (
                        <SwipeActionsComponent
                            actions={props.showedActions}
                            actionAlignment={props.actionAlignment}
                            actionCaptionPosition={props.actionCaptionPosition}
                            twoColumns={props.twoColumns}
                            paddingSize={props.paddingSize}
                            itemActionsSize={props.itemActionsSize}
                            needTitle={props.needTitle}
                            needIcon={props.needIcon}
                            hasActionWithIcon={props.hasActionWithIcon}
                            swipeAnimation={props.swipeAnimation}
                            onActionMouseEnter={props.onActionMouseEnter}
                            onActionMouseLeave={props.onActionMouseLeave}
                            onActionMouseDown={props.onActionMouseDown}
                            onActionMouseUp={props.onActionMouseUp}
                            onActionClick={props.onActionClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
