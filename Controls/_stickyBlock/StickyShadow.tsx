/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import { detection } from 'Env/Env';
import 'css!Controls/stickyBlock';

function StickyShadow({ isVisible, orientation, position, shadowStyle }) {
    const getShadowClass = (isVisible: boolean) => {
        return !isVisible
            ? detection.isMobileIOS
                ? ' ws-invisible'
                : ' ws-hidden'
            : '';
    };

    return (
        <div
            data-qa={`StickyHeader__shadow-${position}`}
            className={
                `controls-Scroll__shadow controls-StickyHeader__shadow-${position}` +
                ` controls-StickyHeader__shadow-${position}_${shadowStyle}` +
                ` controls-Scroll__shadow_${orientation}` +
                getShadowClass(isVisible)
            }
        ></div>
    );
}

export default React.memo(StickyShadow);
