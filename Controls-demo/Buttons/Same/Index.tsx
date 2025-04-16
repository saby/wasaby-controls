import { forwardRef, LegacyRef, useMemo } from 'react';
import { Button } from 'Controls/buttons';
import 'css!Controls/buttons';
import 'css!Controls/buttonsSameStyle';

const ICON = 'icon-SabyBird';

export default forwardRef(function ButtonStyle(props, ref: LegacyRef<HTMLDivElement>) {
    const buttonStyles: string[] = useMemo(() => {
        return [
            'primary',
            'secondary',
            'success',
            'danger',
            'warning',
            'info',
            'default',
            'brand',
            'unaccented',
        ];
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
                    data-qa="controlsDemo-ButtonStyle__OutlinedSame"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="primary"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="secondary"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="success"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="danger"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="warning"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="info"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="default"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-default"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined-same"
                            caption="Кнопка"
                            buttonStyle="brand"
                            icon={ICON}
                            iconStyle="empty"
                            iconSize="empty"
                            data-qa="controlsDemo-ButtonStyle__OutlinedSame-brand"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center controls-margin_left-l"
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="primary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="secondary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="success"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="danger"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="warning"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="info"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled-same"
                            caption="Кнопка"
                            fontColorStyle="default"
                            buttonStyle="unaccented"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-unaccented"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
