import { forwardRef, LegacyRef } from 'react';
import { InfoBox } from 'Controls/popupTemplate';
import 'css!Controls-demo/PopupTemplate/Infobox/WithScroll/WithScroll';

function Template(props: unknown) {
    return (
        <div className="controls-demo__infobox">
            <div>Введите описание или прикрепите</div>
            <div>внешние документы</div>
        </div>
    );
}

const rightEndConfig: object = {
    direction: {
        horizontal: 'left',
        vertical: 'top',
    },
    targetPoint: {
        horizontal: 'left',
        vertical: 'top',
    },
};

export default forwardRef(function InfoboxNewBackgroundStyle(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div
            ref={ref}
            className="tw-flex tw-justify-center tw-items-center controls-padding_top-2xl"
        >
            <InfoBox content={Template} stickyPosition={rightEndConfig} />
            <InfoBox
                content={Template}
                className="controls-demo__infobox__customFirstStyle"
                stickyPosition={rightEndConfig}
            />
            <InfoBox
                content={Template}
                className="controls-demo__infobox__customSecondStyle"
                stickyPosition={rightEndConfig}
            />
        </div>
    );
});
