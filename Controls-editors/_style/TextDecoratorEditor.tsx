import { memo, useCallback, useMemo, Fragment, FC } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as ToggleButton } from 'Controls/ToggleButton';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/style';

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
    attributes: Record<keyof ITextDecoratorValue, unknown>;
}

interface IOnChangeOptions {
    multiple: boolean;
}

interface ITextDecoratorEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<ITextDecoratorValue>, 'onChange'> {
    LayoutComponent?: FC;
    attributes: Record<keyof ITextDecoratorValue, unknown>;
    onChange?: (value: ITextDecoratorValue, options: IOnChangeOptions) => void;
}

const BOLD_ICON = ['icon-Bold'];
const ITALIC_ICON = ['icon-Italic'];
const UNDERLINE_ICON = ['icon-Underline'];
const LINE_THROUGH_ICON = ['icon-Stroked'];

function getTextDecoration(u: boolean, l: boolean): ITextDecoratorValue {
    const textDecoration =
        !u && !l
            ? 'none'
            : ([u ? 'underline' : '', l ? 'line-through' : ''].join(' ').trim() as TextDecoration);

    return {
        textDecoration,
    };
}

function Editor(props: IEditorProps): JSX.Element {
    const {
        fontStyle = 'normal',
        fontWeight = 'normal',
        textDecoration = 'none',
        attributes,
        onChange,
    } = props;
    const bold = fontWeight === 'bold';
    const italic = fontStyle === 'italic';
    const underline = textDecoration.includes('underline');
    const lineThrough = textDecoration.includes('line-through');

    const onBoldClick = useCallback(() => {
        onChange({
            fontWeight: !bold ? 'bold' : 'normal',
        });
    }, [bold, onChange]);

    const onItalicClick = useCallback(() => {
        onChange({
            fontStyle: !italic ? 'italic' : 'normal',
        });
    }, [italic, onChange]);

    const onUnderlineClick = useCallback(() => {
        onChange({
            ...getTextDecoration(!underline, lineThrough),
        });
    }, [lineThrough, onChange, underline]);

    const onLineThroughClick = useCallback(() => {
        onChange({
            ...getTextDecoration(underline, !lineThrough),
        });
    }, [lineThrough, onChange, underline]);

    return (
        <div className="tw-flex TextDecoratorEditor__gap">
            {attributes.fontWeight && (
                <ToggleButton
                    icons={BOLD_ICON}
                    viewMode="pushButton"
                    contrastBackground={true}
                    tooltip={rk('Жирный')}
                    value={bold}
                    onClick={onBoldClick}
                    data-qa={"TextDecoratorEditor__bold"}
                />
            )}
            {attributes.fontStyle && (
                <ToggleButton
                    icons={ITALIC_ICON}
                    viewMode="pushButton"
                    contrastBackground={true}
                    tooltip={rk('Курсив')}
                    value={italic}
                    onClick={onItalicClick}
                    data-qa={"TextDecoratorEditor__italic"}
                />
            )}
            {attributes.textDecoration && (
                <ToggleButton
                    icons={UNDERLINE_ICON}
                    viewMode="pushButton"
                    contrastBackground={true}
                    tooltip={rk('Подчеркнутый')}
                    value={underline}
                    onClick={onUnderlineClick}
                    data-qa={"TextDecoratorEditor__underline"}
                />
            )}
            {attributes.textDecoration && (
                <ToggleButton
                    icons={LINE_THROUGH_ICON}
                    viewMode="pushButton"
                    contrastBackground={true}
                    tooltip={rk('Зачеркнутый')}
                    value={lineThrough}
                    onClick={onLineThroughClick}
                    data-qa={"TextDecoratorEditor__linethrough"}
                />
            )}
        </div>
    );
}

/**
 * Реакт компонент, редактор декорирования текста
 * @class Controls-editors/_style/TextDecoratorEditor
 * @public
 */
export const TextDecoratorEditor = memo((props: ITextDecoratorEditorProps): JSX.Element => {
    const { value, LayoutComponent = Fragment, onChange, attributes } = props;
    const onChangeCallback = useCallback(
        (result: ITextDecoratorValue) => {
            if (typeof onChange === 'function') {
                onChange(result, { multiple: true });
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
                attributes={attributes}
                onChange={onChangeCallback}
            />
        </LayoutComponent>
    );
});
