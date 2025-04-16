import { useState, forwardRef, ForwardedRef } from 'react';
import { ObjectMeta } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { createElement } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-editors-demo/PropertyGrid/PropsDemoEditor';

export const PropsDemoEditorGrid = forwardRef(function PropsDemoEditorGrid(
    {
        metaType,
        control,
    }: {
        metaType: ObjectMeta<any>;
        control?: any;
    },
    ref: ForwardedRef<HTMLDivElement>
) {
    const [props, setProps] = useState({});

    return (
        <div ref={ref}>
            <div className="PropsDemoEditor__Content">
                <div>
                    <PropertyGrid value={props} metaType={metaType} onChange={setProps} />
                </div>
                <div style={{ minWidth: 300, marginLeft: 20 }}>
                    <div style={{ marginBottom: 20 }}>
                        {control
                            ? createElement(control, {
                                  ...props /* Копируем props, потому-что createElement мутирует его */,
                              })
                            : null}
                    </div>
                    <pre data-qa="Controls-demo_PropertyGridNew__editingObject">
                        {JSON.stringify(props, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
});
