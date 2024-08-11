import { memo, useCallback, useMemo, useRef } from 'react';
import { Field, Render, TextViewModel } from 'Controls/input';
import * as rk from 'i18n!Controls-editors';

interface ITextTypeEditorProps {
    name: string;
    keyName: string;
    onChange: (name: string) => void;
}

const PLACEHOLDER = rk('Название');

export const TextTitleEditor = memo(({ keyName, name, onChange }: ITextTypeEditorProps) => {
    const viewModel = useRef<TextViewModel>();

    if (!viewModel.current) {
        viewModel.current = new TextViewModel({}, name);
    }

    const onChangeCallback = useCallback(
        (_, newName) => {
            onChange(newName);
        },
        [onChange]
    );

    const attrs = useMemo(() => {
        return {
            size: name.length,
            placeholder: PLACEHOLDER,
        };
    }, [name]);

    return (
        <Render className="tw-w-full" fontSize="3xl" inlineHeight="l">
            <>
                <div className="tw-self-center">
                    {/* @ts-ignore */}
                    <Field
                        attrs={attrs}
                        size={name.length}
                        model={viewModel.current}
                        onValueChanged={onChangeCallback}
                        onInputCompleted={onChangeCallback}
                    />
                </div>
                <div className="TextTitleEditor__separator tw-self-center"></div>
                <div className="controls-fontweight-default tw-self-center">{keyName}</div>
            </>
        </Render>
    );
});
