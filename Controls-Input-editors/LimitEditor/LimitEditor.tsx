import { Fragment, memo, useEffect, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IValue {
    maxValue?: number;
    minValue?: number;
}

interface ILimitEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    titlePosition?: string;
}

export const LimitEditor = memo((props: ILimitEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [showInput, setShowInput] = useState(() => {
        return !!(value?.minValue || value?.maxValue);
    });

    useEffect(() => {
        setShowInput(!!(value?.minValue || value?.maxValue));
    }, [value.maxValue, value.minValue]);

    const onMinValueChanged = (_, result) => {
        return onChange({ ...value, minValue: Number(result) || 0 });
    };
    const onMaxValueChanged = (_, result) => {
        return onChange({ ...value, maxValue: Number(result) || 0 });
    };
    const onInputCompleted = () => {
        if (value.minValue > value.maxValue) {
            onChange({ maxValue: value.minValue, minValue: value.maxValue });
        }
    };
    const onValueChanged = (result) => {
        setShowInput(result);
        if (!result) {
            onChange(undefined);
        } else {
            onChange({ minValue: 0, maxValue: 99999.99 });
        }
    };

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                className="controls-Input_negativeOffset"
                customEvents={['onValueChanged']}
                caption={
                    <div>
                        {rk('Диапазон значений')}{' '}
                        {showInput && (
                            <div className="tw-flex tw-items-baseline">
                                {' ' + rk('от')}
                                <NumberInputControl
                                    className="controls-margin_left-xs controls-margin_right-xs controls-Input__width-9ch"
                                    value={value.minValue}
                                    onClick={onClickHandler}
                                    onValueChanged={onMinValueChanged}
                                    onInputCompleted={onInputCompleted}
                                />
                                {rk('до')}
                                <NumberInputControl
                                    className="controls-margin_left-xs controls-Input__width-9ch"
                                    value={value.maxValue}
                                    onClick={onClickHandler}
                                    onValueChanged={onMaxValueChanged}
                                    onInputCompleted={onInputCompleted}
                                />
                            </div>
                        )}
                    </div>
                }
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
        </LayoutComponent>
    );
});
