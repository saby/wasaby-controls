/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import * as rk from 'i18n!Controls';

import {
    IItemActionsTemplateConfig,
    IItemActionsTemplateProps as IItemActionsProps,
} from 'Controls/_itemActions/interface/IItemActionsTemplateConfig';

import {
    EDITING_APPLY_BUTTON_KEY,
    EDITING_CLOSE_BUTTON_KEY,
} from 'Controls/_itemActions/constants';
import ActionsComponent, {
    IBaseActionProps,
} from 'Controls/_itemActions/resources/templatesReact/ActionsComponent';
import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { TItemActionsSize } from 'Controls/interface';
import { MENU_BUTTON_KEY } from 'Controls/_itemActions/Utils';

export interface IItemActionsTemplateProps
    extends IItemActionsTemplateConfig,
        IItemActionsProps,
        IBaseActionProps,
        TInternalProps {
    showedActions: IShownItemAction[];

    isEditing: boolean;
    isSwiped: boolean;

    onActionsMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Стиль фона для панельки с операциями над записью.
 * @remark
 * backgroundStyle Стиль, установленный непосредственно в partial шаблон itemActionsTemplate.
 *    Применяется вне зависимости от highlightOnHover и имеет наибольший приоритет.
 * editingStyle Стиль, из настроек редактирования, который активируется в режиме редактирования и имеет
 *    приоритет перед backgroundStyle
 * templateHoverBackgroundStyle Стиль посветки записей при наведении курсора.
 * highlightOnHover Активна ли подсветка записи по ховеру.
 * actionsPosition Позиция операций над записью.
 * actionsVisibility Видимость операций над записью. При значении visible операции над записью
 *    имеют прозрачную подложку
 */
function getBackgroundClassName(props: IItemActionsTemplateProps): string {
    // В режиме редактирования фон плашки берётся из настроек редактирования
    if (props.isEditing) {
        const editingBackground = props.editingStyle !== 'default' ? props.editingStyle : null;
        return 'controls-itemActionsV_editing' + (editingBackground ? '_' + editingBackground : '');
    }

    if (props.viewMode === 'filled') {
        return 'controls-background-translucent-active-light';
    }

    // Без режима редактирования
    let classes: string;
    const hoverBackgroundStyle = props.hoverBackgroundStyle;
    const useHighlightBackgroundStyle =
        props.highlightOnHover !== false && hoverBackgroundStyle !== 'transparent';

    // Для операций, видимых всегда фон плашки должен совпадать с записью в споконом состоянии и по ховеру
    if (props.actionsVisibility === 'visible') {
        classes = `controls-background-${props.itemActionsBackgroundStyle}`;
        if (useHighlightBackgroundStyle) {
            classes = ` controls-hover-background-${hoverBackgroundStyle || props.style}`;
        }
    } else {
        // Если нет цвета по ховеру, и плашка не "вне" записи
        if (!useHighlightBackgroundStyle && props.itemActionsPosition !== 'outside') {
            classes = `controls-background-${props.itemActionsBackgroundStyle}`;

            // Самый базовый режим (цвет плашки совпадает с цветом ховера записи)
        } else {
            classes = `controls-itemActionsV_style_${hoverBackgroundStyle || props.style}`;
        }
    }
    return classes;
}

function getClassName(props: IItemActionsTemplateProps): string {
    let className = 'controls-itemActionsV js-controls-ListView__visible-on-hoverFreeze';
    className += ` ${getBackgroundClassName(props)}`;
    if (props.attrs?.className) {
        className += ` ${props.attrs.className}`;
    }

    if (props.isEditing && props.toolbarVisibility) {
        className += ' controls-itemActionsV_editingToolbarVisible';
    }
    if (props.isSwiped && props.itemActionsPosition) {
        className += ' controls-itemActionsV_swiped';
    }
    if (props.actionMode === 'adaptive') {
        className += ' controls-itemActionsV_adaptive';
    }

    // Дополнительное оформление.
    if (props.viewMode === 'filled') {
        className +=
            ' controls-inlineheight-m controls-padding_right-2xs' +
            ' controls-padding_left-2xs controls_border-radius-m';
    }

    if (props.itemActionsClass) {
        className += ` ${props.itemActionsClass}`;
    }

    return className;
}

export default React.forwardRef(function ItemActionsTemplate(
    props: IItemActionsTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const actionPadding = props.viewMode === 'filled' ? '3xs' : props.actionPadding;
    const shouldDisplayEditableButtons = props.isEditing && props.toolbarVisibility;
    const shouldDisplayItemActions = props.showedActions && props.showedActions.length;
    if (!shouldDisplayItemActions && !shouldDisplayEditableButtons) {
        Logger.warn('ItemActionsTemplate. Nothing display!');
        return null;
    }

    // В светлом будущем это должно уйти в ActionsController/EditController
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const actions = React.useMemo(() => {
        if (props.menuActionVisibility === 'hidden' || shouldDisplayEditableButtons) {
            const newActions = props.showedActions.slice();
            if (shouldDisplayEditableButtons) {
                newActions.push({
                    id: EDITING_APPLY_BUTTON_KEY,
                    icon: 'icon-Yes',
                    // Добавляем здесь конвертацию, тк по стандату должно быть два вида у кнопки подтверждения
                    // unaccent = success (цвет иконки) + pale (цвет кнопки)
                    // accent = contrast (цвет иконки) + success (цвет кнопки)
                    iconStyle: props.applyButtonStyle === 'unaccent' ? 'success' : 'contrast',
                    style: props.applyButtonStyle === 'unaccent' ? 'pale' : 'success',
                    viewMode: 'filled',
                    inlineHeight: 'm',
                    iconSize: 's',
                    tooltip: rk('Подтвердить'),
                    hasFocus: true,
                });

                const iconUrl = `${constants.resourceRoot}Controls/_itemActions/resources/icons.svg`;
                newActions.push({
                    id: EDITING_CLOSE_BUTTON_KEY,
                    icon: `${getResourceUrl(iconUrl, undefined, true)}#icon-Close`,
                    iconStyle: 'label',
                    iconSize: '2xs' as TItemActionsSize,
                    isSVGIcon: true,
                    tooltip: rk('Закрыть'),
                    viewMode: 'closeButton'
                });
            }

            // Удаляем кнопку меню, если прикладник передал в шаблон ItemActionsTemplate опцию
            // menuActionVisibility = hidden
            if (props.menuActionVisibility === 'hidden') {
                const menuActionIndex = newActions.findIndex((action) => {
                    return action.id === MENU_BUTTON_KEY;
                });
                if (menuActionIndex !== -1) {
                    newActions.splice(menuActionIndex, 1);
                }
            }
            return newActions;
        }
        return props.showedActions;
    }, [props.showedActions, props.isEditing, props.toolbarVisibility]);

    return (
        <div
            {...props.attrs}
            ref={ref}
            className={getClassName(props)}
            onMouseEnter={props.onActionsMouseEnter}
        >
            {
                <ActionsComponent
                    actions={actions}
                    actionPadding={actionPadding}
                    actionStyle={props.actionStyle}
                    actionMode={props.actionMode}
                    iconStyle={props.iconStyle}
                    onActionMouseEnter={props.onActionMouseEnter}
                    onActionMouseLeave={props.onActionMouseLeave}
                    onActionMouseDown={props.onActionMouseDown}
                    onActionMouseUp={props.onActionMouseUp}
                    onActionClick={props.onActionClick}
                />
            }
        </div>
    );
});
