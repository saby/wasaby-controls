import { forwardRef, LegacyRef, ReactElement, RefObject } from 'react';
import PlaceholderWrapper from 'Controls/_input/Base/PlaceholderWrapper';
import { Money } from 'Controls/baseDecorator';
import { TFontSize } from 'Controls/interface';

interface IReadOnlyProps {
    className?: string;
    horizontalPadding?: string;
    value?: number;
    placeholderVisibility?: string;
    placeholderTemplate?: ReactElement;
    precision: 0 | 2 | 4;
    fontColorStyle: string;
    fontSize: TFontSize;
    options?: {
        precision: 0 | 2 | 4;
        fontColorStyle: string;
        fontSize: TFontSize;
        value: number;
    };
    'data-qa'?: string;
    onMouseDown?: () => void;
}

const ATTRS = {
    name: 'readOnlyField',
};

export default forwardRef(function ReadOnly(props: IReadOnlyProps, ref: LegacyRef<HTMLDivElement>) {
    const {
        horizontalPadding,
        placeholderTemplate,
        placeholderVisibility,
        options = {} as IReadOnlyProps['options'],
    } = props;
    const value = options?.value || props.value;

    return value || value === 0 ? (
        <Money
            ref={ref as RefObject<unknown>}
            attrs={ATTRS}
            {...props}
            {...options}
            className={`controls-InputBase__field_readOnly controls-InputMoney__field_readOnly controls-InputBase__field_margin-${horizontalPadding}${
                props.className ? ` ${props.className}` : ''
            }`}
            value={value}
            precision={props.precision || options?.precision}
            fontColorStyle={props.fontColorStyle || options?.fontColorStyle}
            fontSize={props.fontSize || options?.fontSize}
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
                value={value + ''}
                placeholderVisibility={placeholderVisibility}
            />
        </div>
    );
});
