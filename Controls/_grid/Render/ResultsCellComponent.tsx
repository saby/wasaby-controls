import * as React from 'react';

import { TJsxProps, delimitProps } from 'UICore/Jsx';
import { TemplateFunction } from 'UICommon/Base';

import { IFontProps } from 'Controls/interface';
import { Money, Number } from 'Controls/baseDecorator';

import { ResultsCell } from '../display/ResultsCell';
import { getUserClassName } from '../utils/getUserArgsCompatible';

interface IProps extends TJsxProps, IFontProps {
    gridColumn?: ResultsCell;
    colData?: ResultsCell;

    children?: React.ReactElement;
    contentTemplate?: TemplateFunction;
    className?: string;
    backgroundColorStyle?: string;
}

function getContent(props: IProps): React.ReactElement {
    const column = props.gridColumn || props.colData;
    const titleClassName = column.getTextOverflowClasses();
    if (props.children || props.contentTemplate) {
        const passProps = {
            column,
            colData: column,
            results: column.getMetaResults(),
        };
        return props.children ? (
            React.cloneElement(props.children, passProps)
        ) : (
            <props.contentTemplate {...passProps} />
        );
    }

    if (column.data === undefined || column.data === null) {
        return null;
    }

    const { fontWeight = 'bold', fontColorStyle = 'secondary', fontSize = 'm' } = props;
    if (column.format === 'money') {
        return (
            <Money
                value={column.data}
                useGrouping
                fontWeight={fontWeight}
                fontColorStyle={fontColorStyle}
                fontSize={fontSize}
                className={titleClassName}
            />
        );
    }

    if (column.format === 'integer' || column.format === 'real') {
        return (
            <Number
                value={column.data}
                useGrouping
                fractionSize={2}
                fontWeight={fontWeight}
                fontColorStyle={fontColorStyle}
                fontSize={fontSize}
                className={titleClassName}
            />
        );
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{column.data}</>;
}

function ResultsCellComponent(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { clearProps, userAttrs } = delimitProps(props);
    const column = clearProps.gridColumn || clearProps.colData;

    const className =
        column.getContentClasses(clearProps.backgroundColorStyle) + ` ${getUserClassName(props)}`;
    delete userAttrs.className;

    return (
        <div ref={ref} className={className}>
            {getContent(clearProps)}
        </div>
    );
}

export default React.forwardRef(ResultsCellComponent);
