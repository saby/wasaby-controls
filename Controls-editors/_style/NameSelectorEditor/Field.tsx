import { useMemo, useRef, useCallback, ReactElement } from 'react';
import { Field as InputField, TextViewModel } from 'Controls/input';
import { useValidation } from 'Controls-Input/validators';
import { debounce } from 'Types/function';
import { FocusRoot } from 'UICore/Focus';

export type Validator = (valueObj: { value: string }) => boolean | string;

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
}: IFieldProps): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLElement>(null);
    const valueRef = useRef<string>(value);
    const viewModel = useRef<TextViewModel>();

    if (!viewModel.current) {
        viewModel.current = new TextViewModel({}, value);
    }

    const attrs = useMemo(() => {
        return {
            placeholder,
        };
    }, [placeholder]);

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
        },
        [onChange, validateDebounced]
    );

    return (
        <FocusRoot
            ref={containerRef}
            as="div"
            autofocus={autofocus}
            className={`tw-w-full controls-fontsize-${fontSize} controls-fontweight-${
                bold ? 'bold' : 'normal'
            }`}
        >
            {
                // @ts-ignore
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
            }
        </FocusRoot>
    );
}
