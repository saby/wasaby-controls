import { forwardRef, LegacyRef, ReactElement } from 'react';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { IControlProps } from 'Controls/interface';

interface IPlaceholderWrapperProps extends IControlProps {
    value?: string;
    placeholderVisibility?: string;
    placeholderDisplay?: string;
    placeholderTemplate?: ReactElement;
    _placeholderClickHandler?: (event: MouseEvent) => void;
}

export default forwardRef(function PlaceholderWrapper(
    props: IPlaceholderWrapperProps,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div
            ref={ref}
            className={`controls-InputBase__placeholder${
                props.placeholderVisibility === 'hidden' || props.value ? ' ws-hidden' : ''
            } controls-InputBase__placeholder_displayed-${props.placeholderDisplay}-caret${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            {getContent(props.placeholderTemplate, { onClick: props._placeholderClickHandler })}
        </div>
    );
});
