import { useState, useCallback } from 'react';
import Input from 'Controls-Name/Input';
import { Text } from 'Controls/input';
import { getSuggestSource } from 'Controls-Name-demo/doc/SuggestMultiple/Data';
import 'css!Controls-Name-demo/doc/SuggestMultiple/Index';
import { Record } from 'Types/entity';

const fields = ['lastName', 'firstName', 'middleName'];

const SUGGEST_TEMPLATE = {
    templateName: 'wml!Controls-Name-demo/doc/SuggestMultiple/SuggestTemplate',
};

export default function Demo() {
    // eslint-disable-next-line react/hook-use-state
    const [suggestSource] = useState(() => {
        return getSuggestSource();
    });
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const chooseHandler = useCallback((item: Record) => {
        if (item.get('type') === 'person') {
            setPosition(item.get('position'));
        }
    }, []);
    return (
        <div>
            <div>
                <Text
                    className="demo__position-input"
                    value={position}
                    onValueChanged={setPosition}
                    placeholder="Должность"
                ></Text>
            </div>
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
                onChoose={chooseHandler}
                suggestTemplate={SUGGEST_TEMPLATE}
            />
        </div>
    );
}
