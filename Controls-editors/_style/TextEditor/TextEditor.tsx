import { useCallback } from 'react';
import { TextStyleEditor } from './TextStyleEditor';
import { ITextStyle } from '../interface';
import { TextStylePreview } from './TextStylePreview';
import { TextCommentEditor } from './TextCommentEditor';
import { TextStyleMeta } from 'optional!Controls-meta/style';
import { ObjectMeta } from 'Meta/types';
import { NameSelectorEditor } from '../NameSelectorEditor/NameSelectorEditor';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/style';

const PREVIEW_TEXT = 'В чащах юга жил-был цитрус... – да\nно фальшивый экземпляръ!';
const SELECTOR_START_CONSTRAINT = /^[a-zA-Z]/;
const SELECTOR_END_CONSTRAINT = /[a-zA-Z0-9]$/;
const SELECTOR_CONSTRAINT = /^[a-zA-Z0-9\-_]+$/;

function selectorValidator({ value }: { value: string }): boolean | string {
    if (!SELECTOR_CONSTRAINT.test(value)) {
        return (
            rk('Имя селектора может содержать только цифры, латинские буквы и символы') + ': _, -'
        );
    }

    if (!SELECTOR_START_CONSTRAINT.test(value)) {
        return rk('Имя селектора должно начинаться с латинской буквы');
    }

    if (!SELECTOR_END_CONSTRAINT.test(value)) {
        return rk('Имя селектора должно заканчиваться латинской буквой или цифрой');
    }

    return true;
}

const SELECTOR_VALIDATORS = [selectorValidator];
const NAME_VALIDATION_FIELD = ['styleName'];
const SELECTOR_VALIDATION_FIELD = ['styleSelector'];

interface ITextData {
    name: string;
    selector: string;
    style: ITextStyle;
    stylePreview?: ITextStyle;
    comment: string;
}

interface ITextEditorProps extends ITextData {
    /**
     * Используется для валидации
     */
    storeId?: string;
    onChange: (args: ITextData) => void;
    styleMeta?: ObjectMeta;
}

export function TextEditor({
    selector,
    name,
    storeId,
    style,
    stylePreview,
    comment,
    onChange,
    styleMeta = TextStyleMeta,
}: ITextEditorProps): JSX.Element {
    const onStyleChange = useCallback(
        (newStyle: ITextStyle) => {
            onChange({ selector, name, style: newStyle, comment });
        },
        [selector, comment, name, onChange]
    );

    const onTitleChange = useCallback(
        (newName: string, newSelector: string | undefined = '') => {
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

    return (
        <div className="tw-w-full">
            <div className="TextEditor__block">
                <NameSelectorEditor
                    storeId={storeId as string}
                    nameValue={name}
                    selectorValue={selector}
                    onEditFinish={onTitleChange}
                    nameFontSize="3xl"
                    selectorFontSize="3xl"
                    nameEditorFontSize="3xl"
                    selectorEditorFontSize="3xl"
                    inlineHeight="xl"
                    nameValidationField={NAME_VALIDATION_FIELD}
                    selectorValidationField={SELECTOR_VALIDATION_FIELD}
                    selectorValidators={SELECTOR_VALIDATORS}
                />
            </div>
            <div className="TextEditor__block TextEditor__block_active TextEditor__block__preview" data-qa={'TextEditor__preview'}>
                <div className="TextEditor__block__preview__content">
                    <TextStylePreview value={PREVIEW_TEXT} style={stylePreview || style} />
                </div>
            </div>
            <TextStyleEditor
                className="TextEditor__block"
                meta={styleMeta}
                style={style}
                onChange={onStyleChange}
            />
            <div className="TextEditor__block TextEditor__block__comment">
                <TextCommentEditor key={selector} value={comment} onChange={onCommentChange} />
            </div>
        </div>
    );
}
