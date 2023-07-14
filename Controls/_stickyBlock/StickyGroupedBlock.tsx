/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import * as Ctx from 'Controls/_stickyBlock/StickyContextReact';
import { Mode, StickyShadowVisibility } from 'Controls/_stickyBlock/types';
import 'css!Controls/stickyBlock';
import StickyBlockReactView from 'Controls/_stickyBlock/StickyBlockReactView';
import { delimitProps } from 'UICore/Jsx';

function StickyGroupedBlockReact({
    shadowVisibility = StickyShadowVisibility.Visible,
    fixedZIndex = 2,
    mode = Mode.Replaceable,
    offsetLeft = 0,
    subPixelArtifactFix = false,
    pixelRatioBugFix = true,
    _isIosZIndexOptimized = true,
    ...props
}) {
    const stickyContext = React.useContext(Ctx.StickyContext);
    const [stickyId, setStickyId] = React.useState('');

    const setStickyIdCallback = React.useCallback((id) => {
        return setStickyId(id);
    }, []);

    const { userAttrs, $wasabyRef, clearProps } = delimitProps(props);

    // Для совместимости опций.
    /* eslint-disable */
    const getShadowVisibilityProp = () => {
        // @ts-ignore
        if (shadowVisibility === 'lastVisible') {
            return StickyShadowVisibility.Visible;
        } else {
            return shadowVisibility;
        }
    };

    // Для совместимости опций.
    const getPositionProp = () => {
        // @ts-ignore
        if (typeof props.position === 'object' && props.position.horizontal) {
            // @ts-ignore
            return horizontal;
        } else if (typeof props.position === 'object' && props.position.vertical) {
            return undefined;
        } else if (typeof props.position === 'string') {
            return props.position;
        }
    };
    /* eslint-enable */

    const getContext = () => {
        const hasContext = Object.keys(props.context || {}).length;
        const hasWasabyContext = Object.keys(props.wasabyContext || {}).length;
        if (hasWasabyContext && hasContext) {
            return { ...props.context, ...props.wasabyContext };
        }
        if (hasContext) {
            return props.context;
        }
        if (hasWasabyContext) {
            return props.wasabyContext;
        }
        return {};
    };

    return (
        <StickyBlockReactView
            {...clearProps}
            shadowVisibility={getShadowVisibilityProp()}
            fixedZIndex={fixedZIndex}
            zIndex={props.zIndex}
            backgroundStyle={props.backgroundStyle}
            mode={mode}
            position={getPositionProp()}
            offsetLeft={offsetLeft}
            subPixelArtifactFix={subPixelArtifactFix}
            pixelRatioBugFix={pixelRatioBugFix}
            _isIosZIndexOptimized={_isIosZIndexOptimized}
            onFixedCallback={props.onFixedCallback}
            $wasabyRef={$wasabyRef}
            stickyModel={stickyContext.models ? stickyContext.models[stickyId] : undefined}
            setStickyId={setStickyIdCallback}
            register={stickyContext.registerCallback}
            unregister={stickyContext.unregisterCallback}
            modeChanged={stickyContext.modeChangedCallback}
            offsetChanged={stickyContext.offsetChangedCallback}
            attrs={userAttrs}
            wasabyContext={getContext()}
            content={props.content}
        />
    );
}

export default React.memo(StickyGroupedBlockReact);
