import { IPersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState } from 'react';

function PGDemo() {
    const [value, setValue] = useState({});

    return <PropertyGrid metaType={IPersonType} value={value} onChange={setValue} />;
}

export default PGDemo;
