import { forwardRef } from 'react';
import MainIndex from './Autotest/Main/Index';
import AdditionalIndex from './Autotest/Additional/Index';
import 'css!Controls/CommonClasses';

export default forwardRef(function Money(props, ref) {
    const rootClass = props.className + ' tw-flex tw-flex-wrap';
    return (
        <div ref={ref} className={rootClass}>
            <MainIndex />
            <AdditionalIndex />
        </div>
    );
});
