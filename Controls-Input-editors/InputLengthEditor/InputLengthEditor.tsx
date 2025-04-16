import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IInputLengthEditorProps extends IPropertyGridPropertyEditorProps<number | undefined> {
    titlePosition?: string;
}

export const InputLengthEditor = memo((props: IInputLengthEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    // Нужен чтобы при уничтожении редактора перезаписать состояние, если ничего не ввели
    const currentValue = useRef(value);
    currentValue.current = value;
    const [showInput, setShowInput] = useState(() => {
        return !!(value);
    });

    useEffect(() => {
        return () => {
            if (!currentValue.current) {
                onChange(null);
            }
        };
    }, []);

    useEffect(() => {
        if (typeof value === 'undefined' || value === null) {
            setShowInput(false);
        }
    }, [value]);

    const onMaxValueChanged = (res) => {
        return onChange(Number(res) || 0);
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        onChange(null);
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
                        {rk('до')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs Controls-Input-editors_InputLengthEditor__value-to"
                            value={value}
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
