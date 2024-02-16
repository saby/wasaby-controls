import { IPersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { forwardRef, useState } from 'react';

const PGDemo = forwardRef((_, ref) => {
    const [value, setValue] = useState({});

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            <PropertyGrid metaType={IPersonType} value={value} onChange={setValue} />
        </div>
    );
});

export default PGDemo;
