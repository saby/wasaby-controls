import { useCallback, forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';

export default forwardRef(function RightPositionCounterDemo(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const buttonClickHandler = useCallback(() => {
        const stackOpener = new StackOpener();
        stackOpener.open({
            allowAdaptive: true,
            template: 'Controls/popupTemplate:Stack',
            width: 'c',
            templateOptions: {
                bodyContentTemplate: <div></div>,
                headingCaption: 'Заголовок',
                headingFontSize: '2xl',
                headerContentTemplate: (
                    <div className="controls-text-danger controls-fontsize-2xl">17</div>
                ),
                closeButtonVisible: false,
            },
            opener: null,
        });
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-items-center tw-justify-center">
            <Button
                caption="Открыть полноэкранную карточку"
                data-qa={'Controls-demo_PopupTemplate_Stack_Header__openButton'}
                onClick={buttonClickHandler}
            />
        </div>
    );
});
