import { useCallback, forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';
import { ToolbarContentTemplate } from '../resources';

export default forwardRef(function CenterAlignDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const buttonClickHandler = useCallback(() => {
        const stackOpener = new StackOpener();
        stackOpener.open({
            allowAdaptive: true,
            template: 'Controls/popupTemplate:Stack',
            width: 'c',
            templateOptions: {
                bodyContentTemplate: <div></div>,
                headerContentTemplate: (
                    <div className="tw-flex tw-justify-center tw-items-center controls-fontsize-2xl">
                        Заголовок
                    </div>
                ),
                applyButtonVisible: true,
                toolbarContentTemplate: <ToolbarContentTemplate />,
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
