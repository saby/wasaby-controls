import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { DialogOpener } from 'Controls/popup';
import { Title } from 'Controls/heading';
import 'css!Controls-demo/PopupTemplate/Stack/Header/styles';
import 'css!Controls-demo/PopupTemplate/Dialog/Header/CenterAlign/styles';

function HeaderContentTemplate() {
    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full">
            <div className="SlidingStackTemplateDemo__image controls-margin_right-s"></div>
            <div className="controlsDemo-Dialog-customHeader">
                <Title caption="Заголовок" fontSize="2xl" />
            </div>
        </div>
    );
}

export default forwardRef(function DialogContentTemplatesDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <Button
                    caption="Открыть окно"
                    onClick={() => {
                        const dialogOpener = new DialogOpener();
                        dialogOpener.open({
                            template: 'Controls/popupTemplate:Dialog',
                            opener: null,
                            allowAdaptive: true,
                            templateOptions: {
                                closeButtonVisible: false,
                                headerContentTemplate: HeaderContentTemplate,
                                bodyContentTemplate: (
                                    <div className="controlsDemo__height100 controlsDemo_fixedWidth350"></div>
                                ),
                                allowAdaptive: true,
                            },
                        });
                    }}
                />
            </div>
        </div>
    );
});
