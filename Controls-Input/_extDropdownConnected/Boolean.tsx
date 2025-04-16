import { useCallback, useEffect, useRef, useState } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { IComponentProps } from 'Controls/interface';
import { Toggle } from 'Controls/dropdown';
import { clearProps, useConnectedValue, useFormReadonly } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import {
    IInputDefaultValueOptions,
    ILabelOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getStyleProps } from 'Controls-Input/utils';

/**
 * Интерфейс, описывающий опции редактора типа "Логическое"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IMaskOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface IBooleanProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IValidateOptions,
        IComponentProps {}

/**
 * Редактор типа "Логическое", работающий со слайсом формы
 * @param {Controls-Input/extDropdownConnected:IBooleanProps} props Пропсы компонента
 * @public
 */
function Boolean(props: IBooleanProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [toggleValue, setToggleValue] = useState<boolean[]>([!!value]);
    const ref = useRef();
    const { resetValidation, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const onSelectedKeysChange = useCallback((result) => {
        resetValidation();
        setToggleValue(result);
        onChange(result?.[0]);
    }, []);

    useEffect(() => {
        setToggleValue([!!value]);
    }, [value]);
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const styleProps = getStyleProps(props);
    const readOnly = useFormReadonly(props.name);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            // @ts-ignore
            value={toggleValue}
            label={props.label}
            className={classes}
            fontSize={styleProps.fontSize}
        >
            <Toggle
                ref={(target) => {
                    ref.current = target;
                }}
                selectedKeys={toggleValue}
                // @ts-ignore
                onSelectedKeysChange={onSelectedKeysChange}
                validationStatus={validationStatus}
                {...clearProps(props)}
                {...styleProps}
                readOnly={readOnly}
            />
        </InputLabel>
    );
}

Boolean.displayName = 'Controls-Input/extDropdownConnected:Boolean';
export { Boolean };
