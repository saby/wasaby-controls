import * as React from 'react';
import { useWidthResizeObserver, TResizeEventHandler } from './useWidthResizeObserver';

export interface IObservableDivComponentProps {
    onResize: TResizeEventHandler;
    dataQA?: string;
}

export default React.memo(function ObservableDivComponent(
    props: IObservableDivComponentProps
): JSX.Element {
    const ref = useWidthResizeObserver<HTMLDivElement>(props.onResize);
    return <div ref={ref} data-qa={props.dataQA} />;
});
