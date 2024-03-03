import { ITabProps } from './interface';
import { ForwardedRef, forwardRef } from 'react';

const View = forwardRef(function View(props: ITabProps, ref: ForwardedRef<HTMLDivElement>) {
    const { dataName, className = '' } = props;

    return (
        <div
            ref={ref}
            data-name={dataName}
            className={'ws-flexbox ws-flex-column Tabs__template-content ' + className}
        >
            {props.children}
        </div>
    );
});

View.displayName = 'Controls-Containers/Tab:View';
export { View };
