import { memo, useCallback, useState } from 'react';
import { Area as InputArea } from 'Controls/input';
import { Title } from 'Controls/heading';
import * as rk from 'i18n!Controls-editors';

interface ITextCommentEditorProps {
    value: string;
    onChange: (newValue: string) => void;
}

const TITLE = rk('Комментарий');
const PLACEHOLDER = rk('Введите пояснение');

export const TextCommentEditor = memo(
    ({ value = '', onChange }: ITextCommentEditorProps): JSX.Element => {
        const [inputValue, setInputValue] = useState(value);

        const onInputCompleted = useCallback(
            (newValue: string) => {
                onChange(newValue);
            },
            [onChange]
        );

        return (
            <>
                <div className="controls-margin_bottom-2xs">
                    <Title
                        caption={TITLE}
                        fontWeight="bold"
                        fontColorStyle="default"
                        fontSize="m"
                    />
                </div>
                {/* @ts-ignore */}
                <InputArea
                    className="tw-w-full"
                    value={inputValue}
                    onInputCompleted={onInputCompleted}
                    onValueChanged={setInputValue}
                    placeholder={PLACEHOLDER}
                />
            </>
        );
    }
);
