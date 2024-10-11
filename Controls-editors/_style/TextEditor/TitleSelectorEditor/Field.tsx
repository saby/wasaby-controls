import { useMemo, useRef } from 'react';
import { Field as InputField, TextViewModel } from 'Controls/input';

interface ISelectorFieldProps {
    value: string;
    placeholder?: string;
    onValueChanged: (event: unknown, selector: string) => void;
    onInputCompleted: (event: unknown, selector: string) => void;
    onFocus: (event: unknown) => void;
}

export function Field({
    value,
    placeholder = '',
    onValueChanged,
    onInputCompleted,
    onFocus,
}: ISelectorFieldProps): JSX.Element {
    const viewModel = useRef<TextViewModel>();

    if (!viewModel.current) {
        viewModel.current = new TextViewModel({}, value);
    }

    const selectorAttrs = useMemo(() => {
        return {
            size: value.length,
            placeholder,
        };
    }, [value, placeholder]);

    return (
        <InputField
            attrs={selectorAttrs}
            model={viewModel.current}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onValueChanged={onValueChanged}
            onInputCompleted={onInputCompleted}
            onFocus={onFocus}
        />
    );
}
