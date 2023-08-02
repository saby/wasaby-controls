import { TInternalProps } from 'UICore/Executor';
import { IControlProps } from 'Controls/interface';
import * as React from 'react';

export interface ICounterTemplateOptions extends TInternalProps, IControlProps {
    multiLine?: boolean;
    counterAlignment?: string;
    backgroundStyle?: string;
    fontSize?: string;
    itemsCount: number;
    counterVisibility?: 'visible' | 'hidden';
}

function CounterTemplate(
    props: ICounterTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const backgroundClass = `${
        !props.multiLine && props.counterVisibility !== 'hidden'
            ? 'controls-background-' + props.backgroundStyle
            : ''
    }`;
    const fontSizeClass = `controls-SelectedCollection__counterItems-size-${
        props.fontSize || 'default'
    }`;
    const offsetClass = `${
        !props.readOnly && !props.multiLine && props.counterAlignment === 'right'
            ? 'controls-SelectedCollection__counter_offset-compensation'
            : ''
    }`;
    const multiLineClass = `controls-SelectedCollection__counterItems_${
        props.multiLine ? 'multiLine' : 'singleLine'
    }-${props.counterAlignment}`;
    const counterVisibilityClass = `${
        props.counterVisibility !== 'hidden'
            ? 'controls-SelectedCollection__counterItems_' +
              (props.multiLine ? 'multiLine' : 'singleLine') +
              '_backgroundStyle-' +
              props.backgroundStyle
            : ''
    }`;
    return (
        <div
            className={`controls-SelectedCollection__counterItems
                        ${multiLineClass}
                        ${counterVisibilityClass}
                        ${backgroundClass}
                        ${offsetClass}
                        ${fontSizeClass}`}
            style={props.attrs?.style}
            ref={ref}
            data-qa="SelectedCollection__counterItems"
        >
            {props.counterVisibility !== 'hidden' && (
                <span className="controls-SelectedCollection__counter">({props.itemsCount})</span>
            )}
            {(props.counterAlignment === 'left' || props.counterVisibility === 'hidden') && (
                <span className="controls-SelectedCollection__counter-ellipsis">&nbsp;...</span>
            )}
        </div>
    );
}

export default React.forwardRef(CounterTemplate);
