import { TInternalProps } from 'UICore/Executor';
import { IComponentPropsWithReadonly } from 'Controls/interface';
import { clsx } from 'clsx';
import * as rk from 'i18n!Controls';
import * as React from 'react';

export interface ICounterTemplateOptions extends TInternalProps, IComponentPropsWithReadonly {
    multiLine?: boolean;
    counterAlignment?: string;
    backgroundStyle?: string;
    fontSize?: string;
    itemsCount: number;
    counterVisibility?: 'visible' | 'hidden' | 'hiddenCompletely';
    counterPosition?: 'static' | 'absolute';
}

function CounterTemplate(
    props: ICounterTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const { multiLine, counterPosition, counterVisibility, counterAlignment } = props;
    const backgroundClass = `controls-background-${props.backgroundStyle}`;
    const counterVisibilityClass = `controls-SelectedCollection__counterItems_${
        multiLine ? 'multiLine' : 'singleLine'
    }_backgroundStyle-${props.backgroundStyle}`;
    const className = clsx(
        'controls-SelectedCollection__counterItems',
        `controls-SelectedCollection__counterItems-size-${props.fontSize || 'default'}`,
        `controls-SelectedCollection__counterItems_${
            multiLine ? 'multiLine' : 'singleLine'
        }-${counterAlignment}`,
        {
            'controls-SelectedCollection__counter_offset-compensation':
                !props.readOnly && !multiLine && counterAlignment === 'right',
            'controls-SelectedCollection__counterAlignment-right':
                counterPosition === 'static' && counterAlignment === 'right',
            [backgroundClass]:
                !multiLine && counterVisibility !== 'hidden' && counterAlignment !== 'left',
            [counterVisibilityClass]:
                counterVisibility !== 'hidden' && counterPosition !== 'static',
        }
    );
    return (
        <div
            className={className}
            style={props.attrs?.style}
            ref={ref}
            data-qa="SelectedCollection__counterItems"
            title={rk('Показать все')}
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
