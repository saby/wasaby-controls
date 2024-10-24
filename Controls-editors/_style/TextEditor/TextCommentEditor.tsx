import { memo, useCallback } from 'react';
import { Area as InputArea } from 'Controls/input';
import { Title } from 'Controls/heading';
import { useInputEditorValue } from 'Controls-editors/input';
import * as rk from 'i18n!Controls-editors';

interface ITextCommentEditorProps {
    value: string;
    onChange: (newValue: string) => void;
    inputClass?: string;
}

const TITLE = rk('Комментарий');
const PLACEHOLDER = rk('Введите пояснение');

export const TextCommentEditor = memo(
    ({ value = '', inputClass = '', onChange }: ITextCommentEditorProps): JSX.Element => {
        const { localValue, changeHandler } = useInputEditorValue({ value });

        const onInputCompleted = useCallback(
            (newValue: string) => {
                onChange(newValue);
            },
            [onChange]
        );

        return (
            <>
                <div className="controls-margin_bottom-st">
                    <Title
                        caption={TITLE}
                        fontWeight="bold"
                        fontColorStyle="default"
                        fontSize="m"
                    />
                </div>
                <div className={inputClass}>
                    {/* @ts-ignore */}
                    <InputArea
                        className="tw-w-full"
                        value={localValue}
                        onInputCompleted={onInputCompleted}
                        onValueChanged={changeHandler}
                        placeholder={PLACEHOLDER}
                    />
                </div>
            </>
        );
    }
);
