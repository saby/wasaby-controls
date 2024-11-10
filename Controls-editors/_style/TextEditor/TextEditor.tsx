import { useCallback, useMemo } from 'react';
import { TextStyleEditor } from './TextStyleEditor';
import { ITextStyle } from '../interface';
import { TextStylePreview } from './TextStylePreview';
import { TextTitleEditor } from './TextTitleEditor';
import { TextCommentEditor } from './TextCommentEditor';
import { TextStyleMeta } from 'Controls-meta/style';
import { ObjectMeta, ObjectType } from 'Meta/types';
import 'css!Controls-editors/_style/TextEditor/TextEditor';

const PREVIEW_TEXT = 'В чащах юга жил-был цитрус... – да\nно фальшивый экземпляръ!';

interface ITextData {
    name: string;
    selector: string;
    style: ITextStyle;
    stylePreview?: ITextStyle;
    comment: string;
}

interface ITextEditorProps extends ITextData {
    onChange: (args: ITextData) => void;
}

export function TextEditor({
    selector,
    name,
    style,
    stylePreview,
    comment,
    onChange,
}: ITextEditorProps): JSX.Element {
    const onStyleChange = useCallback(
        (newStyle: ITextStyle) => {
            onChange({ selector, name, style: newStyle, comment });
        },
        [selector, comment, name, onChange]
    );

    const onTitleChange = useCallback(
        (newName: string, newSelector: string) => {
            onChange({ selector: newSelector, name: newName, style, comment });
        },
        [comment, onChange, style]
    );

    const onCommentChange = useCallback(
        (newComment: string) => {
            onChange({ selector, name, style, comment: newComment });
        },
        [selector, name, onChange, style]
    );

    const TextStyleMetaPrepared = useMemo(() => {
        // Убираем пока не поддерживаемые свойства.
        const { lineHeight, textAlign, ...props } = TextStyleMeta.properties();
        return ObjectType.id('StyleMeta').properties(props) as ObjectMeta;
    }, []);

    return (
        <div className="tw-w-full">
            <div className="TextEditor__block">
                <TextTitleEditor name={name} selector={selector} onChange={onTitleChange} />
            </div>
            <div className="TextEditor__block TextEditor__block_active TextEditor__block__preview">
                <div className="TextEditor__block__preview__content">
                    <TextStylePreview value={PREVIEW_TEXT} style={stylePreview || style} />
                </div>
            </div>
            <TextStyleEditor
                className="TextEditor__block"
                meta={TextStyleMetaPrepared as ObjectMeta}
                style={style}
                onChange={onStyleChange}
            />
            <div className="TextEditor__block">
                <TextCommentEditor key={selector} value={comment} onChange={onCommentChange} />
            </div>
        </div>
    );
}
