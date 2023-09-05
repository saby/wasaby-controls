import { useState, useCallback } from 'react';
import { ObjectMeta } from 'Types/meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { createElement } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-editors-demo/ObjectTypeEditor/PropsDemoEditor';

export function PropsDemoEditorGrid({
    metaType,
    control,
}: {
    metaType: ObjectMeta<any>;
    control?: any;
}) {
    const [props, setProps] = useState({});

    const onClose = useCallback(() => {
        alert('Closed');
    }, []);

    return (
        <div>
            <div className="PropsDemoEditor__Content">
                <div>
                    <PropertyGrid
                        metaType={metaType}
                        value={props}
                        onChange={setProps}
                        onClose={onClose}
                    />
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
