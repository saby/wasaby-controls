/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import * as React from 'react';

import { ButtonTemplate, TButtonStyle } from 'Controls/buttons';
import { TIconStyle, TIconSize } from 'Controls/interface';
import { TItemActionShowType as TActionShowType } from '../../constants';
import { IShownItemAction as IAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { TActionMode } from 'Controls/_itemActions/interface/IItemActionsTemplateConfig';
import { DEFAULT_ICON_STYLE } from 'Controls/_itemActions/constants';

export type TActionHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    action: IAction
) => void;

export interface IActionHandlers {
    onActionMouseEnter: TActionHandler;
    onActionMouseLeave: TActionHandler;
    onActionMouseDown: TActionHandler;
    onActionMouseUp: TActionHandler;
    onActionClick: TActionHandler;
}

export interface IBaseActionProps extends Partial<IActionHandlers> {
    actionStyle?: TButtonStyle;
    actionPadding?: string;
    actionMode?: TActionMode;
    iconStyle?: TIconStyle;
    iconSize?: TIconSize;
}

interface IActionsComponentProps extends IBaseActionProps {
    actions: IAction[];
}

interface IActionComponentProps extends IBaseActionProps {
    action: IAction;
}

function getActionClassName(props: IActionComponentProps): string {
    let className =
        'controls-itemActionsV__action js-controls-ItemActions__ItemAction';
    className += ` controls-itemActionsV__action_style_${
        props.actionStyle || props.action.style
    }`;
    className += ` controls-itemActionsV__action_iconSize_${
        props.action.iconSize || props.iconSize
    }`;
    if (props.actionMode === 'adaptive') {
        className += ' controls-itemActionsV_action_adaptive';
    }
    if (!props.action.isMenu) {
        className += ` controls-itemActionsV__action_padding${
            props.actionPadding ? `_${props.actionPadding}` : ''
        }`;
    }

    return className;
}

/*
 * Метод подменяет стиль иконки по умолчанию на переданный из внешнего шаблона.
 * Например, для плитки передаются стили для цвета по умолчанию, но они не должны перебивать "галку" подтверждения
 * редактирования по месту или цвет по умолчанию для кнопки удаления, а FIXED подходит не всем.
 * @param action
 * @param defaultIconStyle
 */
function resolveIconStyle(
    action: IAction,
    defaultIconStyle: TIconStyle = DEFAULT_ICON_STYLE
): TIconStyle {
    if (action.showType === TActionShowType.FIXED) {
        return action.iconStyle;
    }
    return action.iconStyle === DEFAULT_ICON_STYLE
        ? defaultIconStyle
        : action.iconStyle;
}

function ActionComponent(props: IActionComponentProps): JSX.Element {
    const action = props.action;
    const iconStyle = resolveIconStyle(action, props.iconStyle);
    const preventFocusOnClickProps: Record<string, string> = {
        'ws-no-focus': action.hasFocus ? undefined : 'true',
    };

    // TODO ws-creates-context, ws-delegates - пока ядро не сделает нормальное API для новой системы фокусов
    return (
        <div
            className={getActionClassName(props)}
            title={action.tooltip}
            data-qa={'controls-itemActions__action ' + action.id}
            tabIndex={-1}
            ws-creates-context={'true'}
            ws-delegates-tabfocus={'true'}
            {...preventFocusOnClickProps}
            onMouseDown={(event) => {
                return props.onActionMouseDown?.(event, action);
            }}
            onMouseUp={(event) => {
                return props.onActionMouseUp?.(event, action);
            }}
            onClick={(event) => {
                return props.onActionClick?.(event, action);
            }}
            onMouseEnter={(event) => {
                return props.onActionMouseEnter?.(event, action);
            }}
            onMouseLeave={(event) => {
                return props.onActionMouseLeave?.(event, action);
            }}
        >
            <ButtonTemplate
                _viewMode={action.viewMode}
                _buttonStyle={props.actionStyle || action.style}
                _fontSize={action.fontSize}
                _icon={action.icon}
                _iconSize={action.iconSize || props.iconSize}
                _caption={action.caption}
                _fontColorStyle={props.actionStyle || 'link'}
                _hasIcon={action.hasIcon}
                _stringCaption={true}
                _iconStyle={iconStyle}
                _height={action.inlineHeight}
                _isSVGIcon={action.isSVGIcon}
                _captionPosition={'end'}
                readOnly={false}
                attrs={preventFocusOnClickProps}
            />
        </div>
    );
}

function getWrapperClassName(props: IActionsComponentProps): string {
    let className = 'controls-itemActionsV__wrapper';
    if (props.actionMode === 'adaptive') {
        className += ' controls-itemActionsV__wrapper_adaptive';
    }
    return className;
}

export default function ActionsComponent(
    props: IActionsComponentProps
): JSX.Element {
    const actions = props.actions.map((action) => {
        return (
            <ActionComponent
                key={action.id}
                action={action}
                actionMode={props.actionMode}
                actionPadding={props.actionPadding}
                actionStyle={props.actionStyle}
                iconStyle={props.iconStyle}
                iconSize={props.iconSize}
                onActionMouseEnter={props.onActionMouseEnter}
                onActionMouseLeave={props.onActionMouseLeave}
                onActionMouseDown={props.onActionMouseDown}
                onActionMouseUp={props.onActionMouseUp}
                onActionClick={props.onActionClick}
            />
        );
    });

    return <div className={getWrapperClassName(props)}>{actions}</div>;
}
