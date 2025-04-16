import { BaseEditorsTypeDefaults } from './meta';
import { PropsDemoEditorGridNew } from '../PropsDemoEditorGridNew';
import { ForwardedRef, forwardRef } from 'react';

export default forwardRef(function BaseEditorsGrid(_, ref: ForwardedRef<HTMLDivElement>) {
    return <PropsDemoEditorGridNew metaType={BaseEditorsTypeDefaults} ref={ref} />;
});
