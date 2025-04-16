import { useCallback, forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';

export default forwardRef(function MultiLineHeaderDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const buttonClickHandler = useCallback(() => {
        const stackOpener = new StackOpener();
        stackOpener.open({
            allowAdaptive: true,
            template: 'Controls/popupTemplate:Stack',
            width: 'c',
            templateOptions: {
                bodyContentTemplate: <div></div>,
                headerContentTemplate: (
                    <div className="controls-margin_left-m controls-fontsize-2xl ws-line-clamp_5 ws-line-clamp">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis dolorem ea
                        facilis fugit nobis quae quidem reprehenderit sapiente sint unde. Autem,
                        cupiditate dolores fugiat illum ipsa maxime reprehenderit ullam voluptate.
                    </div>
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
