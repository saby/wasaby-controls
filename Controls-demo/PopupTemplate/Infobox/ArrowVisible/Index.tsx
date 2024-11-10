import { forwardRef, LegacyRef } from 'react';
import { InfoBox } from 'Controls/popupTemplate';
import 'css!Controls-demo/PopupTemplate/Infobox/WithScroll/WithScroll';

function Template(props: unknown) {
    return (
        <div className="controls-padding-2xl">
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

export default forwardRef(function ArrowVisibleDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="tw-flex controls-margin_top-2xl tw-justify-center">
            <div className="tw-flex tw-items-center">
                <InfoBox
                    content={Template}
                    stickyPosition={rightEndConfig}
                    className="controls-margin_right-2xl"
                />
                <InfoBox content={Template} stickyPosition={rightEndConfig} arrowVisible={false} />
            </div>
        </div>
    );
});
