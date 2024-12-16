import { BaseEditorsTypeDefaults } from './meta';
import { PropsDemoEditorGrid } from '../PropsDemoEditorGrid';
import { forwardRef } from 'react';

export default forwardRef(function BaseEditorsGrid(_, ref) {
    return <PropsDemoEditorGrid metaType={BaseEditorsTypeDefaults} ref={ref} />;
});
