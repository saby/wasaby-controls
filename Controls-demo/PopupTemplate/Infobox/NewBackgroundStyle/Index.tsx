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

const rightCenterConfig: object = {
    direction: {
        horizontal: 'left',
        vertical: 'center',
    },
    targetPoint: {
        horizontal: 'left',
        vertical: 'top',
    },
};

const rightStartConfig: object = {
    direction: {
        horizontal: 'left',
        vertical: 'bottom',
    },
    targetPoint: {
        horizontal: 'left',
        vertical: 'top',
    },
};

const topEndConfig: object = {
    direction: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    targetPoint: {
        vertical: 'bottom',
        horizontal: 'right',
    },
};

const topCenterConfig: object = {
    direction: {
        horizontal: 'center',
        vertical: 'bottom',
    },
    targetPoint: {
        horizontal: 'center',
        vertical: 'bottom',
    },
};

const topStartConfig: object = {
    direction: {
        horizontal: 'right',
        vertical: 'bottom',
    },
    targetPoint: {
        horizontal: 'left',
        vertical: 'right',
    },
};

const leftStartConfig: object = {
    direction: {
        vertical: 'bottom',
        horizontal: 'right',
    },
    targetPoint: {
        vertical: 'top',
        horizontal: 'right',
    },
};

const leftCenterConfig: object = {
    direction: {
        horizontal: 'right',
        vertical: 'center',
    },
    targetPoint: {
        horizontal: 'right',
        vertical: 'center',
    },
};

const leftEndConfig: object = {
    direction: {
        horizontal: 'right',
        vertical: 'top',
    },
    targetPoint: {
        horizontal: 'right',
        vertical: 'bottom',
    },
};

const bottomStartConfig: object = {
    direction: {
        vertical: 'top',
        horizontal: 'right',
    },
    targetPoint: {
        vertical: 'top',
        horizontal: 'left',
    },
};

const bottomCenterConfig: object = {
    direction: {
        horizontal: 'center',
        vertical: 'top',
    },
    targetPoint: {
        horizontal: 'center',
        vertical: 'top',
    },
};

const bottomEndConfig: object = {
    direction: {
        horizontal: 'left',
        vertical: 'top',
    },
    targetPoint: {
        horizontal: 'right',
        vertical: 'top',
    },
};

export default forwardRef(function InfoboxNewBackgroundStyle(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="tw-flex tw-flex-col tw-items-center controls-padding_top-2xl">
            <div className="tw-flex">
                <div className="controls-margin_right-2xl">
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={rightEndConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={rightCenterConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={rightStartConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={topEndConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={topCenterConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={topStartConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={leftStartConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={leftCenterConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={leftEndConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={bottomStartConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={bottomCenterConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox content={Template} stickyPosition={bottomEndConfig} />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="default"
                        />
                    </div>
                    <div>
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="default"
                        />
                    </div>
                </div>
                <div className="controls-margin_right-2xl">
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="danger"
                            borderStyle="danger"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                    <div>
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="unaccented"
                            borderStyle="unaccented"
                        />
                    </div>
                </div>
                <div className="controls-margin_right-2xl">
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="warning"
                            borderStyle="warning"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                    <div>
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="info"
                            borderStyle="info"
                        />
                    </div>
                </div>
                <div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="success"
                            borderStyle="success"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightEndConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightCenterConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={rightStartConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topEndConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topCenterConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={topStartConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftStartConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftCenterConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={leftEndConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomStartConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomCenterConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                    <div>
                        <InfoBox
                            content={Template}
                            stickyPosition={bottomEndConfig}
                            backgroundStyle="primary"
                            borderStyle="primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
