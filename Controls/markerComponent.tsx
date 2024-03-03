/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
import { TMarkerSize } from 'Controls/display';

import { TInternalProps } from 'UICore/Executor';
import { Logger } from 'UI/Utils';
import * as React from 'react';
import 'css!Controls/markerComponent';

const VALID_MARKER_SIZES = [
    'image-l',
    'image-m',
    'image-mt',
    'image-s',
    'content-xl',
    'content-xs',
];

interface IProps extends TInternalProps {
    markerSize: TMarkerSize;
    className?: string;
}

const validateMarkerSize = (markerSize: TMarkerSize): void => {
    if (!VALID_MARKER_SIZES.includes(markerSize)) {
        Logger.error(
            `markerSize=${markerSize} is not valid value. ` +
                'See valid values https://wi.sbis.ru/docs/js/Controls/display/typedefs/TMarkerSize',
            this
        );
    }
};

const getMarkerClasses = (markerSize: TMarkerSize = 'content-xs'): string => {
    validateMarkerSize(markerSize);
    return `controls-ListView__itemV_marker controls-ListView__itemV_marker_size_${markerSize} `;
};

const Marker = function MarkerComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const className = `${getMarkerClasses(props.markerSize)} ${props.className || ''}`;

    return <div ref={ref} data-qa={'marker'} className={className} />;
};

export default React.forwardRef(Marker);
/**
 * Индикатор выбранного в данный момент элемента списка
 * @class Controls/markerComponent
 * @public
 * @demo Controls-demo/MarkerComponent/MarkerColor/Index
 */

/**
 * @name Controls/markerComponent#markerSize
 * @cfg {Controls/_display/interface/ICollectionItem/TMarkerSize.typedef} Высота маркера
 */
