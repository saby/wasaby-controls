import { forwardRef } from 'react';
import { InfoBox } from 'Controls/popupTemplate';

export default forwardRef(function InfoboxBorderStyle(_, ref) {
    const stickyPosition: object = {
        direction: {
            horizontal: 'left',
            vertical: 'top',
        },
        targetPoint: {
            horizontal: 'left',
            vertical: 'top',
        },
    };
    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">borderStyle=warning</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='warning'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">borderStyle=info</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='info'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">borderStyle=unaccented</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='unaccented'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">borderStyle=secondary</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='secondary'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">borderStyle=success</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='success'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
                <div>
                    <div className="controls-text-label">borderStyle=danger</div>
                    <InfoBox
                        closeButtonVisible={false}
                        borderStyle='danger'
                        stickyPosition={stickyPosition}
                    >
                        <div className="controls-padding-m">
                            Всплывающая подсказка с уведомлением
                        </div>
                    </InfoBox>
                </div>
            </div>
        </div>
    );
});
