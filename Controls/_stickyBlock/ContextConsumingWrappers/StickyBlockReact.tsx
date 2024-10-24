/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import * as Ctx from 'Controls/_stickyBlock/StickyContextReact';
import { Mode, StickyShadowVisibility, StickyVerticalPosition } from 'Controls/_stickyBlock/types';
import 'css!Controls/stickyBlock';
import StickyBlockReactView from 'Controls/_stickyBlock/StickyBlockReactView';
import { delimitProps } from 'UICore/Jsx';

function StickyBlockReact({
                              shadowVisibility = StickyShadowVisibility.Visible,
                              position = StickyVerticalPosition.Top,
                              fixedZIndex = 2,
                              mode = Mode.Replaceable,
                              offsetTop = 0,
                              subPixelArtifactFix = false,
                              pixelRatioBugFix = true,
                              _isIosZIndexOptimized = true,
                              ...props
                          },
                          ref) {
    const stickyContext = React.useContext(Ctx.StickyContext);
    const [stickyId, setStickyId] = React.useState('');

    const setStickyIdCallback = React.useCallback((id) => {
        setStickyId(id);
    }, []);

    const {userAttrs, clearProps} = delimitProps(props);

    // Для совместимости опций.
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
        if (typeof position === 'object' && position.vertical) {
            // @ts-ignore
            return position.vertical;
        } else if (typeof position === 'string') {
            return position;
        }
    };

    return (
        <StickyBlockReactView
            {...clearProps}
            shadowVisibility={getShadowVisibilityProp()}
            fixedZIndex={fixedZIndex}
            zIndex={props.zIndex}
            mode={mode}
            offsetTop={offsetTop}
            position={getPositionProp()}
            backgroundStyle={props.backgroundStyle}
            subPixelArtifactFix={subPixelArtifactFix}
            pixelRatioBugFix={pixelRatioBugFix}
            _isIosZIndexOptimized={_isIosZIndexOptimized}
            horizontalScrollMode={stickyContext.horizontalScrollMode}
            setStickyId={setStickyIdCallback}
            ref={ref}
            onFixedCallback={props.onFixedCallback}
            stickyModel={stickyContext.models && stickyContext.models[stickyId]}
            register={stickyContext.registerCallback}
            unregister={stickyContext.unregisterCallback}
            modeChanged={stickyContext.modeChangedCallback}
            offsetChanged={stickyContext.offsetChangedCallback}
            attrs={userAttrs}
            content={props.content}
            wasabyContext={props.context}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onContextMenu={(e) => {
                return props.onContextMenu?.(e);
            }}
            onMouseUp={(e) => {
                return props.onMouseUp?.(e);
            }}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseEnter={(e) => {
                return props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                return props.onMouseLeave?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onTouchMove={(e) => {
                return props.onTouchMove?.(e);
            }}
            onTouchStart={(e) => {
                return props.onTouchStart?.(e);
            }}
            onTouchEnd={(e) => {
                return props.onTouchEnd?.(e);
            }}
        />
    );
}

export default React.memo(React.forwardRef(StickyBlockReact));
