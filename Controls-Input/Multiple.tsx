/**
 * @kaizen_zone b17aaed8-a101-4de4-99ec-d981aa0d75f0
 */
import {
    forwardRef,
    ReactElement,
    useState,
    useCallback,
    MouseEvent,
    useRef,
    FocusEventHandler,
    LegacyRef,
} from 'react';
import {
    IContrastBackgroundOptions,
    IComponentPropsWithReadonly,
    IFontSizeOptions,
    IHeightOptions,
} from 'Controls/interface';
import { useContent, useReadonly, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Control } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls-Input/Multiple';
import { InputContainer } from 'Controls/validate';
import { useWasabyEventObject } from 'UICore/Events';
import { importer, lazy } from 'UI/Async';
import { ITagOptions } from 'Controls/input';

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
    extends IComponentPropsWithReadonly,
        IFontSizeOptions,
        IHeightOptions,
        ITagOptions,
        IContrastBackgroundOptions,
        TInternalProps {
    /**
     * Массив с настройкой, по которой будет строиться объединенное поле ввода
     */
    inputSettings: IInputSetting[];
    /**
     * Функция-обработчик, вызывающаяся при уходе фокуса из объединённого поля ввода
     */
    onBlur?: FocusEventHandler;
}

const TagTemplate = lazy(() => importer('Controls/Application/TagTemplate/TagTemplateReact'));

function InputContent(props: any) {
    return (
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
}

/**
 * Компонент, позволяющий объединить несколько разных полей ввода в одно добавив разделители между ними
 * @class Controls-Input/Multiple
 *
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITag
 * @implements Controls/interface:IContrastBackground
 * @implements Controls-Input/Multiple/IMultipleProps
 *
 * @demo Controls-Input-demo/Multiple/Index
 * @control
 * @public
 */
export default forwardRef(function Multiple(props: IMultipleProps, ref: LegacyRef<HTMLDivElement>) {
    const { fontSize = 'm', inlineHeight = 'm', contrastBackground = false } = props;
    const readOnly = useReadonly(props);
    const [validationStatus, setValidationStatus] = useState<TMultipleValidationStatus>('valid');
    const handleChangeValidationStatus = useCallback((status: TMultipleValidationStatus) => {
        if (status) {
            setValidationStatus('invalid');
        }
    }, []);

    const tag = useRef(null);
    const tagClickHandler = useCallback(
        (event: MouseEvent<HTMLElement>): void => {
            props.onTagClick?.(event, tag.current as unknown as HTMLElement);
        },
        [props.onTagClick, tag]
    );
    const tagHoverHandler = useCallback(
        (event: MouseEvent<HTMLElement>): void => {
            props.onTagHover?.(event, tag.current as unknown as HTMLElement);
        },
        [props.onTagHover, tag]
    );

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
                        // eslint-disable-next-line react/no-array-index-key
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
                        // eslint-disable-next-line react/no-array-index-key
                        key={'input' + index}
                        fontSize={fontSize}
                        inlineHeight={inlineHeight}
                        index={index}
                        setValidationStatus={setValidationStatus}
                        readOnly={inputFieldReadOnly}
                    />
                );
            })}
            {props.tagStyle && (
                <TagTemplate
                    tagStyle={props.tagStyle}
                    className="controls-Render_tag_padding-right-empty"
                    ref={tag}
                    onClick={tagClickHandler}
                    onMouseEnter={tagHoverHandler}
                />
            )}
        </div>
    );
});

/**
 * @name Controls-Input/Multiple#tagStyle
 * @cfg
 * @demo Controls-Input-demo/Multiple/TagStyle/Index
 */
