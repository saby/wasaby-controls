import { useState } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { WidgetSizeType } from './meta';

function SizeEditorDemo() {
    const [value, setValue] = useState({
        width: '250px',
        height: '400px',
        minWidth: 0,
        maxWidth: '250px',
        aspectRatio: 1.5,
    });

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <div>
                <PropertyGrid metaType={WidgetSizeType} value={value} onChange={setValue} />
                <div>{JSON.stringify(value)}</div>
            </div>
            <div
                style={{
                    width: 500,
                    height: 300,
                    marginTop: 20,
                    border: '3px solid black',
                }}
            >
                <div
                    style={{
                        display: 'inline-block',
                        background: 'yellow',
                        ...value,
                    }}
                >
                    <p>Demo content</p>
                    <p>Demo content</p>
                </div>
            </div>
        </div>
    );
}

export default SizeEditorDemo;
