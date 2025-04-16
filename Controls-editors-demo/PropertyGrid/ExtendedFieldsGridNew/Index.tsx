import { ForwardedRef, forwardRef } from 'react';
import { ExtendedFieldsExampleMeta } from './meta';
import { PropsDemoEditorGridNew } from 'Controls-editors-demo/PropertyGrid/PropsDemoEditorGridNew';

const BaseEditorsGrid = forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <PropsDemoEditorGridNew metaType={ExtendedFieldsExampleMeta} />
        </div>
    );
});

export default BaseEditorsGrid;
