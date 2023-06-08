import { useState, useCallback } from 'react';
import { BooleanType, NumberType, ObjectMeta, ObjectType, StringType } from 'Types/meta';
import { EditorsProvider } from 'Controls-editors/object-type';
import { ObjectEditorPopup } from 'Controls-editors/objectEditorPopup';
import {
    BooleanEditor,
    NumberEditor,
    ObjectEditor,
    StringEditor,
} from 'Controls-editors/properties';
import { createElement } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/ObjectTypeEditor/PropsDemoEditor';

const defaultEditors = {
    [StringType.getId()]: StringEditor,
    [NumberType.getId()]: NumberEditor,
    [BooleanType.getId()]: BooleanEditor,
    [ObjectType.getId()]: ObjectEditor,
};

export function PropsDemoEditorPopup({
    metaType,
    control,
}: {
    metaType: ObjectMeta<any>;
    control?: any;
}) {
    const [props, setProps] = useState(metaType.getDefaultValue() || {});

    const onClose = useCallback(() => {
        alert('Closed');
    }, []);

    return (
        <div>
            <div className="PropsDemoEditor__Content">
                <div>
                    <EditorsProvider value={defaultEditors}>
                        <ObjectEditorPopup
                            metaType={metaType}
                            value={props}
                            onChange={setProps}
                            onClose={onClose}
                        />
                    </EditorsProvider>
                </div>
                <div style={{ minWidth: 300, marginLeft: 20 }}>
                    <div style={{ marginBottom: 20 }}>
                        {control
                            ? createElement(control, {
                                  ...props /* Копируем props, потому-что createElement мутирует его */,
                              })
                            : null}
                    </div>
                    <pre>{JSON.stringify(props, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
