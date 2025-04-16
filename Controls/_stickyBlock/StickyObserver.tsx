/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import { getDevicePixelRatio } from './Controllers/helpers/functions';
import 'css!Controls/stickyBlock';

function StickyObserver({ position, offset, borderWidth }, ref) {
    const [style, setStyle] = React.useState({});

    React.useEffect(() => {
        let coord = (offset || 0) + borderWidth + 2;
        if (getDevicePixelRatio() !== 1) {
            coord += 1;
        }

        const pos = position === 'bottomLeft' || position === 'bottomRight' ? 'bottom' : position;
        setStyle(new Object({ [pos]: `${-coord}px` }));
    }, [offset, borderWidth]);

    return (
        <div
            ref={ref}
            className={`controls-StickyBlock__observationTarget_${position}`}
            style={style}
        ></div>
    );
}

export default React.forwardRef(StickyObserver);
