import { useState } from 'react';
import Input from 'Controls-Name/Input';
import 'css!Controls-Name-demo/doc/Base/Index';

const fields = ['lastName', 'firstName', 'middleName'];

export default function Demo() {
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
        ></Input>
    );
}
