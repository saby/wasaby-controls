/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/executor';
import { useReadonly, useTheme } from 'UI/Contexts';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { default as WorkByKeyboardContext } from 'Controls/WorkByKeyboard/Context';
import { IControlProps, ICheckableOptions } from 'Controls/interface';
import rk = require('i18n!Controls');
import 'css!Controls/ShowMoreButton';

/**
 * @typedef TViewMode
 * @variant filled С заливкой
 * @variant ghost Заливка по ховеру
 */
type TViewMode = 'filled' | 'ghost';

/**
 * @typedef TIconMode
 * @variant ellipsis Иконка открытия отображатеся в виде троеточия
 * @variant arrow Иконка открытия отображатеся в виде стрелки
 */
type TIconMode = 'ellipsis' | 'arrow';

export interface IShowMoreButtonOptions
    extends TInternalProps,
        ICheckableOptions,
        IControlProps {
    /**
     * @name Controls/ShowMoreButton#iconMode
     * @cfg {TIconMode} Режим отображения иконки открытия.
     * @default ellipsis
     * @demo Controls-demo/toggle/BigSeparator/IconMode/Index
     */
    iconMode?: TIconMode;
    /**
     * @name Controls/ShowMoreButton#viewMode
     * @cfg {TViewMode} Режим отображения кнопки.
     * @default filled
     * @demo Controls-demo/toggle/BigSeparator/ViewMode/Index
     */
    viewMode?: TViewMode;
    /**
     * @name Controls/ShowMoreButton#contrastBackground
     * @cfg {Boolean} Определяет контрастность фона кнопки по отношению к ее окружению.
     * @default true
     * @demo Controls-demo/toggle/BigSeparator/ContrastBackground/Index
     */
    contrastBackground?: boolean;
    /**
     * @name Controls/ShowMoreButton#iconSize
     * @cfg {String} Размер кнопки.
     * @variant s
     * @variant m
     * @variant l
     * @default m
     * @demo Controls-demo/toggle/BigSeparator/SeparatorSize/Index
     */
    iconSize?: string;

    iconStyle?: string;
    className?: string;
    onValueChanged?: Function;
    onClick?: Function;
}

const getIconClassName = (readOnly: boolean, iconStyle: string): string => {
    let iconClassName = 'controls-BigSeparator-icon';
    if (readOnly) {
        iconClassName += '-readonly';
    } else {
        iconClassName += iconStyle
            ? ' controls-icon_style-' + iconStyle
            : ' controls-BigSeparator-icon_style-default';
    }
    return iconClassName;
};

function ArrowIcon(
    rotate: number,
    readOnly: boolean,
    iconStyle: string
): React.ReactElement {
    const style = {
        transform: `rotate(${rotate}deg)`,
    };
    return (
        <svg
            viewBox="0 0 38 12"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="iconCollapsed"
            x="0px"
            y="0px"
            style={style}
            xmlSpace="preserve"
            className={getIconClassName(readOnly, iconStyle)}
        >
            <path
                d="M27.5 9L19 4.1L10.5 9L10 8.1L19 3L28 8.1L27.5 9Z"
                className="st0"
            />
        </svg>
    );
}

function EllipsisIcon(readOnly: boolean, iconStyle): React.ReactElement {
    return (
        <svg
            viewBox="0 0 38 12"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="iconExpanded"
            x="0px"
            y="0px"
            xmlSpace="preserve"
            className={getIconClassName(readOnly, iconStyle)}
        >
            <path
                className="st0"
                d="M10 8C11.1046 8 12 7.10457 12 6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6C8 7.10457 8.89543 8 10 8Z"
            />
            <path
                className="st0"
                d="M19 8C20.1046 8 21 7.10457 21 6C21 4.89543 20.1046 4 19 4C17.8954 4 17 4.89543 17 6C17 7.10457 17.8954 8 19 8Z"
            />
            <path
                className="st0"
                d="M28 8C29.1046 8 30 7.10457 30 6C30 4.89543 29.1046 4 28 4C26.8954 4 26 4.89543 26 6C26 7.10457 26.8954 8 28 8Z"
            />
        </svg>
    );
}

/**
 * Контрол служит для визуального ограничения контента. При клике на него отображаются скрытые записи, попавшие в ограничение.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Ftoggle%2FBigSeparator%2FIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @class Controls/ShowMoreButton
 *
 * @implements Controls/interface:IControl
 * @public
 * @implements Controls/interface:ICheckable
 *
 * @demo Controls-demo/toggle/BigSeparator/Index
 */
export default React.forwardRef(function ShowMoreButton(
    props: IShowMoreButtonOptions,
    ref
): React.ReactElement<IShowMoreButtonOptions, string> {
    const {
        value = false,
        iconSize = 'm',
        iconStyle,
        contrastBackground = true,
        viewMode = 'filled',
    } = props;
    const readOnly = useReadonly(props);
    const theme = useTheme(props);
    const context = React.useContext(WorkByKeyboardContext);

    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
    };

    const getTooltip = (): string => {
        return value ? rk('Свернуть') : rk('Еще');
    };

    const highlightedOnFocus = (): boolean => {
        return !!context?.workByKeyboard?.status && !readOnly;
    };

    const clickHandler = (e: SyntheticEvent): void => {
        if (!readOnly) {
            if (props.onValueChanged) {
                props.onValueChanged(e, !value);
            }
            if (props.onValuechanged) {
                props.onValuechanged(e, !value);
            }
            props.onClick?.(e);
        }
    };

    const keyUpHandler = (e: SyntheticEvent<KeyboardEvent>): void => {
        if (e.nativeEvent.keyCode === constants.key.space && !readOnly) {
            e.preventDefault();
            clickHandler(e);
        }
    };
    const getBackgroundClass = (): string => {
        let backgroundClass = ` controls-BigSeparator_${viewMode}`;
        if (viewMode === 'filled') {
            const contrastBackgroundStyle = contrastBackground
                ? 'contrast'
                : 'same';
            backgroundClass += `_${contrastBackgroundStyle}`;
        }
        return backgroundClass;
    };

    const attrs = wasabyAttrsToReactDom(props.attrs || {}) || {};
    const wrapperClass =
        `controls_toggle_theme-${theme} controls-BigSeparator` +
        ` controls-BigSeparator-size-${iconSize}` +
        ` controls-BigSeparator__${value ? 'expanded' : 'collapsed'}` +
        `${
            highlightedOnFocus() ? ' controls-focused-item' : ''
        } ${getAttrClass()}`;

    return (
        <div
            tabIndex={0}
            {...attrs}
            className={wrapperClass}
            ref={ref}
            onClick={clickHandler}
            onKeyPress={keyUpHandler}
        >
            <div
                className={
                    `controls-BigSeparator-${
                        readOnly ? 'readonly' : 'iconContainer'
                    }` +
                    getBackgroundClass() +
                    ` controls-BigSeparator-container-icon controls-BigSeparator-container-icon-size-${iconSize}`
                }
                title={getTooltip()}
                tabIndex={0}
            >
                {value
                    ? ArrowIcon(0, readOnly, iconStyle)
                    : props.iconMode === 'arrow'
                    ? ArrowIcon(180, readOnly, iconStyle)
                    : EllipsisIcon(readOnly, iconStyle)}
            </div>
        </div>
    );
});

/**
 * @name Controls/ShowMoreButton#value
 * @cfg {Boolean} Если значение - "true", то будет отображаться иконка открытия, иначе будет отображаться иконка закрытия.
 */
