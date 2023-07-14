import * as React from 'react';
import { isEdgeAnimated } from './common/helpers';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    PrivateContextUserSymbol,
} from './context/ColumnScrollContext';
import StaticStylesComponent from './ApplyCssTransform/StaticStylesComponent';
import WidthsDependentStylesComponent from './ApplyCssTransform/WidthsDependentStylesComponent';
import PositionDependentStylesComponent from './ApplyCssTransform/PositionDependentStylesComponent';
import {
    ISmoothScrollingAnimationComponentProps,
    SmoothScrollingAnimationComponentMemo as SmoothScrollingAnimationComponent,
} from './ApplyCssTransform/SmoothScrollingAnimationComponent';

type TCommonDeviceProps = {
    selectors: IColumnScrollContext['SELECTORS'];
    fixedWidth: IColumnScrollContext['fixedWidth'];
    viewPortWidth: IColumnScrollContext['viewPortWidth'];
};

type TDesktopProps = {
    isMobile: false;
    previousPosition: IColumnScrollContext['position'];
    position: IColumnScrollContext['position'];
} & Pick<IColumnScrollContext, 'leftEdgeState' | 'rightEdgeState'> &
    Pick<ISmoothScrollingAnimationComponentProps, 'onAnimationEnd'>;

type TMobileProps = {
    isMobile: true;
};

type TApplyCssTransformComponentProps = TCommonDeviceProps & (TMobileProps | TDesktopProps);

export function ApplyCssTransformComponent(
    props: TApplyCssTransformComponentProps
): React.FunctionComponentElement<TApplyCssTransformComponentProps> {
    const isAnimation =
        !props.isMobile &&
        (isEdgeAnimated((props as TDesktopProps).leftEdgeState) ||
            isEdgeAnimated((props as TDesktopProps).rightEdgeState));

    return (
        <>
            <StaticStylesComponent selectors={props.selectors} />

            <WidthsDependentStylesComponent
                selectors={props.selectors}
                fixedWidth={props.fixedWidth}
                viewPortWidth={props.viewPortWidth}
            />

            {isAnimation && (
                <SmoothScrollingAnimationComponent
                    selectors={props.selectors}
                    from={(props as TDesktopProps).previousPosition}
                    to={(props as TDesktopProps).position}
                    onAnimationEnd={(props as TDesktopProps).onAnimationEnd}
                />
            )}

            {!props.isMobile && (
                <PositionDependentStylesComponent
                    selectors={props.selectors}
                    position={
                        isAnimation
                            ? (props as TDesktopProps).previousPosition
                            : (props as TDesktopProps).position
                    }
                />
            )}
        </>
    );
}

export const ApplyCssTransformComponentMemo = React.memo(ApplyCssTransformComponent);

export function ApplyCssTransformComponentConsumer(): React.FunctionComponentElement<{}> {
    const context = React.useContext(ColumnScrollContext);

    const prevPositionRef = React.useRef(context.position);

    React.useEffect(() => {
        prevPositionRef.current = context.position;
    });

    const onAnimationEnd = React.useCallback(() => {
        const ctx = context.contextRefForHandlersOnly.current;
        ctx.setPosition(ctx.position, undefined, PrivateContextUserSymbol);
    }, []);

    return (
        <ApplyCssTransformComponentMemo
            isMobile={context.isMobile}
            selectors={context.SELECTORS}
            leftEdgeState={context.leftEdgeState}
            rightEdgeState={context.rightEdgeState}
            fixedWidth={context.fixedWidth}
            viewPortWidth={context.viewPortWidth}
            position={context.position}
            previousPosition={prevPositionRef.current}
            onAnimationEnd={onAnimationEnd}
        />
    );
}

export const ApplyCssTransformComponentConsumerMemo = React.memo(
    ApplyCssTransformComponentConsumer
);
export default ApplyCssTransformComponentConsumerMemo;
