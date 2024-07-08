import { forwardRef, useState, useCallback, useRef } from 'react';
import { RecordSet } from 'Types/collection';
import { SlidingPanelOpener, DialogOpener, StickyOpener, StackOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import { Selector } from 'Controls/dropdown';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { Checkbox } from 'Controls/checkbox';
import { DoubleSwitch } from 'Controls/toggle';
import { Label } from 'Controls/input';
import 'css!Controls/CommonClasses';

const POPUP_TYPES_RECORDSET: RecordSet = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Диалоговое окно',
            type: 'Dialog',
        },
        {
            id: '2',
            title: 'Стэковое окно',
            type: 'Stack',
        },
        {
            id: '3',
            title: 'Стики окно',
            type: 'Sticky',
        },
        {
            id: '4',
            title: 'Шторка',
            type: 'Sliding',
        },
    ],
});

const POPUP_TYPES_OPENERS = {
    Dialog: DialogOpener,
    Stack: StackOpener,
    Sticky: StickyOpener,
    Sliding: SlidingPanelOpener,
};

function Index(props, ref) {
    const targetRef = useRef();

    const [popupTypeSelectedKeys, setPopupTypeSelectedKeys] = useState([1]);
    const [isMobileReadOnly, setIsMobileReadOnly] = useState(false);
    const [allowAdaptive, setAllowAdaptive] = useState(false);
    const [isHeightListActivated, setIsHeightListActivated] = useState(false);
    const [isPositionBottom, setIsPositionBottom] = useState(true);
    const [isModal, setIsModal] = useState(false);

    const selectedKeysChanged = useCallback((selectedKeys) => {
        setPopupTypeSelectedKeys(selectedKeys);
        const popupTypeModel = POPUP_TYPES_RECORDSET.getRecordById(selectedKeys[0]);
        const popupType = popupTypeModel.get('type');
        if (popupType === 'Stack') {
            setIsMobileReadOnly(true);
        } else {
            setIsMobileReadOnly(false);
        }
    }, []);

    const allowAdaptiveValueChanged = useCallback((value) => {
        setAllowAdaptive(value);
    }, []);

    const heightListActivatedValueChanged = useCallback((value) => {
        setIsHeightListActivated(value);
    }, []);

    const positionValueChanged = useCallback((value) => {
        setIsPositionBottom(value);
    }, []);

    const modalValueChanged = useCallback((value) => {
        setIsModal(value);
    }, []);

    const getSlidingPositionReadOnly = () => {
        const popupTypeModel = POPUP_TYPES_RECORDSET.getRecordById(popupTypeSelectedKeys[0]);
        const popupType = popupTypeModel.get('type');
        return (
            isMobileReadOnly ||
            (popupType !== 'Sliding' && !unsafe_getRootAdaptiveMode().device.isPhone()) ||
            (!allowAdaptive && unsafe_getRootAdaptiveMode().device.isPhone())
        );
    };

    const openPopup = useCallback(() => {
        const popupTypeModel = POPUP_TYPES_RECORDSET.getRecordById(popupTypeSelectedKeys[0]);
        const popupType = popupTypeModel.get('type');
        const opener = POPUP_TYPES_OPENERS[popupType];
        const config = {
            template: `Controls-demo/Popup/SlidingPanel/PopupTemplates/${popupType}Template`,
            modal: isModal,
            allowAdaptive,
            templateOptions: {
                allowAdaptive,
            },
            slidingPanelOptions: {
                position: isPositionBottom ? 'bottom' : 'top',
            },
        };
        if (isHeightListActivated) {
            config.slidingPanelOptions.heightList = [200, 300, 400];
        }
        if (popupType === 'Sticky') {
            config.target = targetRef.current;
        }
        if (popupType === 'Sliding') {
            config.isAdaptive = false;
            config.desktopMode = popupType === 'Stack' ? 'stack' : 'dialog';
        }
        new opener(config).open({});
    }, [popupTypeSelectedKeys, allowAdaptive, isHeightListActivated, isPositionBottom, isModal]);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div className="controlsDemo__flexColumn">
                <Selector
                    items={POPUP_TYPES_RECORDSET}
                    keyProperty="id"
                    displayProperty="title"
                    selectedKeys={popupTypeSelectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    customEvents={['selectedKeysChanged']}
                    data-qa="Controls-demo_Popup_SlidingPanel__popup-type"
                />
                <Checkbox
                    value={allowAdaptive}
                    caption="Включить опцию allowAdaptive"
                    onValueChanged={allowAdaptiveValueChanged}
                    customEvents={['onValueChanged']}
                    readOnly={!unsafe_getRootAdaptiveMode().device.isPhone()}
                    data-qa="Controls-demo_Popup_SlidingPanel__allowAdaptive"
                />
                <Checkbox
                    caption="Включить опцию heightList [200, 300, 400]"
                    value={isHeightListActivated}
                    onValueChanged={heightListActivatedValueChanged}
                    customEvents={['onValueChanged']}
                    readOnly={!allowAdaptive || !unsafe_getRootAdaptiveMode().device.isPhone()}
                    data-qa="Controls-demo_Popup_SlidingPanel__heightList"
                />
                <Checkbox
                    caption="Включить модальность окна"
                    value={isModal}
                    onValueChanged={modalValueChanged}
                    customEvents={['onValueChanged']}
                    data-qa="Controls-demo_Popup_SlidingPanel__modal"
                />

                <Label caption="Позиционирование шторки" />
                <DoubleSwitch
                    onCaption="Снизу"
                    offCaption="Сверху"
                    value={isPositionBottom}
                    onValueChanged={positionValueChanged}
                    customEvents={['onValueChanged']}
                    readOnly={getSlidingPositionReadOnly()}
                    data-qa="Controls-demo_Popup_SlidingPanel__position"
                />
                <Button
                    ref={targetRef}
                    onClick={openPopup}
                    caption="Открыть окно"
                    data-qa="Controls-demo_Popup_SlidingPanel__openPopup"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
