/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

import { TMarkerSize } from 'Controls/display';
import Component from 'Controls/markerComponent';

interface IMarkableItem {
    Markable: boolean;
    shouldDisplayMarker(marker: boolean): boolean;
    getMarkerClasses(markerSize: TMarkerSize): string;
}

interface IProps extends TInternalProps {
    item: IMarkableItem;
    marker: boolean;
    markerSize: TMarkerSize;
    markerPosition?: 'default' | 'outside';
    className?: string;
}

function getClassName(props: IProps): string {
    let className = props.item.getMarkerClasses(props.markerSize);
    if (props.markerPosition === 'outside') {
        className += ` controls-ListView__itemV_marker_outside_${props.markerSize || 'content-xs'}`;
    }
    if (props.className) {
        className += ` ${props.className}`;
    }
    return className;
}

export default function ListMarker(props: IProps): React.ReactElement {
    const shouldDisplay = props.item.Markable && props.item.shouldDisplayMarker(props.marker);
    return (
        shouldDisplay && <Component markerSize={props.markerSize} className={getClassName(props)} />
    );
}
