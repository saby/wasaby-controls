import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState } from 'react';

export default function VariantEditor() {
    const [value, setValue] = useState({
        name: 'Сергей',
        surname: 'Михайлов',
        job: {
            jobName: 'engineer',
            salary: '100000',
            speciality: 'Программист',
        },
    });

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            <PropertyGrid
                metaType={PersonType}
                value={value}
                onChange={setValue}
                captionColumnWidth={'minmax(140px, max-content)'}
            />
        </div>
    );
}
