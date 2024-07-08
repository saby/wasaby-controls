import { forwardRef } from 'react';
import { ExtendedFieldsExampleMeta } from './meta';
import { PropsDemoEditorGrid } from '../PropsDemoEditorGrid';

const BaseEditorsGrid = forwardRef((_, ref) => {
    return (
        <div ref={ref}>
            <PropsDemoEditorGrid metaType={ExtendedFieldsExampleMeta} />
        </div>
    );
});

export default BaseEditorsGrid;
