import { useCallback, useRef, useState } from 'react';
import { ObjectMeta } from 'Types/meta';
import { createElement, IComponent } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/ObjectTypeEditor/PropsDemoEditor';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';

type PropsDemoEditorPopupProps = {
    metaType: ObjectMeta<any>;
    control?: IComponent;
};

export function PropsDemoEditorPopup({ metaType, control }: PropsDemoEditorPopupProps) {
    const btnOpenerRef = useRef(null);
    const [props, setProps] = useState({});

    const openEditorHandler = useCallback(() => {
        const opener = new ObjectEditorOpener();

        opener.open({
            metaType,
            autoSave: true,
            value: props,
            onChange: setProps,
            popupOptions: {
                opener: btnOpenerRef.current,
                actionOnScroll: 'track',
                closeOnOutsideClick: true,
                target: btnOpenerRef.current,
                fittingMode: 'overflow',
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'left',
                },
                direction: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            },
        });
    }, [props]);

    return (
        <div>
            <div className="PropsDemoEditor__Content">
                <div>
                    <button ref={btnOpenerRef} onClick={openEditorHandler}>
                        Открыть propertyGridPopup
                    </button>
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
