import { Button } from 'Controls/buttons';
import { Context as FreezeContext } from 'Controls/freezeContext';
import { DialogOpener } from 'Controls/popup';
import { ISwitchableAreaItem, View as SwitchableAreaView } from 'Controls/switchableArea';
import { LegacyRef, forwardRef, useContext, useEffect, useRef, useState } from 'react';

interface ItemWithOpenerProps {
    number: number;
    className?: string;
}

const templateItem = forwardRef(function ItemWithOpener(
    { number, className }: ItemWithOpenerProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const dialogOpener = useRef(new DialogOpener());
    const { isFreeze } = useContext(FreezeContext);

    useEffect(() => {
        if (isFreeze) {
            dialogOpener.current.close();
        }
    }, [isFreeze, number]);

    const openDialog = () => {
        dialogOpener.current.open({
            template: 'Controls/popupTemplate:Dialog',
            opener: null,
            allowAdaptive: true,
            templateOptions: {
                closeButtonVisible: false,
                headingCaption: 'Диалог №' + number,
                bodyContentTemplate: (
                    <div className="controlsDemo__height100 controlsDemo_fixedWidth350">
                        {'Текст диалога ' + number}
                    </div>
                ),
                number,
                allowAdaptive: true,
            },
        });
    };

    return (
        <div ref={ref} className={className}>
            <div style={{ padding: '20px' }}>
                <div>Текст {number}</div>
                <Button caption="Открыть окно" onClick={openDialog} />
            </div>
        </div>
    );
});

export default forwardRef(function FreezingContext(_, ref: LegacyRef<HTMLDivElement>) {
    const items: ISwitchableAreaItem[] = [
        {
            key: 0,
            itemTemplate: templateItem,
            templateOptions: {
                number: 1,
                additionalOptions: true,
            },
        },
        {
            key: 1,
            itemTemplate: templateItem,
            templateOptions: {
                number: 2,
                additionalOptions: false,
            },
        },
    ];
    const [selectedKey, setSelectedKey] = useState(0);

    const onClickHandler = (key: number) => {
        setSelectedKey(key);
    };

    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div data-qa="controlsDemo_capture">
                <SwitchableAreaView selectedKey={selectedKey} items={items}></SwitchableAreaView>
            </div>
            <div className="controlsDemo_fixedWidth500 controlsDemo__flex">
                <div
                    className="controlsDemo__button ControlsDemo-SwitchableArea__button_0"
                    onClick={() => onClickHandler(0)}
                >
                    Content 1
                </div>
                <div
                    className="controlsDemo__button ControlsDemo-SwitchableArea__button_1"
                    onClick={() => onClickHandler(1)}
                >
                    Content 2
                </div>
            </div>
        </div>
    );
});
