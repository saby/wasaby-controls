/**
 * @kaizen_zone 435be96a-5e21-41dc-84ce-32e4e1b3e61b
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/executor';
import { IControlProps } from 'Controls/interface';

/**
 * Интерфейс для чекбоксов.
 * @interface Controls/_checkbox/ICheckboxMarker
 * @public
 */
export interface ICheckboxMarkerOptions extends TInternalProps, IControlProps {
    triState?: boolean;
    value?: boolean | null;
    resetValue?: boolean | null;
    horizontalPadding?: string;
    size?: 's' | 'm' | 'l';
    viewMode?: 'filled' | 'outlined' | 'ghost';
    onClick?: Function;
    onKeyUp?: Function;
    className?: string;
    readOnly?: boolean;
    theme?: string;
}

/**
 * Контрол, отображающий элемент контрола "чекбокс" - галочку
 * @remark
 * Контрол служит только для отображения галочки, он не реагирует на какие-либо события и сам не стреляет событиями
 * @class Controls/_checkbox/CheckboxMarker
 * @implements Controls/interface:IControl
 * @implements Controls/checkbox:ICheckboxMarker
 *
 * @public
 * @demo Controls-demo/toggle/CheckboxMarker/Index
 */
export default React.forwardRef(function CheckboxMarker(
    props: ICheckboxMarkerOptions,
    _
): React.ReactElement<ICheckboxMarkerOptions, string> {
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
    };

    const {
        horizontalPadding = 'default',
        size = 's',
        viewMode = 'ghost',
        readOnly,
        theme,
        value,
        resetValue,
        triState,
    } = props;

    const attrs = wasabyAttrsToReactDom(props.attrs || {}) || {};
    const wrapperClass =
        `controls_toggle_theme-${theme} controls-CheckboxMarker` +
        ` controls-CheckboxMarker_${viewMode} controls-CheckboxMarker_theme-${theme}` +
        ` controls-CheckboxMarker__state-${value === null ? 'null' : value}` +
        ` controls-CheckboxMarker__icon-border-color__${
            readOnly ? 'disabled' : 'enabled'
        } ${getAttrClass()}`;

    return (
        <div
            tabIndex={0}
            {...attrs}
            data-qa="controls-CheckboxMarker"
            className={wrapperClass}
            ref={props.$wasabyRef}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onKeyUp={(e) => {
                return props.onKeyUp?.(e);
            }}
        >
            <svg
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                className={`controls-CheckboxMarker__icon-checked controls-CheckboxMarker__icon-size-${size} controls-CheckboxMarker__icon-checked-horizontalPadding-${horizontalPadding}`}
                tabIndex={!readOnly ? 0 : -1}
                data-qa={`controls-CheckboxMarker_state-${
                    value === null ? 'null' : value
                }${resetValue === value ? '_resetValue' : ''}`}
            >
                <path
                    d="M8 0.5H4C2.067 0.5 0.5 2.067 0.5 4V8C0.5 9.933 2.067 11.5 4 11.5H8C9.933 11.5 11.5 9.933 11.5 8V4C11.5 2.067 9.933 0.5 8 0.5Z"
                    className={`controls-CheckboxMarker__icon-border_${
                        readOnly ? 'disabled' : 'enabled'
                    } controls-CheckboxMarker__icon-border-state-${
                        value === null ? 'null' : value
                    }${resetValue === value ? '_resetValue' : ''}`}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0.5C8 0.22386 7.77614 0 7.5 0H4C1.79086 0 0 1.79086 0 4V8C0 10.2091 1.79086 12 4 12H8C10.2091 12 12 10.2091 12 8V7.5C12 7.22386 11.7761 7 11.5 7C11.2239 7 11 7.22386 11 7.5V8C11 9.6569 9.6569 11 8 11H4C2.34315 11 1 9.6569 1 8V4C1 2.34315 2.34315 1 4 1H7.5C7.77614 1 8 0.77614 8 0.5Z"
                    className={`controls-CheckboxMarker__icon-subtract ${
                        value && resetValue !== value
                            ? 'controls-CheckboxMarker__icon-subtract-checked_' +
                              (readOnly ? 'disabled' : 'enabled')
                            : ''
                    }`}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.7609 1.16985C12.0549 1.41657 12.0814 1.84159 11.8201 2.11915L6.43652 8.77431C6.29706 8.92242 6.09549 9.00491 5.88564 8.99977C5.67579 8.99463 5.47903 8.90237 5.34789 8.74764L3.15612 6.16144C2.91036 5.87145 2.96017 5.44831 3.26737 5.21632C3.57456 4.98433 4.02283 5.03134 4.26858 5.32133L5.93279 7.28503L10.7553 1.22569C11.0166 0.948133 11.4669 0.923132 11.7609 1.16985Z"
                    className={`${
                        value
                            ? 'controls-CheckboxMarker__icon-checked-color_' +
                              (readOnly ? 'disabled' : 'enabled')
                            : 'controls-CheckboxMarker__icon-checked-color_transparent'
                    }`}
                />
                <rect
                    x="3"
                    y="3"
                    width="6"
                    height="6"
                    rx="2"
                    className={`${
                        value === null && triState
                            ? 'controls-CheckboxMarker__state-null__icon-color__' +
                              (readOnly ? 'disabled' : 'enabled')
                            : 'controls-CheckboxMarker__state-null__icon-color__transparent'
                    }`}
                />
            </svg>
        </div>
    );
});

/**
 * @name Controls/_checkbox/ICheckboxMarker#viewMode
 * @cfg {string} Определяет, стиль отображения чекбокса
 * @variant filled Оранжевая заливка и белая галка
 * @variant ghost Без заливки
 * @variant outlined Белая заливка и оранжевая галка
 * @default filled
 */

/**
 * @name Controls/_checkbox/ICheckboxMarker#triState
 * @cfg {Boolean} Определяет, разрешено ли устанавливать чекбоксу третье состояние — "не определен" (null).
 * @default False
 * @remark
 * * True - Разрешено устанавливать третье состояние.
 * * False - Не разрешено устанавливать третье состояние.
 *
 * Если установлен режим triState, то значение {@link value} может быть "null".
 */
/**
 * @name Controls/_checkbox/ICheckboxMarker#value
 * @cfg {Boolean|null} Значение, которое определяет текущее состояние.
 * @default False
 * @remark
 * * True - чекбокс в состоянии "отмечено".
 * * False - чекбокс в состоянии "не отмечено". Это состояние по умолчанию.
 * * null - состояние чекбокса при включенной опции {@link triState}.
 */

/**
 * @name Controls/_checkbox/ICheckboxMarker#size
 * @cfg {String} Определяет размер галочки.
 * @variant s
 * @variant l
 * @default s
 */
