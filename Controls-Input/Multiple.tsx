/**
 * @kaizen_zone b17aaed8-a101-4de4-99ec-d981aa0d75f0
 */
import { forwardRef, ReactElement, useState, useCallback } from 'react';
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
     * Опции, которые будут переданы в поле.
     * @remark Для проверки корректности введённых данных нужно передать массив функций-валидаторов в поле validators.
     * @example
     * <pre>
     *     const lengthValidator = (val: string): string | boolean => {
     *         if (val.length > 10) {
     *              return 'Максимальное количество символов - 10';
     *         }
     *         return true;
     *     }
     *
     *     const inputSettings = [
     *         ...,
     *         {
     *             component: Text,
     *             componentProps: {
     *                 validators: [lengthValidator]
     *             }
     *         }
     *     ]
     *
     *     <Controller content={useContent(() => <Multiple inputSettings={inputSettings} />, [])} />
     * </pre>
     * @demo Controls-Input-demo/Multiple/ValidationStatus/Index
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
     * Функция-обработчик, вызывающаяся при уходе фокуса из объединённого поля ввода
     */
    onBlur?: (e: Event) => void;
}

const InputContent = (props: any) => (
    <>
        {props.index !== 0 && <span className="Controls-Input-Multiple__separator" />}
        <props.component
            forwardedRef={props.$wasabyRef}
            {...(props.componentProps || {})}
            className={`tw-flex-grow ${props.componentProps?.className ?? ''}`}
            fontSize={props.fontSize}
            inlineHeight={props.inlineHeight}
            contrastBackground={false}
            readOnly={props.readOnly}
            customEvents={['onValueChanged']}
            onValueChanged={useWasabyEventObject((...args) => {
                props.componentProps?.onValueChanged?.(...args);
                props?.onValueChanged?.(...args);
                props.setValidationStatus?.('valid');
            })}
        />
    </>
);

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
    const [validationStatus, setValidationStatus] = useState<TMultipleValidationStatus>('valid');
    const handleChangeValidationStatus = useCallback((status: TMultipleValidationStatus) => {
        if (status) {
            setValidationStatus('invalid');
        }
    }, []);
    const attrs = wasabyAttrsToReactDom(props.attrs || {}) || {};

    const GetContent = useContent((inputProps) => {
        return <InputContent {...inputProps} />;
    });
    return (
        <div
            {...attrs}
            ref={ref}
            onBlur={props.onBlur}
            data-qa={props.dataQa || props['data-qa']}
            className={`Controls-Input-Multiple Controls-Input-Multiple_${
                !readOnly ? 'enabled' : 'disabled'
            }${
                contrastBackground ? ' Controls-Input-Multiple_contrast' : ''
            } Controls-Input-Multiple_${validationStatus} ${props.className}`}
        >
            {props.inputSettings.map((inputSetting, index) => {
                const inputFieldReadOnly =
                    inputSetting.readOnly || inputSetting.componentProps.readOnly || readOnly;
                return inputSetting.componentProps?.validators ? (
                    <InputContainer
                        {...inputSetting}
                        onValidateFinished={handleChangeValidationStatus}
                        setValidationStatus={setValidationStatus}
                        validateOnFocusOut={false}
                        key={'input' + index}
                        validators={inputSetting.componentProps?.validators}
                        fontSize={fontSize}
                        inlineHeight={inlineHeight}
                        index={index}
                        content={GetContent}
                        readOnly={inputFieldReadOnly}
                    />
                ) : (
                    <GetContent
                        {...inputSetting}
                        key={'input' + index}
                        fontSize={fontSize}
                        inlineHeight={inlineHeight}
                        index={index}
                        setValidationStatus={setValidationStatus}
                        readOnly={inputFieldReadOnly}
                    />
                );
            })}
        </div>
    );
});
