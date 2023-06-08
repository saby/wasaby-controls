/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { IConfirmationFooterOptions } from 'Controls/_popup/interface/IConfirmationFooter';
import { Button } from 'Controls/buttons';
import rk = require('i18n!Controls');

export interface IFooterOptions extends IControlProps, IConfirmationFooterOptions {}

/**
 * Базовый шаблон футера окна диалога.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupConfirmation/Footer
 * @implements Controls/interface:IControl
 * @implements Controls/popupConfirmation:IConfirmationFooter
 *
 * @public
 * @demo Controls-demo/PopupTemplate/Confirmation/Footer/Index
 */
function Footer(props: IFooterOptions): React.ReactElement {
    const getPrimaryActionButtonStyle = (): string => {
        switch (props.markerStyle) {
            case 'warning':
                return 'warning';
            case 'success':
                return 'success';
            case 'danger':
                return 'danger';
            case 'info':
                return 'info';
            default:
                return 'primary';
        }
    };

    const prepareData = () => {
        if (props.buttons) {
            return props.buttons;
        } else {
            if (props.type === 'ok') {
                return [
                    {
                        caption: props.okCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'yes'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: true,
                    },
                ];
            } else if (props.type === 'yesno') {
                return [
                    {
                        caption: props.yesCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'yes'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: true,
                    },
                    {
                        caption: props.noCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'no'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: false,
                    },
                ];
            } else if (props.type === 'yesnocancel') {
                return [
                    {
                        caption: props.yesCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'yes'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: true,
                    },
                    {
                        caption: props.noCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'no'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: false,
                    },
                    {
                        caption: props.cancelCaption,
                        viewMode: 'outlined',
                        buttonStyle:
                            props.primaryAction === 'cancel'
                                ? getPrimaryActionButtonStyle()
                                : 'secondary',
                        value: undefined,
                    },
                ];
            }
        }
    };

    const buttons = prepareData();

    const onResult = (value) => {
        if (props.onResult) {
            props.onResult(value);
        }
    };

    const getButtonElement = (button): React.ReactElement => {
        return (
            <Button buttonStyle={button.buttonStyle}
                    contrastBackground={button.contrastBackground}
                    fontColorStyle={button.fontColorStyle}
                    viewMode={button.viewMode || 'outlined'}
                    caption={button.caption}
                    readOnly={button.readOnly !== undefined ? button.readOnly : false}
                    ws-autofocus={button.buttonStyle === 'primary'}
                    data-qa={`controls-ConfirmationDialog__button-${button.value}`}
                    className='controls-ConfirmationDialog__button'
                    onClick={() => onResult(button.value)}
                    context={props.context}
            />
        );
    };

    return (
        <div className="controls-ConfirmationDialog__buttonContainer">
            {buttons.map((button, index) => {
                return (
                    <div
                        key={button.caption}
                        className={`controls-ConfirmationDialog__button-${
                            button.viewMode === 'link' ? 'link' : (buttons.length >= 3 ? 'mini' : 'standard')
                        }
                            ${index > 0 ? 'controls-ConfirmationDialog__no-cancel-button' : ''}`}
                    >
                        {getButtonElement(button)}
                    </div>
                );
            })}
        </div>
    );
}

Footer.defaultProps = {
    type: 'yesno',
    primaryAction: 'yes',
    yesCaption: rk('Да'),
    noCaption: rk('Нет'),
    cancelCaption: rk('Отмена'),
    okCaption: rk('ОК'),
};

export default Footer;
