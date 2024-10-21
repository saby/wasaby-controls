import { IPersonType } from './meta';
import { PropertyGrid, RecordPropertyGrid } from 'Controls-editors/propertyGrid';
import { forwardRef, useState } from 'react';
import { Record, adapter } from 'Types/entity';

const PGDemo = forwardRef((_, ref) => {
    const [value, setValue] = useState(
        new Record({
            rawData: {
                _type: 'record',
                d: [],
                s: [
                    { n: 'name', t: 'Строка' },
                    { n: 'age', t: 'Число целое' },
                    { n: 'gender', t: 'Строка' },
                ],
            },
            adapter: new adapter.Sbis(),
        })
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            <RecordPropertyGrid value={value} onChange={setValue} metaType={IPersonType}>
                <PropertyGrid />
            </RecordPropertyGrid>
            <div>Age: {value.get('age')}</div>
            <div>Gender: {value.get('gender')}</div>
            <div>Name: {value.get('name')}</div>
        </div>
    );
});

export default PGDemo;
