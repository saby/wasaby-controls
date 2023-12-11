/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import 'css!Controls/buttons';
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
 * @class Controls/buttons:CloseButton
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
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M12.7,12l5.16-5.16a0.49,0.49,0,0,0-.7-0.7L12,11.3,6.84,6.14a0.49,0.49,0,0,0-.7.7L11.3,12,6.14,17.16a0.49,0.49,0,1,0,.7.7L12,12.7l5.16,5.16a0.49,0.49,0,0,0,.7-0.7Z"
                        transform="translate(-6 -6)"
                    />
                </svg>
            </span>
        </span>
    );
});

/**
 * @name Controls/buttons:CloseButton#offset
 * @cfg {String} Устанавливает отступ справа от кнопки закрытия.
 * @variant default Отступ присутствует.
 * @variant null Отступ отсутствует.
 * @default default
 */

/**
 * @name Controls/buttons:CloseButton#viewMode
 * @cfg {String} Устанавливает вид отображения кнопки.
 * @variant toolButton Отображение как кнопки панели инструментов.
 * @variant linkButton Отображение кнопки в виде ссылки.
 * @variant functionalButton Отображение функциональной кнопки закрытия
 * @variation external Отображение полупрозрачной кнопки.
 * @variation externalWide Отображение полупрозрачной кнопки с большей шириной, чтобы перед иконкой закрытия разместить контент
 * @default toolButton
 * @example
 * Отображение в виде ссылки:
 * <pre class="brush: html">
 * <Controls.buttons:CloseButton viewMode="linkButton"/>
 * </pre>
 * Отображение как кнопки панели инструментов:
 * <pre class="brush: html">
 * <Controls.buttons:CloseButton viewMode="toolButton"/>
 * </pre>
 *
 * Отображение функциональной кнопки закрытия:
 * <pre>
 *    <Controls.buttons:CloseButton viewMode="functionalButton"/>
 * </pre>
 *
 * Отображение полупрозрачной кнопки закрытия:
 * <pre>
 *    <Controls.buttons:CloseButton viewMode="external"/>
 * </pre>
 */
