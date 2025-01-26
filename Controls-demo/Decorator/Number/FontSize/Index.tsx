import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Number(props, ref) {
    const data: string[] = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '8xl'];
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            {data.map((value) => {
                return (
                    <div className="controlsDemo__cell" key={value}>
                        <div className="controls-text-label">fontSize={value}</div>
                        <Number value="1234567.89" fontSize={value} />
                    </div>
                );
            })}
        </div>
    );
});
