import { forwardRef, LegacyRef, useState, useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';
import { showType, View } from 'Controls/toolbars';
import 'css!Controls-demo/PopupTemplate/Stack/Header/styles';
import { RecordSet } from 'Types/collection';
import { Title } from 'Controls/heading';
import { Checkbox } from 'Controls/checkbox';

function ImageContentTemplate() {
    return <div className="SlidingStackTemplateDemo__image"></div>;
}

const TOOLBAR_ITEMS = new RecordSet({
    rawData: [
        {
            id: '1',
            showType: showType.MENU,
            icon: 'icon-Time',
            '@parent': false,
            parent: null,
        },
        {
            id: '3',
            icon: 'icon-Print',
            showType: showType.MENU,
            title: 'Распечатать',
            caption: 'Распечатать',
            viewMode: 'link',
            '@parent': false,
            parent: null,
        },
        {
            id: '4',
            icon: 'icon-Linked',
            showType: showType.MENU,
            fontColorStyle: 'secondary',
            viewMode: 'ghost',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы',
            '@parent': true,
            parent: null,
        },
        {
            id: '5',
            viewMode: 'icon',
            showType: showType.MENU,
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null,
        },
        {
            id: '6',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null,
            readOnly: true,
        },
    ],
    keyProperty: 'id',
});

function ToolbarContentTemplate() {
    return (
        <View
            items={TOOLBAR_ITEMS}
            className="controlsDemo-SlidingStackTemplate__toolbar"
            keyProperty="id"
            menuIconSize="m"
            inlineHeight="l"
        />
    );
}

function HeaderContentTemplate() {
    return (
        <div className="tw-flex tw-flex-col tw-justify-start">
            <Title fontSize="2xl" caption="Заголовок" />
            <Title
                fontColorStyle="label"
                fontSize="xs"
                fontWeight="normal"
                caption="Подзаголовок"
            />
        </div>
    );
}

export default forwardRef(function SlidingStackTemplateDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const applyButtonClickCallback = () => {
        alert('Клик на кнопку подтверждения');
    };

    const [closeButtonVisible, setCloseButtonVisible] = useState(true);
    const handleChangeCloseButtonVisible = useCallback((newValue: boolean) => {
        setCloseButtonVisible(newValue);
    }, []);

    const [counterValueVisible, setCounterValueVisible] = useState(true);
    const handleChangeCounterValueVisible = useCallback((newValue: boolean) => {
        setCounterValueVisible(newValue);
    }, []);

    const [imageContentTemplateVisible, setImageContentTemplateVisible] = useState(true);
    const handleChangeImageContentTemplateVisible = useCallback((newValue: boolean) => {
        setImageContentTemplateVisible(newValue);
    }, []);

    const [headerContentTemplateVisible, setHeaderContentTemplateVisible] = useState(true);
    const handleChangeHeaderContentTemplateVisible = useCallback((newValue: boolean) => {
        setHeaderContentTemplateVisible(newValue);
        if (newValue) {
            handleChangeHeadingCaptionVisible(false);
        }
    }, []);

    const [headingCaptionVisible, setHeadingCaptionVisible] = useState(false);
    const handleChangeHeadingCaptionVisible = useCallback((newValue: boolean) => {
        setHeadingCaptionVisible(newValue);
        if (newValue) {
            handleChangeHeaderContentTemplateVisible(false);
        }
    }, []);

    const [toolbarContentTemplateVisible, setToolbarContentTemplateVisible] = useState(true);
    const handleChangeToolbarContentTemplateVisible = useCallback((newValue: boolean) => {
        setToolbarContentTemplateVisible(newValue);
    }, []);

    const [applyButtonVisible, setApplyButtonVisible] = useState(true);
    const handleChangeApplyButtonVisible = useCallback((newValue: boolean) => {
        setApplyButtonVisible(newValue);
    }, []);

    const [applyButtonClickCallbackEnabled, setApplyButtonClickCallbackEnabled] = useState(true);
    const handleChangeApplyButtonClickCallbackEnabled = useCallback((newValue: boolean) => {
        setApplyButtonClickCallbackEnabled(newValue);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-flex-col controls-margin_bottom-2xl">
                <Checkbox
                    caption="closeButtonVisible(кнопка закрытия)"
                    value={closeButtonVisible}
                    onValueChanged={handleChangeCloseButtonVisible}
                />
                <Checkbox
                    caption="counterValue(счётчик)"
                    value={counterValueVisible}
                    onValueChanged={handleChangeCounterValueVisible}
                />
                <Checkbox
                    caption="imageContentTemplate(картинка)"
                    value={imageContentTemplateVisible}
                    onValueChanged={handleChangeImageContentTemplateVisible}
                />
                <Checkbox
                    caption="headerContentTemplate(кастомный контент шапки)"
                    value={headerContentTemplateVisible}
                    onValueChanged={handleChangeHeaderContentTemplateVisible}
                />
                <Checkbox
                    caption="headingCaption(стандартный заголовок)"
                    value={headingCaptionVisible}
                    onValueChanged={handleChangeHeadingCaptionVisible}
                />
                <Checkbox
                    caption="toolbarContentTemplate(тулбар)"
                    value={toolbarContentTemplateVisible}
                    onValueChanged={handleChangeToolbarContentTemplateVisible}
                />
                <Checkbox
                    caption="applyButtonVisible(кнопка подтверждения)"
                    value={applyButtonVisible}
                    onValueChanged={handleChangeApplyButtonVisible}
                />
                <Checkbox
                    caption="applyButtonClickCallback(обработчик нажатия на кнопку подтверждения)"
                    value={applyButtonClickCallbackEnabled}
                    onValueChanged={handleChangeApplyButtonClickCallbackEnabled}
                />
            </div>
            <div>
                <Button
                    caption="Открыть окно"
                    onClick={() => {
                        const stackOpener = new StackOpener();
                        stackOpener.open({
                            allowAdaptive: true,
                            template: 'Controls/popupTemplate:Stack',
                            width: 'c',
                            templateOptions: {
                                headerContentTemplate: headerContentTemplateVisible
                                    ? HeaderContentTemplate
                                    : undefined,
                                headingCaption: headingCaptionVisible ? 'Заголовок' : undefined,
                                imageContentTemplate: imageContentTemplateVisible
                                    ? ImageContentTemplate
                                    : undefined,
                                closeButtonVisible,
                                toolbarContentTemplate: toolbarContentTemplateVisible
                                    ? ToolbarContentTemplate
                                    : undefined,
                                applyButtonVisible,
                                counterValue: counterValueVisible ? 7 : undefined,
                                bodyContentTemplate: <div></div>,
                                applyButtonCallback: applyButtonClickCallbackEnabled
                                    ? applyButtonClickCallback
                                    : undefined,
                            },
                            opener: null,
                        });
                    }}
                />
            </div>
        </div>
    );
});
