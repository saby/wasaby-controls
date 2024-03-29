/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { createElement, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Logger } from 'UICommon/Utils';
import { constants } from 'Env/Env';
import { Converter as MarkupConverter } from 'Controls/markup';
import Template from '../Template';
import ContentTemplate from './Dialog/Content';
import MessageTemplate from './Dialog/Message';
import DetailsTemplate from './Dialog/Details';
import Footer from '../Footer';
import rk = require('i18n!Controls');

const MAX_MESSAGE_LENGTH = 100;
const MAX_DETAILS_LENGTH = 160;

/**
 * Класс контрола "Окно подтверждения". В зависимости от типа, может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
 * @class Controls/_popupConfirmation/Opener/Dialog
 *
 * @private
 * @mixes Controls/_popupConfirmation/Opener/Dialog/DialogStyles
 * @demo Controls-demo/Popup/Confirmation/Template
 */

function Dialog(props): React.ReactElement {
    const [isEscDown, setIsEscDown] = React.useState(false);
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
        return () => {
            props.closeHandler();
        };
    }, []);

    const sendResult = (result: boolean): void => {
        if (props.closeHandler) {
            props.closeHandler(result);
        }
        if (props.onClose) {
            props.onClose();
        }
    };

    const sendResultHandler = (result: boolean): void => {
        sendResult(result);
    };

    const keyDownHandler = (event: Event): void => {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            setIsEscDown(true);
        }
        if (
            !(event.nativeEvent.altKey || event.nativeEvent.shiftKey) &&
            (event.nativeEvent.ctrlKey || event.nativeEvent.metaKey) &&
            event.nativeEvent.keyCode === constants.key.enter
        ) {
            // Ctrl+Enter, Cmd+Enter, Win+Enter
            // If "primary action" processed event, then event must be stopped.
            // Otherwise, parental controls (including other primary action)
            // can react to pressing ctrl+enter and call one more handler
            event.stopPropagation();
            onTriggerHandler();
        }
    };

    const keyPressedHandler = (event: Event): void => {
        if (isEscDown) {
            setIsEscDown(false);
            if (event.nativeEvent.keyCode === constants.key.esc) {
                // for 'ok' and 'yesnocancel' type value equal undefined
                const result = props.type === 'yesno' ? false : undefined;
                sendResult(result);
                event.stopPropagation();
            }
        }
    };

    const getMessage = (): string => {
        if (hasMarkup()) {
            Logger.error(
                'Confirmation: В тексте сообщения присутствует ссылка. Вывод html-тегов должен реализовываться через задание шаблона.',
                this
            );
            return MarkupConverter.htmlToJson(
                '<span>' + props.message + '</span>'
            );
        }
        return props.message;
    };

    const getSize = (): string => {
        if (props.size) {
            return props.size;
        }
        if (
            (props.message && props.message.length) > MAX_MESSAGE_LENGTH ||
            (props.details && props.details.length) > MAX_DETAILS_LENGTH
        ) {
            return 'l';
        }
        return 'm';
    };

    const hasMarkup = (): boolean => {
        const message = props.message;
        return (
            typeof message === 'string' &&
            message.indexOf('<a') > -1 &&
            message.indexOf('</a>') > -1
        );
    };

    const onTriggerHandler = (): boolean => {
        if (props.primaryAction === 'no') {
            sendResult(false);
        } else {
            sendResult(true);
        }
    };

    const getBodyContentTemplate = (): React.ReactElement => {
        return createElement(ContentTemplate, {
            message: getMessage(),
            messageOptions: props.messageOptions,
            hasMarkup: hasMarkup(),
            messageTemplate: MessageTemplate,
            details: props.details,
            detailsOptions: props.detailsOptions,
            detailsTemplate: DetailsTemplate,
        });
    };

    const getFooterContentTemplate = (): React.ReactElement => {
        return (
            <Footer
                type={props.type}
                buttons={props.buttons}
                yesCaption={props.yesCaption}
                noCaption={props.noCaption}
                cancelCaption={props.cancelCaption}
                okCaption={props.okCaption}
                markerStyle={
                    props.style || props.borderStyle || props.markerStyle
                }
                primaryAction={props.primaryAction}
                onResult={sendResultHandler}
            />
        );
    };

    return (
        <Template
            $wasabyRef={props.$wasabyRef}
            onKeyDown={keyDownHandler}
            onClose={props.onClose}
            onResult={props.onResult}
            onKeyUp={keyPressedHandler}
            className={props.attrs.className}
            theme={props.theme}
            markerStyle={props.markerStyle}
            borderStyle={props.style || props.borderStyle}
            closeButtonVisible={props.closeButtonVisible}
            width={props.width}
            size={getSize()}
            bodyContentTemplate={getBodyContentTemplate()}
            footerContentTemplate={getFooterContentTemplate()}
        />
    );
}

Dialog.defaultProps = {
    type: 'yesno',
    markerStyle: 'default',
    primaryAction: 'yes',
    yesCaption: rk('Да'),
    noCaption: rk('Нет'),
    cancelCaption: rk('Отмена'),
    okCaption: rk('ОК'),
};

Dialog.isReact = true;

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#type
 * @cfg {String} Тип диалога
 * @variant ok Диалог с кнопкой "Ок"
 * @variant yesno Диалог с кнопками "Да" и "Нет"
 * @variant yesnocancel Диалог с кнопками "Да", "Нет" и "Отмена"
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#markerStyle
 * @cfg {string} Стиль маркера.
 * @variant default
 * @variant success
 * @variant danger
 * @variant secondary
 * @variant warning
 * @variant info
 * @variant none
 * @default default
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#message
 * @cfg {String} Устанавливает сообщение
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#details
 * @cfg {String} Устанавливает детали сообщения
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#yesCaption
 * @cfg {String} Устанавливает текст кнопки yes
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#noCaption
 * @cfg {String} Устанавливает текст кнопки no
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#cancelCaption
 * @cfg {String} Устанавливает текст кнопки cancel
 */

/**
 * @name Controls/_popupConfirmation/Opener/Dialog#okCaption
 * @cfg {String} Устанавливает текст кнопки ok
 */

/**
 * @typedef {Boolean|undefined} Result
 * @remark
 * true - Нажата кнопка "Да"
 * false - Нажата кнопка "Нет"
 * undefined - Нажата кнопка "ОК" или "Отмена"
 */

/**
 * @event Происходит при нажатии на кнопку диалога.
 * @name Controls/_popupConfirmation/Opener/Dialog#sendResult
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события
 * @param {Result} Результат
 */

export default Dialog;
