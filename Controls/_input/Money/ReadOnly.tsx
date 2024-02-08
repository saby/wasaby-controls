import { forwardRef, LegacyRef, ReactElement } from 'react';
import PlaceholderWrapper from 'Controls/_input/Base/PlaceholderWrapper';
import { Money } from 'Controls/baseDecorator';

interface IReadOnlyProps {
    className?: string;
    horizontalPadding?: string;
    value?: number;
    placeholderVisibility?: string;
    placeholderTemplate?: ReactElement;
    precision: string;
    fontColorStyle: string;
    fontSize: string;
    options?: {
        precision: string;
        fontColorStyle: string;
        fontSize: string;
    };
}

const ATTRS = {
    name: 'readOnlyField',
};

export default forwardRef(function ReadOnly(props: IReadOnlyProps, ref: LegacyRef<HTMLDivElement>) {
    const { horizontalPadding, placeholderTemplate, placeholderVisibility, options = {} } = props;
    const value = options.value || props.value;

    return value || value === 0 ? (
        <Money
            ref={ref}
            attrs={ATTRS}
            {...props}
            {...options}
            className={`controls-InputBase__field_readOnly controls-InputMoney__field_readOnly controls-InputBase__field_margin-${horizontalPadding}${
                props.className ? ` ${props.className}` : ''
            }`}
            value={value}
            precision={props.precision || options.precision}
            fontColorStyle={props.fontColorStyle || options.fontColorStyle}
            fontSize={props.fontSize || options.fontSize}
            readOnly={false}
            data-qa={props['data-qa']}
            onMouseDown={props.onMouseDown}
        />
    ) : (
        <div
            ref={ref}
            className={`controls-InputBase__field_readOnly controls-InputMoney__field_readOnly controls-InputBase__field_margin-${horizontalPadding}${
                props.className ? ` ${props.className}` : ''
            }`}
            onMouseDown={props.onMouseDown}
        >
            <PlaceholderWrapper
                className="controls-InputBase__placeholder_readOnly"
                placeholderTemplate={placeholderTemplate}
                value={value}
                placeholderVisibility={placeholderVisibility}
            />
        </div>
    );
});
