import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import 'css!Controls-Templates/itemTemplates';
import { createElement } from 'UICore/Jsx';

export interface ITextProps {
    className?: string;
    value?: string | React.ReactNode | TemplateFunction;
    hAlign?: 'left' | 'right' | 'middle';
    fontSize?: string;
    fontColorStyle?: string;
    textDecoration?: string;
    fontWeight?: string;
    lines?: number;
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

// Совместимость с wml
const WasabyContent = (props) => {
    return createElement(
        props.value,
        {
            className: props.className,
        },
        {
            class: props.className,
        }
    );
};

export function TextRender(textProps: ITextProps): React.ReactElement {
    const className = getTextClassName(textProps);
    if (typeof textProps.value === 'string') {
        if (textProps.lines) {
            return (
                <div className={className}>
                    <div
                        className={` ws-line-clamp ws-line-clamp_${textProps.lines}`}
                        title={textProps.value}
                    >
                        {textProps.value}
                    </div>
                </div>
            );
        } else {
            return <span className={className}>{textProps.value}</span>;
        }
    } else {
        const classList =
            (textProps.value.props?.className || '') + ` ${className}`;

        if (textProps.value.isWasabyTemplate) {
            return (
                <WasabyContent value={textProps.value} className={classList} />
            );
        } else {
            return React.cloneElement(textProps.value, {
                className: classList,
            });
        }
    }
}
