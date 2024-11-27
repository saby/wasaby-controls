import { useState } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { WidgetSizeType } from './meta';

function SizeEditorDemo() {
    const [value, setValue] = useState({
        width: '250px',
        height: '400px',
        minWidth: 0,
        maxWidth: '250px',
    });

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <div>
                <PropertyGrid metaType={WidgetSizeType} value={value} onChange={setValue} />
                <div>{JSON.stringify(value)}</div>
            </div>
            <div
                style={{
                    marginTop: 20,
                    border: '3px solid red',
                    ...value,
                }}
            >
                Text text text
            </div>
        </div>
    );
}

export default SizeEditorDemo;
