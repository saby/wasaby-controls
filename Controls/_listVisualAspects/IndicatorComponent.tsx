import * as React from 'react';
import { IndicatorTemplate, IIndicatorTemplateProps } from 'Controls/baseList';
import type { Indicator } from 'Controls/grid';

export default function IndicatorComponent(
    props: IIndicatorTemplateProps<Indicator>
): React.ReactElement {
    const style: React.CSSProperties = props.item.isDisplayed() ? null : { display: 'none' };
    return (
        <div className={props.item.getGridClasses()} style={style}>
            <div className={'tw-w-full'}>
                <IndicatorTemplate item={props.item} onClick={props.onClick} />
            </div>
        </div>
    );
}
