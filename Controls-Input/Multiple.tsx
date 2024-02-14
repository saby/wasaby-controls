import { forwardRef, ReactElement } from 'react';
import {
    IContrastBackgroundOptions,
    IControlProps,
    IFontSizeOptions,
    IHeightOptions,
} from 'Controls/interface';
import { useReadonly, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Control } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls-Input/Multiple';

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

    return (
        <div
            {...attrs}
            ref={ref}
            className={`Controls-Input-Multiple Controls-Input-Multiple_${
                !readOnly ? 'enabled' : 'disabled'
            }${contrastBackground ? ' Controls-Input-Multiple_contrast' : ''} ${props.className}`}
        >
            {props.inputSettings.map((inputSetting, index) => {
                return (
                    <>
                        {index !== 0 && <span className="Controls-Input-Multiple__separator" />}
                        <inputSetting.component
                            {...(inputSetting.componentProps || {})}
                            className={`tw-flex-grow ${
                                inputSetting.componentProps?.className ?? ''
                            }`}
                            fontSize={fontSize}
                            inlineHeight={inlineHeight}
                            contrastBackground={false}
                            readOnly={readOnly}
                        />
                    </>
                );
            })}
        </div>
    );
});
