import { forwardRef, LegacyRef, MouseEvent, ReactElement, useMemo } from 'react';
import Async from 'Controls/Container/Async';
import { getContent } from '../resources/ReactUtils';

interface IReadOnlyProps {
    className?: string;
    horizontalPadding?: string;
    value?: string;
    emptySymbol?: string;
    placeholderVisibility?: string;
    placeholderTemplate?: ReactElement;
    'data-qa'?: string;
    onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default forwardRef(function ReadOnly(props: IReadOnlyProps, ref: LegacyRef<HTMLDivElement>) {
    const { horizontalPadding, value, emptySymbol, placeholderTemplate, placeholderVisibility } =
        props;
    const templateOptions = useMemo(() => {
        return {
            className: 'controls-Area__wrapURLs',
            value,
        };
    }, [value]);
    return (
        <div
            ref={ref}
            className={`controls-Area__field_readOnly controls-Area__field_margin-${horizontalPadding} controls-Area__fieldWrapper${
                props.className ? ` ${props.className}` : ''
            }${!value && placeholderVisibility === 'empty' ? ' tw-flex' : ''}`}
            data-qa={props['data-qa']}
            onMouseDown={props.onMouseDown}
        >
            {value ? (
                <Async
                    templateName="Controls/extendedDecorator:WrapURLs"
                    templateOptions={templateOptions}
                />
            ) : placeholderVisibility === 'empty' ? (
                <>
                    {emptySymbol}
                    {getContent(placeholderTemplate)}
                </>
            ) : (
                emptySymbol
            )}
        </div>
    );
});
