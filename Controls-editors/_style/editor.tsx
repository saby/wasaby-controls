import { memo } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import type {
    ObjectMeta,
} from 'Types/meta';
import { IPropertyEditorProps } from 'Types/meta';


const STYLE_PROPERTY_GRID_ROW = {
    display: 'block',
    gridColumnEnd: 3,
    gridColumnStart: 1,
};

const StyleEditor = memo(function StyleEditor({ type, value, onChange }: IPropertyEditorProps<object>) {
    return <div style={ STYLE_PROPERTY_GRID_ROW }>
        <PropertyGrid
            metaType={ type as ObjectMeta<object> }
            value={ value }
            onChange={ onChange }
        />
    </div>;
});
export default StyleEditor;