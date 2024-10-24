import { forwardRef, LegacyRef, ReactElement } from 'react';
import { getContent } from '../resources/ReactUtils';

interface IStretcherProps {
    use?: boolean;
    content?: ReactElement;
    children: ReactElement;
    stretcherContentTemplate?: ReactElement;
    stretcherValue?: string;
    emptySymbol?: string;
    value?: string;
    horizontalPadding?: string;
}

export default forwardRef(function Stretcher(props: IStretcherProps, ref): ReactElement {
    const content = props.children || props.content;
    return props.use ? (
        <div className="controls-InputBase__stretcher" ref={ref as LegacyRef<HTMLDivElement>}>
            {getContent(content, {
                className: 'controls-InputBase__stretcher-content',
                value: props.value,
            })}
            {props.stretcherContentTemplate ? (
                getContent(props.stretcherContentTemplate)
            ) : (
                <div
                    className={`controls-InputBase__stretcher-block controls-InputBase__stretcher-block_margin-${props.horizontalPadding}`}
                >
                    {props.stretcherValue || props.emptySymbol}
                </div>
            )}
        </div>
    ) : (
        (getContent(content, {
            ref,
            value: props.value,
        }) as ReactElement)
    );
});
