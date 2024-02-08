import { forwardRef, ReactElement, useCallback } from 'react';
import {
    IContrastBackgroundOptions,
    IControlProps,
    IFontSizeOptions,
    IHeightOptions,
} from 'Controls/interface';
import { useContent, useReadonly, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Control } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls-Input/Multiple';
import { InputContainer } from 'Controls/validate';
import { useWasabyEventObject } from 'UICore/Events';

/**
 * Интерфейс для настроек отображаемых полей, для контрола Controls-Input/Multiple
 * @public
 */
export interface IInputSetting {
    /**
     * Контрол, который будет отображен в поле
     */
    component: ReactElement | Control;
    /**
     * Опции, который будет переданы в поле
     */
    componentProps?: object;
}

export type TMultipleValidationStatus = 'valid' | 'invalid';

/**
 * Интерфейс для контрола Controls-Input/Multiple
 * @interface Controls-Input/Multiple/IMultipleProps
 * @public
 */
export interface IMultipleProps
    extends IControlProps,
        IFontSizeOptions,
        IHeightOptions,
        IContrastBackgroundOptions,
        TInternalProps {
    /**
     * Массив с настройкой, по которой будет строиться объединенное поле ввода
     */
    inputSettings: IInputSetting[];

    /**
     * @name Controls-Input/Multiple#validationStatus
     * @cfg {String} Статус валидации объединённого поля ввода
     * @variant valid
     * @variant invalid
     * @demo Controls-Input-demo/Multiple/ValidationStatus/Index
     */
    validationStatus?: TMultipleValidationStatus;

    /**
     * Функция-обработчик, вызывающаяся при уходе фокуса из объединённого поля ввода
     */
    onBlur?: (e: Event) => void;
}

/**
 * Компонент, позволяющий объединить несколько разных полей ввода в одно добавив разделители между ними
 * @class Controls-Input/Multiple
 *
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IContrastBackground
 * @implements Controls-Input/Multiple/IMultipleProps
 *
 * @demo Controls-Input-demo/Multiple/Index
 * @control
 * @public
 */
export default forwardRef(function Multiple(props: IMultipleProps, ref) {
    const { fontSize = 'm', inlineHeight = 'm', contrastBackground = false } = props;
    const readOnly = useReadonly(props);
    const attrs = wasabyAttrsToReactDom(props.attrs || {}) || {};
    const getContent = useCallback(
        (inputSetting, index) => {
            return useContent(
                (contentProps = {}) => {
                    return (
                        <>
                            {index !== 0 && <span className="Controls-Input-Multiple__separator" />}
                            <inputSetting.component
                                ref={contentProps.$wasabyRef}
                                {...(inputSetting.componentProps || {})}
                                className={`tw-flex-grow ${
                                    inputSetting.componentProps?.className ?? ''
                                }`}
                                fontSize={fontSize}
                                inlineHeight={inlineHeight}
                                contrastBackground={false}
                                readOnly={readOnly}
                                customEvents={['onValueChanged']}
                                onValueChanged={useWasabyEventObject((...args) => {
                                    inputSetting.componentProps?.onValueChanged?.(...args);
                                    contentProps?.onValueChanged?.(...args);
                                })}
                            />
                        </>
                    );
                },
                [inputSetting]
            );
        },
        [props]
    );

    return (
        <div
            {...attrs}
            ref={ref}
            onBlur={props.onBlur}
            className={`Controls-Input-Multiple Controls-Input-Multiple_${
                !readOnly ? 'enabled' : 'disabled'
            }${
                contrastBackground ? ' Controls-Input-Multiple_contrast' : ''
            } Controls-Input-Multiple_${props.validationStatus} ${props.className}`}
        >
            {props.inputSettings.map((inputSetting, index) => {
                const InputComponent = getContent(inputSetting, index);
                return props.validationStatus ? (
                    <InputContainer
                        validateOnFocusOut={false}
                        key={'input' + index}
                        validators={inputSetting.componentProps?.validators}
                        content={InputComponent}
                    />
                ) : (
                    <InputComponent key={'input' + index} />
                );
            })}
        </div>
    );
});
