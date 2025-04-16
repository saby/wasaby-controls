import { useState } from 'react';
import Input from 'Controls-Name/Input';
import { getSuggestSource } from 'Controls-Name-demo/doc/Suggest/Data';
import 'css!Controls-Name-demo/doc/Suggest/Index';

const fields = ['lastName', 'firstName', 'middleName'];

const SUGGEST_TEMPLATE = {
    templateName: 'wml!Controls-Name-demo/doc/Suggest/SuggestTemplate',
};

export default function Demo() {
    // eslint-disable-next-line react/hook-use-state
    const [suggestSource] = useState(() => {
        return getSuggestSource();
    });
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    return (
        <Input
            className="demo__name-input"
            firstName={firstName}
            onFirstNameChanged={setFirstName}
            middleName={middleName}
            onMiddleNameChanged={setMiddleName}
            lastName={lastName}
            onLastName={setLastName}
            fields={fields}
            keyProperty="id"
            displayProperty="suggestValue"
            source={suggestSource}
            suggestTemplate={SUGGEST_TEMPLATE}
        />
    );
}
