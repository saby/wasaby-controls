/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { IControlProps } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { CloseButton } from 'Controls/buttons';
import { createElement } from 'UICore/Jsx';
import 'css!Controls/popupConfirmation';
import { delimitProps } from 'UICore/Jsx';

type TStyle =
    | 'default'
    | 'danger'
    | 'secondary'
    | 'success'
    | 'primary'
    | 'info'
    | 'warning';
type TSize = 's' | 'l';
interface IConfirmationTemplate extends IControlProps {
    bodyContentTemplate?: TemplateFunction;
    footerContentTemplate?: TemplateFunction;
    size: TSize | string;
    borderStyle: TStyle;
    markerStyle: TStyle;
}

const MAX_MESSAGE_LENGTH = 100;
const MAX_DETAILS_LENGTH = 160;

/**
 * Базовый шаблон <a href='/doc/platform/developmentapl/interface-development/controls/openers/confirmation/'>диалога подтверждения</a>.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupConfirmation/Template
 *
 * @public
 * @implements Controls/interface:IControl
 * @mixes Controls/_popupConfirmation/Template/mixin
 * @demo Controls-demo/PopupConfirmation/Template/Index
 */

function Template(props: IConfirmationTemplate, ref): React.ReactElement {
    const { userAttrs } = delimitProps(props);
    React.useEffect(() => {
        if (props.style !== undefined) {
            Logger.warn(
                'Controls.popup:Confirmation: Используется устаревшая опция style,' +
                    ' нужно использовать markerStyle',
                this
            );
        }
        if (props.borderStyle !== undefined) {
            Logger.warn(
                'Controls.popup:Confirmation: Используется устаревшая опция borderStyle, ' +
                    ' нужно использовать markerStyle',
                this
            );
        }
    }, []);

    const getWidthClass = (): string => {
        const width = Number(props.width);
        if (props.width && Number.isNaN(width)) {
            return 'controls-ConfirmationTemplate__width-' + props.width;
        }
    };

    const getWidth = (): number => {
        if (typeof props.width === 'number') {
            return props.width;
        }
    };

    const getSize = (): string => {
        if (props.width) {
            return null;
        }
        if (props.size) {
            return props.size;
        }
        if (
            (props.message && props.message.length) > MAX_MESSAGE_LENGTH ||
            (props.details && props.details.length) > MAX_DETAILS_LENGTH
        ) {
            return 'l';
        }
        return 's';
    };

    const getMarkerStyle = (): string => {
        switch (props.style || props.borderStyle || props.markerStyle) {
            case 'warning':
                return 'warning';
            case 'success':
                return 'success';
            case 'danger':
                return 'danger';
            case 'info':
                return 'info';
            case 'none':
                return 'none';
            default:
                return 'secondary';
        }
    };

    const getBodyContentTemplate = (): React.ReactElement => {
        if (props.bodyContentTemplate) {
            return createElement(props.bodyContentTemplate);
        }
    };

    const getFooterContentTemplate = (): React.ReactElement => {
        if (props.footerContentTemplate) {
            return createElement(props.footerContentTemplate, {
                $wasabyRef: props.$wasabyRef,
            });
        }
    };

    const getCloseButton = (): React.ReactElement => {
        if (props.closeButtonVisible) {
            return createElement(
                CloseButton,
                {
                    viewMode: props.closeButtonViewMode || 'linkButton',
                },
                {
                    class: 'controls-DialogTemplate__close_button controls-DialogTemplate__close_button_size-m',
                },
                {
                    'on:click': [close],
                }
            );
        }
    };

    const close = (): void => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const getClassName = (): string => {
        let className = '';
        if (props.className) {
            className += ` ${props.className}`;
        }
        if (userAttrs?.className) {
            className += ` ${userAttrs.className}`;
        }
        return className;
    };

    return (
        <div
            className={`controls_popupTemplate_theme-${
                props.theme
            } controls-ConfirmationTemplate
            controls-ConfirmationTemplate__size-${getSize()} ${getClassName()}
            ${getWidthClass()} controls-Popup__isolatedFocusingContext`}
            ws-tab-cycling="true"
            ref={props.$wasabyRef}
            tabIndex={0}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            style={{ width: `${getWidth()}px` }}
            ws-delegates-tabfocus="true"
        >
            <div className="controls-ConfirmationTemplate__body">
                <div
                    className={`controls-ConfirmationTemplate__marker controls-ConfirmationTemplate__marker__style-${getMarkerStyle()}`}
                    data-qa={`controls-ConfirmationTemplate__marker__style-${getMarkerStyle()}`}
                ></div>
                <div className="controls-ConfirmationTemplate__close-button">
                    {getCloseButton()}
                </div>
                <div
                    className="controls-ConfirmationTemplate__main"
                    data-qa="controls-ConfirmationTemplate__main"
                >
                    {getBodyContentTemplate()}
                </div>
                <div
                    className={
                        props.footerContentTemplate &&
                        'controls-ConfirmationTemplate__footer'
                    }
                    data-qa="controls-ConfirmationTemplate__footer"
                >
                    {getFooterContentTemplate()}
                </div>
            </div>
        </div>
    );
}

Template.isReact = true;

/**
 * @name Controls/_popupConfirmation/Template#size
 * @cfg {String} Размер окна диалога.
 * @variant s
 * @variant l
 * @default s
 */

/**
 * @name Controls/_popupConfirmation/Template#markerStyle
 * @cfg {String} Стиль отображения окна диалога.
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant primary
 * @variant secondary
 */

/**
 * @name Controls/_popupConfirmation/Template#bodyContentTemplate
 * @cfg {function|String} Основной контент окна диалога.
 */

/**
 * @name Controls/_popupConfirmation/Template#footerContentTemplate
 * @cfg {function|String} Контент подвала окна диалога.
 */

/**
 * Закрытие окна диалога подтверждения.
 * @function Controls/_popupConfirmation/Template#close
 */

export default React.forwardRef(Template);
