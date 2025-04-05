import { forwardRef, LegacyRef, ReactElement } from 'react';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { IComponentProps } from 'Controls/interface';

interface IPlaceholderWrapperProps extends IComponentProps {
    value?: string;
    placeholderVisibility?: string;
    placeholderDisplay?: string;
    placeholderTemplate?: ReactElement;
    _placeholderClickHandler?: (event: MouseEvent) => void;
    shortPlaceholder?: string;
    maxSymbol?: number;
}

export default forwardRef(function PlaceholderWrapper(
    props: IPlaceholderWrapperProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const { value, shortPlaceholder, maxSymbol = Infinity } = props;
    return (
        <div
            ref={ref}
            className={`controls-InputBase__placeholder${
                props.placeholderVisibility === 'hidden' ||
                (value && !shortPlaceholder ? ' ws-hidden' : '')
            } controls-InputBase__placeholder_displayed-${props.placeholderDisplay}-caret${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            {getContent(props.placeholderTemplate, {
                onClick: props._placeholderClickHandler,
                className: value && shortPlaceholder ? 'ws-hidden' : '',
            })}
            {shortPlaceholder
                ? getContent(props.placeholderTemplate, {
                      onClick: props._placeholderClickHandler,
                      shortPlaceholder,
                      className: value && value.length < maxSymbol ? 'tw-text-end' : 'ws-hidden',
                  })
                : null}
        </div>
    );
});
