import { Fragment, memo, useState, useEffect } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface ILengthEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | undefined;
    className?: string;
    title?: string;
    options: {
        afterInputText?: string;
        captionCheckBox?: string;
    };
}

export const LengthEditor = memo((props: ILengthEditorProps) => {
    const {options, type, value, onChange, LayoutComponent = Fragment, className} = props;
    const [showInput, setShowInput] = useState(() => {
        return typeof value !== 'undefined' && value !== null;
    });

    useEffect(() => {
        setShowInput(typeof value !== 'undefined' && value !== null);
    }, [value]);

    const onInput = (inputValue: number) => {
        return onChange(inputValue || 0);
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        onChange(res ? 1 : undefined);
    };

    return (
        <LayoutComponent title={type.getTitle()}>
            <div className="tw-flex tw-items-baseline controls-Input_negativeOffset">
                <CheckboxControl
                    onValueChanged={onValueChanged}
                    value={showInput}
                    customEvents={['onValueChanged']}
                    viewMode="outlined"
                    caption={options.captionCheckBox}
                    className={className || ''}
                    data-qa="controls-PropertyGrid__editor_length-checkbox"
                />
                {showInput && (
                    <>
                        <NumberInputControl
                            className="controls-Input__width-4ch controls-margin_left-xs tw-self-center"
                            onlyPositive={true}
                            precision={0}
                            value={value}
                            valueChangedCallback={onInput}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {options.afterInputText && (
                            <span className="controls-margin_left-xs">{options.afterInputText}</span>
                        )}
                    </>
                )}
            </div>
        </LayoutComponent>
    );
});
