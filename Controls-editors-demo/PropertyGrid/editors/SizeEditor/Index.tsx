import { useState } from 'react';
import { Label, Number } from 'Controls/input';
import { Title } from 'Controls/heading';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { WidgetSizeType } from './meta';
import { setContainer } from 'WS/lib/Control/Control.compatible';

function SizeEditorDemo() {
    const [value, setValue] = useState({
        width: '250px',
        height: '400px',
        minWidth: 0,
        maxWidth: '250px',
        aspectRatio: 1.5,
    });
    const [containerSize, setContainerSize] = useState({ width: 500, height: 300 });
    const onChangeContainerSize = (key: 'width' | 'height', value: number) =>
        setContainerSize({ ...containerSize, [key]: value });

    return (
        <div className="controlsDemo__wrapper">
            <div>
                <PropertyGrid metaType={WidgetSizeType} value={value} onChange={setValue} />
                <div>{JSON.stringify(value)}</div>
            </div>
            <div className="controls-margin_top-xs">
                <Title caption="Размер контейнера" fontSize="3xl" readOnly />
                <p>
                    <Label caption="Ширина" />
                    <Number
                        className="controls-Input__width-6ch"
                        value={containerSize.width}
                        valueChangedCallback={(value) => onChangeContainerSize('width', value)}
                    />
                </p>
                <p>
                    <Label caption="Высота" />
                    <Number
                        className="controls-Input__width-6ch"
                        value={containerSize.height}
                        valueChangedCallback={(value) => onChangeContainerSize('height', value)}
                    />
                </p>
            </div>
            <div
                style={{
                    ...containerSize,
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
