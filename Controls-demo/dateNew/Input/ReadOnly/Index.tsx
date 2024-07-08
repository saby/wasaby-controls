import { Input } from 'Controls/date';
import { useState, forwardRef } from 'react';
import 'css!DemoStand/Controls-demo';

function ReadOnly(props, ref) {
    const [value, setValue] = useState(new Date(2022, 0));
    return <div className='controlsDemo__wrapper'>
        <div ref={ref}>
            <Input value={value} readOnly={true} onValueChanged={(newValue) => { setValue(newValue); }}/>
        </div>
    </div>;
}

export default forwardRef(ReadOnly);
