import { useState, forwardRef } from 'react';
import { Label, Number } from 'Controls/input';
import { Title } from 'Controls/heading';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { WidgetSizeType } from './meta';

function SizeEditorDemo(_, ref) {
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
        <div className="controlsDemo__wrapper" ref={ref}>
            <div>
                <PropertyGrid metaType={WidgetSizeType} value={value} onChange={setValue} />
                <div>{JSON.stringify(value)}</div>
            </div>
            <div className="controls-margin_top-xs">
                <Title caption="Размер контейнера" fontSize="3xl" readOnly />
                <div>
                    <Label caption="Ширина" />
                    <Number
                        className="controls-Input__width-6ch"
                        value={containerSize.width}
                        valueChangedCallback={(value) => onChangeContainerSize('width', value)}
                        data-qa="Controls-editors-demo_PropertyGrid_editors_SizeEditor__containerWidth"
                    />
                </div>
                <div>
                    <Label caption="Высота" />
                    <Number
                        className="controls-Input__width-6ch"
                        value={containerSize.height}
                        valueChangedCallback={(value) => onChangeContainerSize('height', value)}
                        data-qa="Controls-editors-demo_PropertyGrid_editors_SizeEditor__containerHeight"
                    />
                </div>
            </div>
            <div
                style={{
                    ...containerSize,
                    marginTop: 20,
                    border: '3px solid black',
                }}
                data-qa="Controls-editors-demo_PropertyGrid_editors_SizeEditor__container"
            >
                <div
                    style={{
                        background: 'yellow',
                        // aspectRatio без этого не отрабатывает правильно
                        overflow: 'hidden',
                        ...value,
                        aspectRatio: value.aspectRatio?.toString(),
                    }}
                    data-qa="Controls-editors-demo_PropertyGrid_editors_SizeEditor__yellowElement"
                >
                    <p>Demo content</p>
                    <p>Demo content</p>
                </div>
            </div>
        </div>
    );
}

export default forwardRef(SizeEditorDemo);
