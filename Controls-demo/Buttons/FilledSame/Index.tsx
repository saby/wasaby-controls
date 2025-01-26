import { forwardRef, LegacyRef, useMemo } from 'react';
import { Button } from 'Controls/buttons';

export default forwardRef(function ButtonStyle(props, ref: LegacyRef<HTMLDivElement>) {
    const buttonStyles: string[] = useMemo(() => {
        return ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'unaccented'];
    }, []);

    const attrs = props.attrs || {};

    return (
        <div
            ref={ref}
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo__flex ws-justify-content-center ${
                props.className ? props.className : attrs.className ? attrs.className : ''
            }`}
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
                                className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center"
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
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="primary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="secondary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="success"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="danger"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="warning"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="info"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            buttonStyle="unaccented"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-unaccented"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
