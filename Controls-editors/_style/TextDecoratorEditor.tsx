import { memo, useState, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { default as ToggleButton } from 'Controls/ToggleButton';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/_style/TextDecoratorEditor';

type FontWeight = 'bold' | 'normal';
type FontStyle = 'italic' | 'normal';
type TextDecoration =
    | 'underline'
    | 'line-through'
    | 'underline line-through'
    | 'line-through underline'
    | 'none';

interface ITextDecoratorValue {
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    textDecoration?: TextDecoration;
}

interface IEditorProps extends ITextDecoratorValue {
    onChange: (value: ITextDecoratorValue) => void;
}

interface ITextDecoratorEditorProps extends IPropertyGridPropertyEditorProps<ITextDecoratorValue> {
    LayoutComponent?: IComponent<object>;
}

const BOLD_ICON = ['icon-Bold'];
const ITALIC_ICON = ['icon-Italic'];
const UNDERLINE_ICON = ['icon-Underline'];
const LINE_THROUGH_ICON = ['icon-Stroked'];

function getTextStyle(b: boolean, i: boolean, u: boolean, l: boolean): ITextDecoratorValue {
    const textDecoration =
        !u && !l
            ? 'none'
            : ([u ? 'underline' : '', l ? 'line-through' : ''].join(' ').trim() as TextDecoration);

    return {
        fontStyle: i ? 'italic' : 'normal',
        fontWeight: b ? 'bold' : 'normal',
        textDecoration,
    };
}

function Editor({
    fontStyle = 'normal',
    fontWeight = 'normal',
    textDecoration = 'none',
    onChange,
}: IEditorProps): JSX.Element {
    const [bold, setBold] = useState(fontWeight === 'bold');
    const [italic, setItalic] = useState(fontStyle === 'italic');
    const [underline, setUnderline] = useState(textDecoration.includes('underline'));
    const [lineThrough, setLineThrough] = useState(textDecoration.includes('line-through'));

    const onBoldClick = useCallback(() => {
        onChange({
            ...getTextStyle(!bold, italic, underline, lineThrough),
        });
        setBold(!bold);
    }, [bold, italic, lineThrough, onChange, underline]);

    const onItalicClick = useCallback(() => {
        onChange({
            ...getTextStyle(bold, !italic, underline, lineThrough),
        });
        setItalic(!italic);
    }, [bold, italic, lineThrough, onChange, underline]);

    const onUnderlineClick = useCallback(() => {
        onChange({
            ...getTextStyle(bold, italic, !underline, lineThrough),
        });
        setUnderline(!underline);
    }, [bold, italic, lineThrough, onChange, underline]);

    const onLineThroughClick = useCallback(() => {
        onChange({
            ...getTextStyle(bold, italic, underline, !lineThrough),
        });
        setLineThrough(!lineThrough);
    }, [bold, italic, lineThrough, onChange, underline]);

    return (
        <div className="tw-flex TextDecoratorEditor__gap">
            <ToggleButton
                icons={BOLD_ICON}
                viewMode="pushButton"
                contrastBackground={true}
                tooltip={rk('Жирный')}
                value={bold}
                onClick={onBoldClick}
            />
            <ToggleButton
                icons={ITALIC_ICON}
                viewMode="pushButton"
                contrastBackground={true}
                tooltip={rk('Курсив')}
                value={italic}
                onClick={onItalicClick}
            />
            <ToggleButton
                icons={UNDERLINE_ICON}
                viewMode="pushButton"
                contrastBackground={true}
                tooltip={rk('Подчеркнутый')}
                value={underline}
                onClick={onUnderlineClick}
            />
            <ToggleButton
                icons={LINE_THROUGH_ICON}
                viewMode="pushButton"
                contrastBackground={true}
                tooltip={rk('Зачеркнутый')}
                value={lineThrough}
                onClick={onLineThroughClick}
            />
        </div>
    );
}

/**
 * Реакт компонент, редактор декорирования текста
 * @class Controls-editors/_style/TextDecoratorEditor
 * @public
 */
export const TextDecoratorEditor = memo(
    ({ value, LayoutComponent, onChange }: ITextDecoratorEditorProps): JSX.Element => {
        const onChangeCallback = useCallback(
            (result: ITextDecoratorValue) => {
                if (typeof onChange === 'function') {
                    onChange(result);
                }
            },
            [onChange]
        );
        const key = useMemo(() => (value ? JSON.stringify(value) : 1), [value]);

        return (
            <LayoutComponent>
                <Editor
                    key={key}
                    fontStyle={value?.fontStyle ?? undefined}
                    fontWeight={value?.fontWeight ?? undefined}
                    textDecoration={value?.textDecoration ?? undefined}
                    onChange={onChangeCallback}
                />
            </LayoutComponent>
        );
    }
);
