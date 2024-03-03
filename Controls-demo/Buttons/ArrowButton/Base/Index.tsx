import { forwardRef, LegacyRef } from 'react';
import { ArrowButton } from 'Controls/extButtons';

export default forwardRef(function Base(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div className="controlsDemo__wrapper tw-flex tw-justify-center" ref={ref}>
            <div
                className="tw-flex tw-flex-col ws-align-items-baseline"
                data-qa="controlsDemo_capture"
            >
                <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Режим отображения:
                    </div>
                    <div className="tx-flex tw-items-center">
                        <ArrowButton viewMode="filled" />
                        <ArrowButton viewMode="ghost" className="controls-margin_left-m" />
                        <ArrowButton
                            viewMode="stretched"
                            iconStyle="contrast"
                            className="controls-margin_left-m"
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Направление кнопки:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton direction="up" />
                        <ArrowButton direction="right" className="controls-margin_left-m" />
                        <ArrowButton direction="down" className="controls-margin_left-m" />
                        <ArrowButton direction="left" className="controls-margin_left-m" />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Стиль отображения:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton buttonStyle="default" inlineHeight="s" />
                        <ArrowButton
                            buttonStyle="pale"
                            inlineHeight="s"
                            className="controls-margin_left-m"
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200 controls-margin_top-2xs">
                        Размеры кнопок:
                    </div>
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <div className="ws-flex">
                            <ArrowButton buttonStyle="default" inlineHeight="m" />
                            <ArrowButton
                                buttonStyle="default"
                                inlineHeight="xl"
                                iconSize="m"
                                className="controls-margin_left-m"
                            />
                            <ArrowButton
                                buttonStyle="default"
                                inlineHeight="5xl"
                                iconSize="l"
                                className="controls-margin_left-m"
                            />
                        </div>
                        <div className="ws-flex controls-margin_top-m">
                            <ArrowButton inlineHeight="m" />
                            <ArrowButton
                                inlineHeight="xl"
                                iconSize="m"
                                className="controls-margin_left-m"
                            />
                            <ArrowButton
                                inlineHeight="5xl"
                                iconSize="l"
                                className="controls-margin_left-m"
                            />
                        </div>
                        <div className="ws-flex controls-margin_top-m">
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="s"
                                iconStyle="contrast"
                                iconSize="s"
                            />
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="m"
                                iconSize="m"
                                iconStyle="contrast"
                                className="controls-margin_left-m"
                            />
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="l"
                                iconSize="l"
                                iconStyle="contrast"
                                className="controls-margin_left-m"
                            />
                        </div>
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Режим чтения:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton readOnly={true} />
                    </div>
                </div>
            </div>
        </div>
    );
});
