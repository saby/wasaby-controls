import * as React from 'react';
import {
    default as IndicatorTemplate,
    IWrapperIndicatorsTemplateProps as IIndicatorTemplateProps,
} from './indicators/WrapperIndicatorsTemplate';
import type { Indicator } from 'Controls/display';

export default function IndicatorComponent(
    props: IIndicatorTemplateProps<Indicator>
): React.ReactElement {
    const style: React.CSSProperties | undefined = props.item.isDisplayed()
        ? undefined
        : { display: 'none' };
    return (
        // @ts-ignore next-line
        <div className={props.item.getGridClasses?.()} style={style}>
            <div className={'tw-w-full'}>
                <IndicatorTemplate item={props.item} onClick={props.onClick} />
            </div>
        </div>
    );
}
