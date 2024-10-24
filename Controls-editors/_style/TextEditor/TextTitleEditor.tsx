import { memo, useCallback, useMemo, useRef } from 'react';
import { Field, Render, TextViewModel } from 'Controls/input';
import * as rk from 'i18n!Controls-editors';

interface ITextTypeEditorProps {
    name: string;
    selector: string;
    onChange: (name: string, selector: string) => void;
}

const PLACEHOLDER = rk('Название');

export const TextTitleEditor = memo(({ selector, name, onChange }: ITextTypeEditorProps) => {
    const nameViewModel = useRef<TextViewModel>();
    const selectorViewModel = useRef<TextViewModel>();

    if (!nameViewModel.current) {
        nameViewModel.current = new TextViewModel({}, name);
    }

    if (!selectorViewModel.current) {
        selectorViewModel.current = new TextViewModel({}, selector);
    }

    const onNameChange = useCallback(
        (_, newName) => {
            onChange(newName, selector);
        },
        [onChange, selector]
    );

    const onSelectorChange = useCallback(
        (_, newSelector) => {
            onChange(name, newSelector);
        },
        [name, onChange]
    );

    const nameAttrs = useMemo(() => {
        return {
            size: name.length,
            placeholder: PLACEHOLDER,
        };
    }, [name]);

    const selectorAttrs = useMemo(() => {
        return {
            size: selector.length,
        };
    }, [selector]);

    return (
        <Render className="tw-w-full" fontSize="3xl" inlineHeight="l">
            <>
                <div className="tw-self-center">
                    {/* @ts-ignore */}
                    <Field
                        attrs={nameAttrs}
                        model={nameViewModel.current}
                        onValueChanged={onNameChange}
                        onInputCompleted={onNameChange}
                    />
                </div>
                <div className="TextTitleEditor__separator tw-self-center"></div>
                <div className="controls-fontweight-default tw-self-center">
                    {/* @ts-ignore */}
                    <Field
                        attrs={selectorAttrs}
                        model={selectorViewModel.current}
                        onValueChanged={onSelectorChange}
                        onInputCompleted={onSelectorChange}
                    />
                </div>
            </>
        </Render>
    );
});
