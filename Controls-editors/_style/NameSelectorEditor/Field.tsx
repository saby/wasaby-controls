import { useMemo, useRef, useCallback, useState } from 'react';
import { Field as InputField, TextViewModel } from 'Controls/input';
import { useValidation } from 'Controls-Input/validators';
import { debounce } from 'Types/function';
import { FocusRoot } from 'UICore/Focus';

export type Validator = (valueObj: { value: string }) => boolean | string;

const MAX_SIZE = 50;
const VALIDATION_DELAY = 1000;

interface IFieldProps {
    autofocus?: boolean;
    bold?: boolean;
    fontSize: string;
    name: string;
    placeholder?: string;
    storeId: string;
    validators: Validator[];
    value: string;
    onChange: (newValue: string) => void;
    className?: string;
}

export function Field({
    autofocus = false,
    bold = false,
    fontSize,
    name,
    placeholder = '',
    storeId,
    validators,
    value = '',
    onChange,
    className,
}: IFieldProps): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLElement>(null);
    const valueRef = useRef<string>(value);
    const viewModel = useRef<TextViewModel>();
    const [size, setSize] = useState<number>(Math.min(value.length, MAX_SIZE));

    if (!viewModel.current) {
        viewModel.current = new TextViewModel({}, value);
    }

    const attrs = useMemo(() => {
        return {
            size,
            placeholder,
        };
    }, [size, placeholder]);

    const valueValidators: (() => boolean | string)[] = useMemo(() => {
        return validators.map((validator) => () => validator({ value: valueRef.current }));
    }, [validators]);

    const path = useMemo(() => [storeId, name], [storeId, name]);
    const { onFocus, validate } = useValidation(path, valueValidators, containerRef);
    const validateDebounced = useMemo(() => debounce(validate, VALIDATION_DELAY), [validate]);
    const onValueChanged = useCallback(
        (_, newValue: string) => {
            valueRef.current = newValue;
            onChange(newValue);
            validateDebounced();
            setSize(Math.min(newValue.length, MAX_SIZE));
        },
        [onChange, validateDebounced]
    );

    return (
        <FocusRoot
            ref={containerRef}
            as="div"
            autofocus={autofocus}
            className={`controls-fontsize-${fontSize} controls-fontweight-${
                bold ? 'bold' : 'normal'
            }`}
        >
            <InputField
                fieldRef={fieldRef}
                attrs={attrs}
                model={viewModel.current}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onValueChanged={onValueChanged}
                onFocus={onFocus}
                className={className}
            />
        </FocusRoot>
    );
}
