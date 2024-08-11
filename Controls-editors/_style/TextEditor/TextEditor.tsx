import { useCallback } from 'react';
import { TextStyleEditor } from './TextStyleEditor';
import { ITextStyle } from '../interface';
import { TextStylePreview } from './TextStylePreview';
import { TextTitleEditor } from './TextTitleEditor';
import { TextCommentEditor } from './TextCommentEditor';
import { TextStyleMeta } from 'Controls-meta/style';
import 'css!Controls-editors/_style/TextEditor/TextEditor';

const PREVIEW_TEXT = 'В чащах юга жил-был цитрус... – да\nно фальшивый экземпляръ!';

interface ITextData {
    name: string;
    style: ITextStyle;
    comment: string;
}

interface ITextEditorProps extends ITextData {
    id: string;
    onChange: (args: ITextData) => void;
}

export function TextEditor({ id, name, style, comment, onChange }: ITextEditorProps): JSX.Element {
    const onStyleChange = useCallback(
        (newStyle: ITextStyle) => {
            onChange({ name, style: newStyle, comment });
        },
        [comment, name, onChange]
    );
    const onNameChange = useCallback(
        (newName: string) => {
            onChange({ name: newName, style, comment });
        },
        [comment, onChange, style]
    );

    const onCommentChange = useCallback(
        (newComment: string) => {
            onChange({ name, style, comment: newComment });
        },
        [name, onChange, style]
    );

    return (
        <div className="tw-w-full">
            <div className="TextEditor__block">
                <TextTitleEditor name={name} keyName={id} onChange={onNameChange} />
            </div>
            <div className="TextEditor__block TextEditor__block_active TextEditor__block__preview">
                <div className="TextEditor__block__preview__content">
                    <TextStylePreview value={PREVIEW_TEXT} style={style} />
                </div>
            </div>
            <TextStyleEditor
                className="TextEditor__block"
                meta={TextStyleMeta}
                style={style}
                onChange={onStyleChange}
            />
            <div className="TextEditor__block">
                <TextCommentEditor value={comment} onChange={onCommentChange} />
            </div>
        </div>
    );
}
