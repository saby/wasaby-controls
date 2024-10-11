/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
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
    startFixedWidth: IColumnScrollContext['startFixedWidth'];
    endFixedWidth: IColumnScrollContext['endFixedWidth'];
    contentWidth: IColumnScrollContext['contentWidth'];
    isNeedByWidth: IColumnScrollContext['isNeedByWidth'];
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

/**
 * Опции компонента ApplyCssTransformComponent.
 */
type TApplyCssTransformComponentProps = TCommonDeviceProps & (TMobileProps | TDesktopProps);

/**
 * Компонент применяет все стили скролла к его элементам.
 * Например, трансформацию, анимацию, позиционирование и другое.
 */
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
                isNeedByWidth={props.isNeedByWidth}
                startFixedWidth={props.startFixedWidth}
                endFixedWidth={props.endFixedWidth}
                viewPortWidth={props.viewPortWidth}
            />

            {isAnimation && (
                <SmoothScrollingAnimationComponent
                    selectors={props.selectors}
                    startFixedWidth={props.startFixedWidth}
                    endFixedWidth={props.endFixedWidth}
                    contentWidth={props.contentWidth}
                    viewPortWidth={props.viewPortWidth}
                    from={(props as TDesktopProps).previousPosition}
                    to={(props as TDesktopProps).position}
                    onAnimationEnd={(props as TDesktopProps).onAnimationEnd}
                />
            )}

            {!props.isMobile && (
                <PositionDependentStylesComponent
                    selectors={props.selectors}
                    startFixedWidth={props.startFixedWidth}
                    endFixedWidth={props.endFixedWidth}
                    contentWidth={props.contentWidth}
                    viewPortWidth={props.viewPortWidth}
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
        context.setPosition(
            context.contextRefForHandlersOnly.current.position,
            undefined,
            PrivateContextUserSymbol
        );
    }, []);

    return (
        <ApplyCssTransformComponentMemo
            isMobile={context.isMobile}
            selectors={context.SELECTORS}
            leftEdgeState={context.leftEdgeState}
            rightEdgeState={context.rightEdgeState}
            startFixedWidth={context.startFixedWidth}
            endFixedWidth={context.endFixedWidth}
            viewPortWidth={context.viewPortWidth}
            contentWidth={context.contentWidth}
            isNeedByWidth={context.isNeedByWidth}
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
