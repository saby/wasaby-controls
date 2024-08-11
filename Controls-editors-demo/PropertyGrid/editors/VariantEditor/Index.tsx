import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState } from 'react';

export default function VariantEditor() {
    const [value, setValue] = useState({
        name: 'Сергей',
        surname: 'Михайлов',
        job: {
            element_id: 'engineer',
            data: {
                speciality: {
                    element_id: 'programmer',
                    data: {
                        programmingLanguage: 'JavaScript',
                        experience: '10',
                    },
                },
                salary: '100000',
            },
        },
    });

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <PropertyGrid
                metaType={PersonType}
                value={value}
                onChange={setValue}
                captionColumnWidth={'minmax(220px, max-content)'}
            />
        </div>
    );
}
