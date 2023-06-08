import * as React from 'react';
import { isEdgeAnimated } from './common/helpers';
import {
    ColumnScrollContext,
    IColumnScrollContext,
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

type TApplyCssTransformComponentProps = TCommonDeviceProps &
    (TMobileProps | TDesktopProps);

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

export const ApplyCssTransformComponentMemo = React.memo(
    ApplyCssTransformComponent
);

export function ApplyCssTransformComponentConsumer(): React.FunctionComponentElement<{}> {
    const context = React.useContext(ColumnScrollContext);

    const contextRef = React.useRef(context);
    const prevPositionRef = React.useRef(context.position);

    React.useEffect(() => {
        prevPositionRef.current = context.position;
        contextRef.current = context;
    });

    const onAnimationEnd = React.useCallback(() => {
        contextRef.current.setPosition(contextRef.current.position);
    }, []);

    return (
        <ApplyCssTransformComponentMemo
            isMobile={context.isMobile}
            selectors={context.SELECTORS}
            leftEdgeState={context.leftEdgeState}
            rightEdgeState={context.rightEdgeState}
            fixedWidth={context.fixedWidth}
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
