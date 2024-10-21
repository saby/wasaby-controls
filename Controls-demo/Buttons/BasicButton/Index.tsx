import { forwardRef, LegacyRef, useMemo } from 'react';
import { BasicButton } from 'Controls/buttons';
import 'css!Controls-demo/Buttons/BasicButton/Button';

export default forwardRef(function BasicButtonDemo(_, ref: LegacyRef<HTMLDivElement>) {
    const buttonStyles: string[] = useMemo(() => {
        return [
            'primary',
            'secondary',
            'success',
            'danger',
            'warning',
            'info',
            'unaccented',
            'default',
            'pale',
        ];
    }, []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__flex ws-flex-column ws-align-items-center">
                    {buttonStyles.map((buttonStyle) => {
                        return (
                            <div
                                key={buttonStyle}
                                className="controls-inlineheight-5xl controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center"
                            >
                                <span className="controls-text-label controlsDemo_fixedWidth100">
                                    {buttonStyle}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse"
                >
                    {buttonStyles.map((buttonStyle) => {
                        return (
                            <div
                                key={buttonStyle}
                                className="controls-inlineheight-5xl controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center"
                            >
                                <BasicButton
                                    viewMode="outlined"
                                    buttonStyle={buttonStyle}
                                    buttonSize={'4xl'}
                                >
                                    <span className="controls-demo_button-wrapper tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full">
                                        <span className="controls-BaseButton__text controls-fontsize-m controls-fontweight-bold">
                                            Заголовок
                                        </span>
                                        <span className="controls-text-label controls-fontsize-xs">
                                            Доп. текст
                                        </span>
                                    </span>
                                </BasicButton>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue"
                >
                    {buttonStyles.map((buttonStyle) => {
                        return (
                            <div
                                key={buttonStyle}
                                className="controls-inlineheight-5xl controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center"
                            >
                                <BasicButton
                                    viewMode="filled"
                                    buttonStyle={buttonStyle}
                                    buttonSize={'4xl'}
                                >
                                    <span className="controls-demo_button-wrapper tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full">
                                        <span className="controls-BaseButton__text controls-fontsize-m controls-fontweight-bold">
                                            Заголовок
                                        </span>
                                        <span className="controls-text-label controls-fontsize-xs">
                                            Доп. текст
                                        </span>
                                    </span>
                                </BasicButton>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ghost"
                >
                    {buttonStyles.map((buttonStyle) => {
                        return (
                            <div
                                key={buttonStyle}
                                className="controls-inlineheight-5xl controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center"
                            >
                                <BasicButton
                                    viewMode="ghost"
                                    buttonStyle={buttonStyle}
                                    buttonSize={'4xl'}
                                >
                                    <span
                                        className={`controls-demo_button-wrapper controls-button_fontColorStyle-${buttonStyle}-style tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full`}
                                    >
                                        <span className="controls-BaseButton__text controls-fontsize-m controls-fontweight-bold">
                                            Заголовок
                                        </span>
                                        <span className="controls-text-label controls-fontsize-xs">
                                            Доп. текст
                                        </span>
                                    </span>
                                </BasicButton>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
