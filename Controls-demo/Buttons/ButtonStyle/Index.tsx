import { forwardRef, LegacyRef, useMemo } from 'react';
import { Button } from 'Controls/buttons';

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
            'unaccented',
            'default',
            'pale',
            'brand',
            'navigation',
            'link',
            'label',
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
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="primary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="secondary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="success"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="danger"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="warning"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="info"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="outlined"
                            caption="Кнопка"
                            buttonStyle="default"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundFalse-default"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="primary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="secondary"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="success"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="danger"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="warning"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="info"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="unaccented"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-unaccented"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="default"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-default"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="pale"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-pale"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="brand"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-brand"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            caption="Кнопка"
                            buttonStyle="navigation"
                            data-qa="controlsDemo-ButtonStyle__ContrastBackgroundTrue-navigation"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="primary"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-primary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="secondary"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-secondary"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="success"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-success"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="danger"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-danger"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="warning"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-warning"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="info"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-info"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="unaccented"
                            icon={ICON}
                            iconStyle="default"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-unaccented"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="default"
                            icon={ICON}
                            iconStyle="default"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-default"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="pale"
                            icon={ICON}
                            iconStyle="default"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-pale"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="brand"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-brand"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="filled"
                            buttonStyle="navigation"
                            icon={ICON}
                            iconStyle="contrast"
                            data-qa="controlsDemo-ButtonStyle__ViewModeFunctionalButton-navigation"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                </div>
                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeLinkText"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="primary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="secondary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="success" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="danger" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="warning" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="info" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="unaccented" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="default" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="link" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" caption="Подробнее" fontColorStyle="label" />
                    </div>
                </div>

                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeLinkIcon"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="primary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="secondary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="success" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="danger" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="warning" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="info" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="unaccented" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="default" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="brand" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="link" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="link" icon={ICON} iconStyle="label" />
                    </div>
                </div>

                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeToolButton"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="primary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="secondary" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="success" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="danger" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="warning" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="info" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="unaccented" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="default" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="link" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" caption="Подробнее" fontColorStyle="label" />
                    </div>
                </div>

                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeToolButtonIcon"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="primary" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="secondary" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="success" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="danger" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="warning" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="info" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="unaccented" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="default" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="brand" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="link" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="ghost" icon={ICON} iconStyle="label" iconSize="s" />
                    </div>
                </div>

                <div
                    className="controlsDemo__flex ws-flex-column ws-align-items-center"
                    data-qa="controlsDemo-ButtonStyle__ViewModeSquaredIcon"
                >
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="primary" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button
                            viewMode="squared"
                            icon={ICON}
                            buttonStyle="secondary"
                            iconSize="s"
                        />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="success" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="danger" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="warning" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="info" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m controlsDemo__flex ws-align-items-center">
                        <Button viewMode="squared" icon={ICON} buttonStyle="default" iconSize="s" />
                    </div>
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                    <div className="controls-inlineheight-l controls-margin_bottom-m controls-margin_right-m" />
                </div>
            </div>
        </div>
    );
});
