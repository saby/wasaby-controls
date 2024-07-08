import { Fragment, memo, useState, useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

type TValue = number | null;

interface ISizeEditorProps extends IPropertyGridPropertyEditorProps<TValue> {
    titlePosition?: string;
    minValue?: number;
    maxValue?: number;
}

function normalizeValue(value: TValue, props: ISizeEditorProps): TValue {
    let rValue = value;
    if (rValue === null) {
        rValue = props.metaType?.getDefaultValue();
    }
    return rValue;
}

function correctValue(value: TValue, props: ISizeEditorProps): TValue {
    if (value === null) {
        return value;
    }
    let correctedValue = value;
    if (typeof props.minValue === 'number') {
        correctedValue = Math.max(correctedValue, props.minValue);
    }
    if (typeof props.maxValue === 'number') {
        correctedValue = Math.min(correctedValue, props.maxValue);
    }
    return correctedValue;
}

function increaseValue(
    value: TValue,
    props: ISizeEditorProps,
    delta: number,
    setInputValue: Function,
    onChange: Function
) {
    let newValue = normalizeValue(value, props);
    if (newValue === null) {
        return;
    }
    newValue = correctValue(newValue + delta, props);
    setInputValue(newValue);
    onChange(newValue);
}

export const FontSizeEditor = memo((props: ISizeEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [inputValue, setInputValue] = useState<TValue>(() => {
        return value ? value : null;
    });

    const onValueChanged = (result: number) => {
        setInputValue(result);
    };
    const onInputCompleted = () => {
        onChange(correctValue(inputValue, props));
    };

    const onMinusClicked = useCallback(() => {
        increaseValue(inputValue, props, -1, setInputValue, onChange);
    }, [inputValue, onChange, props.minValue, props.maxValue, props.metaType]);

    const onPlusClicked = useCallback(() => {
        increaseValue(inputValue, props, 1, setInputValue, onChange);
    }, [inputValue, onChange, props.minValue, props.maxValue, props.metaType]);

    const layoutProps: { title?: string } = {};
    if (!props.metaType.getTitle()) {
        layoutProps.title = ' ';
    }

    return (
        <LayoutComponent {...layoutProps}>
            <div className="tw-flex tw-align-baseline">
                <NumberInputControl
                    className="controls-margin_left-s controls-Input__width-3ch"
                    value={inputValue}
                    placeholder={props.metaType.getDefaultValue() || '14'}
                    onValueChanged={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    rightFieldTemplate={<span className="controls-text-unaccented">px</span>}
                />
                <Button
                    className="controls-margin_left-s"
                    buttonStyle="pale"
                    viewMode="filled"
                    iconSize="2xs"
                    icon="icon-Subtraction"
                    fontSize="xs"
                    fontColorStyle="unaccented"
                    onClick={onMinusClicked}
                />
                <Button
                    className="controls-margin_left-2xs"
                    buttonStyle="pale"
                    viewMode="filled"
                    iconSize="2xs"
                    icon="icon-RoundPlus"
                    fontSize="xs"
                    fontColorStyle="unaccented"
                    onClick={onPlusClicked}
                />
            </div>
        </LayoutComponent>
    );
});
