import { CSSProperties, useCallback, useRef, useState } from 'react';
import { Button } from 'Controls/buttons';
import { ObjectMeta } from 'Meta/types';
import 'css!DemoStand/Controls-demo';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { TTarget } from 'Controls/popup';

type PropsDemoEditorPopupProps = {
    metaType: ObjectMeta<any>;
    dataQA: string;
};

const style: CSSProperties = {
    textWrap: 'wrap',
};

export function PropsDemoEditorPopup({ metaType, dataQA }: PropsDemoEditorPopupProps) {
    const btnOpenerRef = useRef<TTarget>(null);
    const [props, setProps] = useState({});

    const openEditorHandler = useCallback(() => {
        const opener = new ObjectEditorOpener();

        opener.open({
            metaType,
            autoSave: true,
            value: props,
            onChange: setProps,
            refresh: false,
            popupOptions: {
                actionOnScroll: 'track',
                closeOnOutsideClick: true,
                target: btnOpenerRef.current as TTarget,
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
            <div className="tw-flex tw-flex-col">
                <div>
                    <Button
                        ref={btnOpenerRef}
                        onClick={openEditorHandler}
                        data-qa={dataQA + '-button'}
                        caption="Открыть propertyGridPopup"
                    />
                </div>
                <div className="controlsDemo_fixedWidth300 controls-margin_top-m">
                    <pre data-qa={dataQA + '-json'} style={style}>
                        {JSON.stringify(props, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
