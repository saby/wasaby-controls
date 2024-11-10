import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState, useMemo } from 'react';
import { EditorsProvider } from 'Controls-editors/object-type';
import ObjectEditor from 'Controls-editors/ObjectEditor';

export default function ObjectEditorDemo() {
    const [value, setValue] = useState({
        name: 'Сергей',
        surname: 'Михайлов',
        job: {
            jobName: 'Программист',
            salary: '100000',
        },
    });

    const editors = useMemo(() => {
        return {
            ObjectMetaEditorDemo: ObjectEditor,
        };
    }, []);

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            <EditorsProvider value={editors}>
                <PropertyGrid
                    metaType={PersonType}
                    value={value}
                    onChange={setValue}
                    captionColumnWidth={'minmax(140px, max-content)'}
                />
            </EditorsProvider>
        </div>
    );
}
