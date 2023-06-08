import * as React from 'react';
import { gridViewPropsAreEqual } from 'Controls/gridReact';
import { IGridViewColumnScrollProps, IInnerDeviceViewProps } from './interface';
import { MobileViewColumnScroll } from './MobileView';
import DesktopViewColumnScroll from './DesktopView';
import { ColumnScrollContext } from 'Controls/columnScrollReact';
import 'css!Controls/gridColumnScroll';

export { IGridViewColumnScrollProps };

interface IViewChooserProps extends IGridViewColumnScrollProps {
    isMobile: boolean;
    transformedWrapperClassName: string;
    shouldUseFakeRender: boolean;
}

function getClassNamePropsForDevice(
    device: 'mobile' | 'desktop',
    transformedWrapperClassName: string
): Pick<
    IInnerDeviceViewProps,
    | 'fixedWrapperClassName'
    | 'viewClassName'
    | 'transformedWrapperClassName'
    | 'hydrationPreRenderClassName'
> {
    return {
        hydrationPreRenderClassName:
            'controls-GridReact__view_columnScroll_hydrationPreRender ' +
            `controls-GridReact__view_columnScroll_hydrationPreRender_${device}`,
        viewClassName:
            'controls-GridReact__view_columnScroll ' +
            `controls-GridReact__view_columnScroll_${device}`,
        fixedWrapperClassName:
            'controls-GridReact__view_columnScroll_fixed ' +
            `controls-GridReact__view_columnScroll_${device}_fixed`,
        transformedWrapperClassName:
            'controls-GridReact__view_columnScroll_scrollable ' +
            `controls-GridReact__view_columnScroll_${device}_scrollable ` +
            transformedWrapperClassName,
    };
}

const MemoViewChooser = React.memo(function ViewChooser(
    props: IViewChooserProps
): React.FunctionComponentElement<IViewChooserProps> {
    const deviceClassNameProps = getClassNamePropsForDevice(
        props.isMobile ? 'mobile' : 'desktop',
        props.transformedWrapperClassName
    );

    if (props.isMobile) {
        return <MobileViewColumnScroll {...props} {...deviceClassNameProps} />;
    } else {
        return <DesktopViewColumnScroll {...props} {...deviceClassNameProps} />;
    }
});

export default React.memo(
    React.forwardRef(function ViewColumnScroll(
        props: IGridViewColumnScrollProps
    ): React.ReactElement {
        const context = React.useContext(ColumnScrollContext);

        const [shouldUseFakeRender, setShouldUseFakeRender] = React.useState(
            props.columnScrollStartPosition === 'end'
        );

        React.useEffect(() => {
            if (shouldUseFakeRender && context.isNeedByWidth) {
                setShouldUseFakeRender(false);
            }
        }, [context.isNeedByWidth]);

        return (
            <MemoViewChooser
                {...props}
                shouldUseFakeRender={shouldUseFakeRender}
                transformedWrapperClassName={
                    context.SELECTORS.ROOT_TRANSFORMED_ELEMENT
                }
                isMobile={context.isMobile}
            />
        );
    }),
    gridViewPropsAreEqual
);
