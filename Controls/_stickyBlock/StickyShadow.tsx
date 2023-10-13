/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import { detection } from 'Env/Env';
import 'css!Controls/stickyBlock';

function StickyShadow({ isVisible, orientation, position, shadowStyle, shadowVisibility, shadowMode }) {
    const getVisibleClass = (isVisible: boolean) => {
        return !isVisible
            ? detection.isMobileIOS && shadowVisibility !== 'hidden'
                ? ' ws-invisible'
                : ' ws-hidden'
            : '';
    };

    const getShadowClasses = () => {
        if (shadowMode === 'rounded') {
            return (
                `controls-StickyHeader__shadow-rounded controls-StickyHeader__shadow-rounded_${orientation}` +
                ` controls-StickyHeader__shadow-rounded_${position}`
            );
        }
        return (
            `controls-Scroll__shadow controls-StickyHeader__shadow-${position}` +
            ` controls-StickyHeader__shadow-${position}_${shadowStyle}` +
            ` controls-Scroll__shadow_${orientation}`
        );
    };

    return (
        <div
            data-qa={`StickyHeader__shadow-${position}`}
            className={getShadowClasses() + getVisibleClass(isVisible)}
        ></div>
    );
}

export default React.memo(StickyShadow);
