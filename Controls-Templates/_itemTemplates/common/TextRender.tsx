import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import 'css!Controls-Templates/itemTemplates';
import { Highlight } from 'Controls/baseDecorator';
import { TLineBrake } from 'Controls/interface';
import { getHeaderFontSizeClass, getTextFontSizeClass } from 'Controls/Utils/getFontClass';

export interface ITextProps {
    className?: string;
    value?: string | React.ReactNode | TemplateFunction;
    hAlign?: 'left' | 'right' | 'middle';
    fontSize?: string;
    fontColorStyle?: string;
    textDecoration?: string;
    fontWeight?: string;
    lines?: number;
    searchValue?: string;
    highlightDecoratorClassName?: string;
    lineBreak?: TLineBrake;
}

// TODO textDecoration
function getTextClassName({
    lines,
    lineBreak = 'normal',
    className = '',
    hAlign = 'left',
    fontSize = 'm',
    fontColorStyle = '',
    fontWeight = 'default',
}: ITextProps): string {
    let classes = className + ' Controls-Templates-TextRender__text';
    classes += ` Controls-Templates-TextRender__text_halign_${hAlign}`;
    classes += ` Controls-Templates-TextRender__text_font_style_${fontColorStyle}`;
    classes += ` controls-text-${fontColorStyle}`;
    classes += ` controls-fontsize-${fontSize}`;
    classes += ` controls-fontweight-${fontWeight}`;
    classes += ` tw-break-${lines === 1 ? 'all' : lineBreak}`;
    if (fontWeight === 'default') {
        classes += ` ${getTextFontSizeClass(fontSize)}`;
    } else {
        classes += ` ${getHeaderFontSizeClass(fontSize)}`;
    }
    return classes;
}

export function TextRender(textProps: ITextProps): React.ReactElement {
    const className = getTextClassName(textProps);
    if (typeof textProps.value === 'string') {
        const value = textProps.searchValue ? (
            <Highlight
                highlightedValue={textProps.searchValue}
                value={String(textProps.value)}
                highlightClassName={
                    textProps.highlightDecoratorClassName ||
                    `controls-Highlight_highlight${
                        textProps.fontColorStyle === 'contrast' ? '_contrast' : ''
                    }`
                }
            />
        ) : (
            textProps.value
        );

        if (textProps.lines) {
            return (
                <div className={className}>
                    <div
                        className={` ws-line-clamp ws-line-clamp_${textProps.lines}`}
                        title={textProps.value}
                    >
                        {value}
                    </div>
                </div>
            );
        } else {
            return <span className={className}>{value}</span>;
        }
    } else {
        const classList = (textProps.value.props?.className || '') + ` ${className}`;

        if (textProps.value.isWasabyTemplate) {
            return (
                <textProps.value
                    className={
                        classList +
                        (textProps.lines ? ` ws-line-clamp ws-line-clamp_${textProps.lines}` : '')
                    }
                    searchValue={textProps.searchValue}
                />
            );
        } else {
            // Проверка на то, что textProps.value является элементом реакта, а не компонентом
            // Если элементом, то не нужно прокидывать лишние пропсы, которые реакт не учитывает
            // иначе реакт стреляет ошибками в консоль
            if (React.isValidElement(textProps.value) && typeof textProps.value.type === 'string') {
                return React.cloneElement(textProps.value, {
                    className:
                        classList +
                        (textProps.lines ? ` ws-line-clamp ws-line-clamp_${textProps.lines}` : ''),
                    lines: textProps.lines,
                });
            }
            return React.cloneElement(textProps.value, {
                className:
                    classList +
                    (textProps.lines ? ` ws-line-clamp ws-line-clamp_${textProps.lines}` : ''),
                fontSize: textProps.fontSize,
                fontColorStyle: textProps.fontColorStyle,
                fontWeight: textProps.fontWeight,
                searchValue: textProps.searchValue,
                lines: textProps.lines,
                hAlign: textProps.hAlign,
            });
        }
    }
}
