import { forwardRef, useCallback, useEffect, useRef, useState, useContext } from 'react';
import { Controller } from 'Controls/form';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { Button } from 'Controls/buttons';
import { default as Content } from './Content';

const FIRST_DATA = new Memory({
    keyProperty: 'id',
    data: [{
        id: 0,
        caption: 'First',
        additionalText: 'First additional',
    }],
});

const FIRST_RECORD = new Model({
    keyProperty: 'id',
    rawData: {
        id: 0,
        caption: 'First',
        additionalText: 'First additional',
    },
});

export default forwardRef(function RegisterFromOperations(props: any, ref) {
    const [source, setSource] = useState(FIRST_DATA);
    const [record, setRecord] = useState(FIRST_RECORD);
    const createSuccessedHandler = useCallback((rec) => {
        setRecord(rec);
    }, []);
    const formRef = useRef<Controller>();
    return (
        <div
            className="register-from-operations tw-flex tw-flex-col controlsDemo_fixedWidth500"
            ref={ref}
        >
            <Controller
                source={source}
                record={record}
                onCreateSuccessed={createSuccessedHandler}
                onUpdateSuccessed={setRecord}
                onReadSuccessed={setRecord}
                ref={formRef}
            >
                <Content/>
            </Controller>
            <div className="tw-flex">
                <Button onClick={() => formRef.current?.update()} caption="Сохранить" />
            </div>
        </div>
    );
});
