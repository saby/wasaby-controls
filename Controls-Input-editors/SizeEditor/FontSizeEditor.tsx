import { Fragment, memo, useState } from 'react';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface ISizeEditorProps extends IPropertyGridPropertyEditorProps<Number> {
    titlePosition?: string;
}

export const FontSizeEditor = memo((props: ISizeEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [inputValue, setInputValue] = useState<number | null>(() => {
        return value ? value : null;
    });

    const onValueChanged = (result: number) => {
        setInputValue(result);
    };
    const onInputCompleted = () => {
        let correctValue = inputValue;
        if (correctValue) {
            correctValue = Math.max(correctValue, 12);
            correctValue = Math.min(correctValue, 20);
        }
        onChange(correctValue);
    };

    return (
        <LayoutComponent title=" ">
            <div className="tw-flex tw-align-baseline">
                <NumberInputControl
                    className="controls-margin_left-s controls-Input__width-4ch"
                    value={inputValue}
                    placeholder="14"
                    onValueChanged={onValueChanged}
                    onInputCompleted={onInputCompleted}
                />
            </div>
        </LayoutComponent>
    );
});
