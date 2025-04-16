import { ForwardedRef, forwardRef } from 'react';
import { ExtendedFieldsExampleMeta } from './meta';
import { PropsDemoEditorGrid } from '../PropsDemoEditorGrid';

const BaseEditorsGrid = forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <PropsDemoEditorGrid metaType={ExtendedFieldsExampleMeta} />
        </div>
    );
});

export default BaseEditorsGrid;
