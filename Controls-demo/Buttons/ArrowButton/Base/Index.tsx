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
                        <ArrowButton
                            viewMode="filled"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__filled"
                        />
                        <ArrowButton
                            viewMode="ghost"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__ghost"
                        />
                        <ArrowButton
                            viewMode="stretched"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__stretched"
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Направление кнопки:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton
                            direction="up"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__direction-up"
                        />
                        <ArrowButton
                            direction="right"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__direction-right"
                        />
                        <ArrowButton
                            direction="down"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__direction-down"
                        />
                        <ArrowButton
                            direction="left"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__direction-left"
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Стиль отображения:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton
                            buttonStyle="default"
                            inlineHeight="s"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__style-default"
                        />
                        <ArrowButton
                            buttonStyle="pale"
                            inlineHeight="s"
                            className="controls-margin_left-m"
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__style-pale"
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200 controls-margin_top-2xs">
                        Размеры кнопок:
                    </div>
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <div className="ws-flex">
                            <ArrowButton
                                buttonStyle="default"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-default__iconSize-s"
                            />
                            <ArrowButton
                                buttonStyle="default"
                                inlineHeight="mt"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-default__iconSize-s"
                            />
                            <ArrowButton
                                buttonStyle="default"
                                inlineHeight="xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-default__iconSize-m"
                            />
                            <ArrowButton
                                buttonStyle="default"
                                inlineHeight="5xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-default__iconSize-l"
                            />
                        </div>
                        <div className="ws-flex controls-margin_top-m">
                            <ArrowButton
                                inlineHeight="m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-pale__iconSize-s"
                            />
                            <ArrowButton
                                inlineHeight="mt"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-pale__iconSize-s"
                            />
                            <ArrowButton
                                inlineHeight="xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-pale__iconSize-m"
                            />
                            <ArrowButton
                                inlineHeight="5xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__style-pale__iconSize-l"
                            />
                        </div>
                        <div className="ws-flex controls-margin_top-m">
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__stretched__iconSize-s"
                            />
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__stretched__iconSize-m"
                            />
                            <ArrowButton
                                viewMode="stretched"
                                inlineHeight="5xl"
                                className="controls-margin_left-m"
                                data-qa="Controls-demo_Buttons_ArrowButton_Base__stretched__iconSize-l"
                            />
                        </div>
                    </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        Режим чтения:
                    </div>
                    <div className="tw-flex tw-items-center">
                        <ArrowButton
                            readOnly={true}
                            data-qa="Controls-demo_Buttons_ArrowButton_Base__readOnly"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
