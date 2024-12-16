import * as React from 'react';
import {
    default as IndicatorTemplate,
    IWrapperIndicatorsTemplateProps as IIndicatorTemplateProps,
} from './indicators/WrapperIndicatorsTemplate';
import type { Indicator } from 'Controls/grid';

export default function IndicatorComponent(
    props: IIndicatorTemplateProps<Indicator>
): React.ReactElement {
    const style: React.CSSProperties | undefined = props.item.isDisplayed()
        ? undefined
        : { display: 'none' };
    return (
        <div className={props.item.getGridClasses()} style={style}>
            <div className={'tw-w-full'}>
                <IndicatorTemplate item={props.item} onClick={props.onClick} />
            </div>
        </div>
    );
}
