import { ITabProps } from './interface';
import { ForwardedRef, forwardRef, useMemo } from 'react';
import { PlaceholderWrapper } from 'FrameControls/placeholder';
import { AdaptiveContainer, useAdaptiveMode } from 'UICore/Adaptive';

const TAB_PADDING = 26;

const View = forwardRef(function View(props: ITabProps, ref: ForwardedRef<HTMLDivElement>) {
    const { dataName, className = '' } = props;
    const adaptiveMode = useAdaptiveMode();
    const contentWidth = useMemo(() => {
        const containerWidth = adaptiveMode?.container.clientWidth.value;
        if (containerWidth) {
            return containerWidth - TAB_PADDING;
        }
    }, [adaptiveMode]);

    return (
        <div
            ref={ref}
            data-name={dataName}
            className={
                'ws-flexbox ws-flex-column Tabs__template-content controls-margin-m ' + className
            }
        >
            <AdaptiveContainer width={contentWidth}>
                <PlaceholderWrapper visibility={'always'}>{props.children}</PlaceholderWrapper>
            </AdaptiveContainer>
        </div>
    );
});

View.displayName = 'Controls-Containers/Tab:View';
export { View };
