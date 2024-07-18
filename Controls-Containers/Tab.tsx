import { ITabProps } from './interface';
import { ForwardedRef, forwardRef } from 'react';
import { PlaceholderWrapper } from 'FrameControls/placeholder';

const View = forwardRef(function View(props: ITabProps, ref: ForwardedRef<HTMLDivElement>) {
    const { dataName, className = '' } = props;

    return (
        <div
            ref={ref}
            data-name={dataName}
            className={
                'ws-flexbox ws-flex-column Tabs__template-content controls-margin_left-m controls-margin_right-m ' +
                className
            }
        >
            <PlaceholderWrapper visibility={'always'}>{props.children}</PlaceholderWrapper>
        </div>
    );
});

View.displayName = 'Controls-Containers/Tab:View';
export { View };
