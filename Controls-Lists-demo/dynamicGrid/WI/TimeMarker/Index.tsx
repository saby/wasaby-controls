import { TimeMarker } from 'Controls-Lists/dynamicGrid';
import * as React from 'react';

function Index() {
    const [markerContentRender, setMarkerContentRender] = React.useState('Текст');
    return (
        <div>
            <input
                type="text"
                value={markerContentRender}
                onChange={(e) => setMarkerContentRender(e.target.value)}
                placeholder="Текст для треугольника"
            />
            <div style={{ height: '700px' }}>
                <TimeMarker
                    style={{ left: '600px' }}
                    markerContentRender={markerContentRender}
                    lineStyle={{ height: 400 }}
                />
            </div>
        </div>
    );
}

export default Index;
