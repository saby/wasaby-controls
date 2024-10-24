import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';
import { showType, View } from 'Controls/toolbars';
import 'css!Controls-demo/PopupTemplate/Stack/Header/styles';
import { RecordSet } from 'Types/collection';
import { Title } from 'Controls/heading';

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

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="controls-margin_bottom-2xl">
                <div className="controls-text-label controls-margin_bottom-m">
                    closeButtonVisible, imageContentTemplate, headerContentTemplate,
                    toolbarContentTemplate, applyButtonVisible, counterValue, applyButtonCallback
                </div>
                <Button
                    caption="Открыть окно"
                    onClick={() => {
                        const stackOpener = new StackOpener();
                        stackOpener.open({
                            allowAdaptive: true,
                            template: 'Controls/popupTemplate:Stack',
                            width: 'c',
                            templateOptions: {
                                headerContentTemplate: HeaderContentTemplate,
                                imageContentTemplate: ImageContentTemplate,
                                closeButtonVisible: true,
                                toolbarContentTemplate: ToolbarContentTemplate,
                                applyButtonVisible: true,
                                counterValue: 7,
                                bodyContentTemplate: <div></div>,
                                applyButtonCallback: applyButtonClickCallback,
                            },
                            opener: null,
                        });
                    }}
                />
            </div>
        </div>
    );
});
