import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import 'css!Controls-Templates/itemTemplates';
import { Highlight } from 'Controls/baseDecorator';

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
}

// TODO textDecoration
function getTextClassName({
    lines,
    className = '',
    hAlign = 'left',
    fontSize = 'm',
    fontColorStyle = '',
    fontWeight = 'default',
}: ITextProps): string {
    let classes = className + ' Controls-Templates-TextRender__text';
    classes += ` Controls-Templates-TextRender__text_halign_${hAlign}`;
    classes += ` Controls-Templates-TextRender__text_font_style_${fontColorStyle}`;
    classes += ` Controls-Templates-TextRender__text_lines_${lines}`;
    classes += ` controls-text-${fontColorStyle}`;
    classes += ` controls-fontsize-${fontSize}`;
    classes += ` controls-fontweight-${fontWeight}`;

    return classes;
}

export function TextRender(textProps: ITextProps): React.ReactElement {
    const className = getTextClassName(textProps);
    if (typeof textProps.value === 'string') {

        const value = textProps.searchValue ? <Highlight
            highlightedValue={textProps.searchValue}
            value={String(textProps.value)}
            highlightClassName={textProps.highlightDecoratorClassName}
        /> : textProps.value;

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
            return <textProps.value className={classList} searchValue={textProps.searchValue}/>;
        } else {
            return React.cloneElement(textProps.value, {
                className: classList,
                searchValue: textProps.searchValue,
            });
        }
    }
}
