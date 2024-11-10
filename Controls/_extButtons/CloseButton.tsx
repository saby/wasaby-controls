/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import 'css!Controls/extButtons';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IControlProps } from 'Controls/interface';
import rk = require('i18n!Controls');

interface ICloseButtonOptions extends IControlOptions, TInternalProps, IControlProps {
    viewMode: string;
    offset?: string;
    size?: 's' | 'm' | 'l';
    onClick?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onTouchStart?: (event: React.SyntheticEvent<HTMLElement, React.TouchEvent>) => void;
    onMouseDown?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseEnter?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseOver?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseMove?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseLeave?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onKeyPress?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
    onKeyDown?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
}

/**
 * Кнопка закрытия.
 *
 * @class Controls/extButtons:CloseButton
 *
 * @public
 * @demo Controls-demo/PopupTemplate/CloseButton/ViewModes/Index
 * @implements Controls/interface:IControl
 * @mixes Controls/buttons:IClick
 *
 */

export default React.forwardRef(function CloseButton(
    props: ICloseButtonOptions,
    _
): React.ReactElement {
    const { viewMode = 'toolButton', offset, size = 'm', theme } = props;

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <span
            title={rk('Закрыть')}
            {...attrs}
            ref={props.$wasabyRef}
            className={
                `controls_buttons_theme-${theme} controls-CloseButton__close sbisname-window-title-close ` +
                (props.className ? props.className : '')
            }
            data-qa={attrs['data-qa'] || 'controls-stack-Button__close'}
            sbisname="floatAreaCloseButton"
            onClick={props.onClick}
        >
            <span
                onTouchStart={props.onTouchStart}
                onMouseDown={props.onMouseDown}
                onMouseEnter={props.onMouseEnter}
                onMouseOver={props.onMouseOver}
                onMouseMove={props.onMouseMove}
                onMouseLeave={props.onMouseLeave}
                onKeyPress={props.onKeyPress}
                onKeyDown={props.onKeyDown}
                className={
                    `controls-CloseButton__close__wrapper controls-CloseButton__close_${viewMode}` +
                    ` controls-CloseButton__close_size-${
                        ['link', 'linkButton'].includes(viewMode) ? 's' : size
                    }` +
                    ` controls-CloseButton__close_${viewMode}_${
                        offset !== 'null' ? 'offset' : 'null'
                    }`
                }
            >
                <svg
                    className={`controls-CloseButton__close__icon_${viewMode}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                >
                    <path d="M11.7917 10.875C11.9306 10.9861 12 11.1389 12 11.3333C12 11.5278 11.9306 11.6806 11.7917 11.7917C11.7361 11.875 11.6667 11.9306 11.5833 11.9583C11.5 11.9861 11.4167 12 11.3333 12C11.25 12 11.1667 11.9861 11.0833 11.9583C11 11.9306 10.9306 11.875 10.875 11.7917L6 6.95833L1.125 11.7917C1.06944 11.875 1 11.9306 0.916667 11.9583C0.833333 11.9861 0.75 12 0.666667 12C0.583333 12 0.5 11.9861 0.416667 11.9583C0.333333 11.9306 0.263889 11.875 0.208333 11.7917C0.0694444 11.6806 0 11.5278 0 11.3333C0 11.1389 0.0694444 10.9861 0.208333 10.875L5.04167 6L0.208333 1.125C0.0694444 1.01389 0 0.861111 0 0.666667C0 0.472222 0.0694444 0.319444 0.208333 0.208333C0.319444 0.0694444 0.472222 0 0.666667 0C0.861111 0 1.01389 0.0694444 1.125 0.208333L6 5.04167L10.875 0.208333C10.9861 0.0694444 11.1389 0 11.3333 0C11.5278 0 11.6806 0.0694444 11.7917 0.208333C11.9306 0.319444 12 0.472222 12 0.666667C12 0.861111 11.9306 1.01389 11.7917 1.125L6.95833 6L11.7917 10.875Z" />
                </svg>
            </span>
        </span>
    );
});

/**
 * @name Controls/extButtons:CloseButton#offset
 * @cfg {String} Устанавливает отступ справа от кнопки закрытия.
 * @variant default Отступ присутствует.
 * @variant null Отступ отсутствует.
 * @default default
 */

/**
 * @name Controls/extButtons:CloseButton#viewMode
 * @cfg {String} Устанавливает вид отображения кнопки.
 * @variant toolButton Отображение как кнопки панели инструментов.
 * @variant linkButton Отображение кнопки в виде ссылки.
 * @variant functionalButton Отображение функциональной кнопки закрытия
 * @variant external Отображение полупрозрачной кнопки.
 * @variant externalWide Отображение полупрозрачной кнопки с большей шириной, чтобы перед иконкой закрытия разместить контент
 * @default toolButton
 * @example
 * Отображение в виде ссылки:
 * <pre class="brush: html">
 * <Controls.extButtons:CloseButton viewMode="linkButton"/>
 * </pre>
 * Отображение как кнопки панели инструментов:
 * <pre class="brush: html">
 * <Controls.extButtons:CloseButton viewMode="toolButton"/>
 * </pre>
 *
 * Отображение функциональной кнопки закрытия:
 * <pre class="brush: html">
 *    <Controls.extButtons:CloseButton viewMode="functionalButton"/>
 * </pre>
 *
 * Отображение полупрозрачной кнопки закрытия:
 * <pre class="brush: html">
 *    <Controls.extButtons:CloseButton viewMode="external"/>
 * </pre>
 *
 * Отображение широкой полупрозрачной кнопки закрытия:
 * <pre class="brush: html">
 *    <Controls.extButtons:CloseButton viewMode="externalWide"/>
 * </pre>
 */
