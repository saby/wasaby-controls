import { forwardRef, LegacyRef, useState } from 'react';
import { Button } from 'Controls/buttons';
import { DialogOpener } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import { View, showType } from 'Controls/toolbars';
import 'css!Controls-demo/PopupTemplate/Stack/Header/styles';
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
    return <View items={TOOLBAR_ITEMS} menuIconSize="l" keyProperty="id" />;
}

export default forwardRef(function DialogContentTemplatesDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [allowAdaptive, setAllowAdaptive] = useState(true);
    const onChangeValue = (value) => {
        setAllowAdaptive(value);
    };
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-text-label">
                    imageContentTemplate, headerContentTemplate, toolbarContentTemplate,
                    applyButtonVisible, closeButtonVisible
                </div>
                <Button
                    caption="Открыть окно"
                    onClick={() => {
                        const dialogOpener = new DialogOpener();
                        dialogOpener.open({
                            template: 'Controls/popupTemplate:Dialog',
                            opener: null,
                            allowAdaptive,
                            templateOptions: {
                                closeButtonVisible: true,
                                toolbarContentTemplate: ToolbarContentTemplate,
                                imageContentTemplate: ImageContentTemplate,
                                applyButtonVisible: true,
                                headingCaption: 'Заголовок',
                                headingFontSize: '2xl',
                                bodyContentTemplate: (
                                    <div className="controlsDemo__height100 controlsDemo_fixedWidth350"></div>
                                ),
                                allowAdaptive,
                            },
                        });
                    }}
                />
                <div className="controls-margin_top-xl">
                    <div>Разрешить адаптивность окну</div>
                    <Checkbox value={allowAdaptive} onValueChanged={onChangeValue} />
                </div>
            </div>
        </div>
    );
});
