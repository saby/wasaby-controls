/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { IControlProps } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import Async from 'Controls/Container/Async';
import 'css!Controls/popupConfirmation';
import { useAdaptiveMode } from 'UI/Adaptive';
import { IPopupWidthOptions } from 'Controls/popup';

type TStyle = 'default' | 'danger' | 'secondary' | 'success' | 'primary' | 'info' | 'warning';
type TSize = 's' | 'l';

interface IConfirmationTemplate extends IControlProps, IPopupWidthOptions {
    bodyContentTemplate?: TemplateFunction;
    footerContentTemplate?: TemplateFunction;
    size: TSize | string;
    borderStyle: TStyle;
    markerStyle: TStyle;
    message?: string;
    details?: string;
    closeButtonVisible?: boolean;
    closeButtonViewMode?: string;
    onClose?: Function;
    onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
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
 * @implements Controls/popup:IPopupWidth
 * @demo Controls-demo/PopupConfirmation/Template/Index
 */

function Template(
    props: IConfirmationTemplate,
    forwardedRef: React.LegacyRef<HTMLDivElement>
): React.ReactElement {
    const adaptiveMode = useAdaptiveMode();

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
        if (props.size !== undefined) {
            Logger.warn(
                'Controls.popup:Confirmation: Используется устаревшая опция size, ' +
                    ' нужно использовать width',
                this
            );
        }
    }, []);

    const isAdaptive = adaptiveMode.device.isPhone();

    const getWidth = (): number => {
        if (typeof props.width === 'number') {
            return props.width;
        }
    };

    const size = React.useMemo((): string => {
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
    }, [props.size, props.width, props.message, props.details]);

    const getWidthClass = (): string => {
        const width = Number(props.width);
        if (props.width && Number.isNaN(width)) {
            return 'controls-ConfirmationTemplate__width-' + props.width;
        } else if (size === 's' || size === 'm') {
            // todo https://online.sbis.ru/opendoc.html?guid=9c158665-bb0a-466b-a9c2-b5379d6ed15b&client=3 поправить костыль по этой задаче
            return 'controls-ConfirmationTemplate__width-d';
        } else if (size === 'l') {
            return 'controls-ConfirmationTemplate__size-l';
        }
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

    const getContentTemplate = (ContentTemplate) => {
        if (ContentTemplate) {
            return ContentTemplate.isWasabyTemplate || typeof ContentTemplate === 'function' ? (
                <ContentTemplate />
            ) : (
                ContentTemplate
            );
        }
    };

    const getCloseButton = (): React.ReactElement => {
        if (props.closeButtonVisible && !isAdaptive) {
            const closeOptions = {
                viewMode: props.closeButtonViewMode || 'linkButton',
                className:
                    'controls-DialogTemplate__close_button controls-DialogTemplate__close_button_size-m',
                onClick: close,
            };
            return (
                <Async
                    templateName="Controls/extButtons:CloseButton"
                    templateOptions={closeOptions}
                />
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
        } else if (props?.className) {
            className += ` ${props.className}`;
        }
        return className;
    };

    let contentClassName = 'controls-ConfirmationTemplate__body';
    contentClassName += ` controls-ConfirmationTemplate__style-${getMarkerStyle()}`;

    let footerClassName = 'controls-ConfirmationTemplate__footer';
    if (isAdaptive) {
        footerClassName += ' controls-ConfirmationTemplate__footer_adaptive';
    }

    return (
        <div
            className={`controls_popupTemplate_theme-${props.theme} controls-ConfirmationTemplate
            ${getClassName()} ${getWidthClass()} controls-Popup__isolatedFocusingContext`}
            ws-tab-cycling="true"
            ref={forwardedRef}
            tabIndex={0}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            style={{ width: `${getWidth()}px` }}
            ws-delegates-tabfocus="true"
        >
            <div className={contentClassName}>
                <div
                    className={`controls-ConfirmationTemplate__marker controls-ConfirmationTemplate__marker__style-${getMarkerStyle()}`}
                    data-qa={`controls-ConfirmationTemplate__marker__style-${getMarkerStyle()}`}
                ></div>
                <div className="controls-ConfirmationTemplate__close-button">
                    {getCloseButton()}
                </div>
                <div
                    className={`controls-ConfirmationTemplate__main${
                        isAdaptive ? ' controls-ConfirmationTemplate__main_adaptive' : ''
                    }`}
                    data-qa="controls-ConfirmationTemplate__main"
                >
                    {getContentTemplate(props.bodyContentTemplate)}
                </div>
                <div
                    className={props.footerContentTemplate && footerClassName}
                    data-qa="controls-ConfirmationTemplate__footer"
                >
                    {getContentTemplate(props.footerContentTemplate)}
                </div>
            </div>
        </div>
    );
}

/**
 * @name Controls/_popupConfirmation/Template#details
 * @cfg {String} Текст дополнительного описания диалога.
 */

/**
 * @name Controls/_popupConfirmation/Template#message
 * @cfg {String} Текст сообщения диалога.
 */

/**
 * @name Controls/_popupConfirmation/Template#closeButtonViewMode
 * @cfg {String} Определяет режим отображения кнопки закрытия диалога.
 * @variant toolButton
 * @variant linkButton
 * @variant functionalButton
 * @default linkButton
 */

/**
 * @name Controls/_popupConfirmation/Template#closeButtonVisible
 * @cfg {Boolean} Определяет отображение кнопки закрытия диалога.
 * @default false
 */

/**
 * @name Controls/_popupConfirmation/Template#markerStyle
 * @cfg {String} Стиль отображения окна диалога.
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant primary
 * @variant default
 * @variant info
 * @variant warning
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
