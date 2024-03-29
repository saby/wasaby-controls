import { Fragment, memo, useState } from 'react';
import { getArgs } from 'UICore/Events';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface ILengthEditorProps extends IPropertyEditorProps<boolean> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: boolean | undefined;
    className?: string;
    title?: string;
    options: {
        afterInputText?: string;
        captionCheckBox?: string;
    };
}

export const LengthEditor = memo((props: ILengthEditorProps) => {
    const {
        options,
        type,
        value,
        onChange,
        LayoutComponent = Fragment,
        className,
    } = props;
    const [showInput, setShowInput] = useState(false);

    const onInput = (e) => {
        return onChange(Number(e.target.value) || 0);
    };
    const onValueChanged = (event) => {
        const [e, value] = getArgs(event);
        setShowInput(value);
        if (!value) {
            onChange(undefined);
        }
    };

    return (
        <LayoutComponent title={type.getTitle()}>
            <CheckboxControl
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                viewMode="outlined"
                caption={options.captionCheckBox}
                className={className || ''}
            />
            {showInput && (
                <>
                    <NumberInputControl
                        className="controls-Input__width-4ch controls-margin_left-xs"
                        value={value}
                        onInput={onInput}
                    />
                    {options.afterInputText && (
                        <span className="controls-margin_left-xs">
                            {options.afterInputText}
                        </span>
                    )}
                </>
            )}
        </LayoutComponent>
    );
});
