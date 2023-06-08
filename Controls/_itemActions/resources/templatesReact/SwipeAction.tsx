/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { ISwipeActionTemplateConfig } from 'Controls/_itemActions/interface/ISwipeActionTemplateConfig';
import { IShownItemAction as IAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { IActionHandlers } from 'Controls/_itemActions/resources/templatesReact/ActionsComponent';

interface IProps extends ISwipeActionTemplateConfig, Partial<IActionHandlers> {
    action: IAction;
}

function getClassName(props: IProps): string {
    let className =
        'controls-Swipe__action controls-itemActionsV__action_padding_swipe';
    if (props.actionCaptionPosition === 'bottom') {
        className += ' controls-Swipe__action_column';
    }
    if (props.actionCaptionPosition === 'right') {
        className += ' controls-Swipe__action_caption_right';
    }
    className += ` controls-Swipe__action_${props.actionAlignment}`;
    className += ` controls-Swipe__action_padding_size_${props.paddingSize}`;
    className += ` controls-itemActionsV__action_style_${
        props.action.style || 'secondary'
    }`;
    if (props.action.iconStyle && props.action.iconStyle !== 'secondary') {
        className += ` controls-icon_style-${props.action.iconStyle}`;
    } else {
        className += ' controls-Swipe__action_iconStyle_secondary';
    }
    return className;
}

function getIconClassName(props: IProps): string {
    let className = 'controls-Swipe__action_icon_swipe';
    className += ` controls-Swipe__action_icon_size_${props.itemActionsSize}`;
    if (!props.action.isSVGIcon) {
        className += ` ${props.action.icon}`;
    }
    return className;
}

function getTitleClassName(props: IProps): string {
    let className = 'controls-Swipe__action_title';
    className += ` controls-Swipe__action_title_size_${props.itemActionsSize}`;
    className += ` controls-Swipe__action_title_position_${props.actionCaptionPosition}`;
    return className;
}

export default function SwipeAction(props: IProps): JSX.Element {
    let icon = null;
    let title = null;

    if (
        props.needIcon(
            props.action,
            props.actionCaptionPosition,
            props.hasActionWithIcon
        )
    ) {
        if (props.action.isSVGIcon) {
            icon = (
                <svg fillRule={'evenodd'} className={getIconClassName(props)}>
                    <use xlinkHref={props.action.icon} />
                </svg>
            );
        } else {
            icon = <i className={getIconClassName(props)} />;
        }
    }

    if (props.needTitle(props.action, props.actionCaptionPosition)) {
        title = (
            <span className={getTitleClassName(props)}>
                {props.action.title}
            </span>
        );
    }

    return (
        <div
            className={getClassName(props)}
            onMouseDown={(event) => {
                return props.onActionMouseDown?.(event, props.action);
            }}
            onClick={(event) => {
                return props.onActionClick?.(event, props.action);
            }}
        >
            {icon}
            {title}
        </div>
    );
}
