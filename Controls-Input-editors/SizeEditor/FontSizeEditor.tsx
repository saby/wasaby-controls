import { Fragment, memo, useState } from 'react';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface ISizeEditorProps extends IPropertyGridPropertyEditorProps<Number> {
    titlePosition?: string;
}

export const FontSizeEditor = memo((props: ISizeEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [inputValue, setInputValue] = useState<number | undefined>(() => {
        return value ? value : undefined;
    });

    const onValueChanged = (result: number) => {
        setInputValue(result);
    };
    const onInputCompleted = () => {
        onChange(inputValue);
    };

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInputValue(14);
        onChange(14);
    };

    return (
        <LayoutComponent title=" ">
            <div className="tw-flex tw-align-baseline">
                <NumberInputControl
                    className="controls-margin_left-s controls-Input__width-4ch"
                    value={inputValue}
                    placeholder="14"
                    onClick={onClickHandler}
                    onValueChanged={onValueChanged}
                    onInputCompleted={onInputCompleted}
                />
            </div>
        </LayoutComponent>
    );
});
