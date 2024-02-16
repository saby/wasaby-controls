import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IValue {
    maxLength?: number;
    minLength?: number;
}

interface IInputLengthEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    titlePosition?: string;
}

export const InputLengthEditor = memo((props: IInputLengthEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    // Нужен чтобы при уничтожении редактора перезаписать состояние, если ничего не ввели
    const currentValue = useRef(value);
    currentValue.current = value;
    const [showInput, setShowInput] = useState(() => {
        return !!(value?.minLength || value?.maxLength);
    });

    useEffect(() => {
        return () => {
            if (!(currentValue.current?.minLength || currentValue.current?.maxLength)) {
                onChange({});
            }
        };
    }, []);

    useEffect(() => {
        if (typeof value.minLength === 'undefined' && typeof value.maxLength === 'undefined') {
            setShowInput(false);
        }
    }, [value.maxLength, value.minLength]);

    const onMinValueChanged = (_, res) => {
        return onChange({ ...value, minLength: Number(res) || 0 });
    };
    const onMaxValueChanged = (_, res) => {
        return onChange({ ...value, maxLength: Number(res) || 0 });
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        if (!res) {
            onChange({});
        } else {
            onChange({ minLength: undefined, maxLength: undefined });
        }
    };

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <div className="tw-flex tw-w-full tw-items-baseline">
                <CheckboxControl
                    value={showInput}
                    viewMode="outlined"
                    onValueChanged={onValueChanged}
                    customEvents={['onValueChanged']}
                    caption={rk('Количество символов')}
                    className="controls-Input_negativeOffset controls-margin_right-xs"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <>
                        {' ' + rk('от')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs controls-margin_right-xs"
                            value={value.minLength}
                            onlyPositive={true}
                            precision={0}
                            onValueChanged={onMinValueChanged}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('до')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs"
                            value={value.maxLength}
                            onlyPositive={true}
                            precision={0}
                            onValueChanged={onMaxValueChanged}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                    </>
                )}
            </div>
        </LayoutComponent>
    );
});
