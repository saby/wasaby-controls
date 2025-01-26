import { forwardRef } from 'react';
import { default as Button } from 'Controls/beautifulButton';

export default forwardRef(function FontColorStyle(_, ref) {
    return (
        <div
            ref={ref}
            className="controls-padding_top-m controls-padding_bottom-m tw-flex ws-justify-content-center"
        >
            <div
                className="tw-flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div
                    data-qa="controlsDemo_Buttons__capture"
                    className="tw-flex ws-justify-content-center ws-align-items-center"
                >
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="primary"
                            data-qa="Controls-demo_BeautifulButtons__primary"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="secondary"
                            data-qa="Controls-demo_BeautifulButtons__secondary"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="success"
                            data-qa="Controls-demo_BeautifulButtons__success"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="warning"
                            data-qa="Controls-demo_BeautifulButtons__warning"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="danger"
                            data-qa="Controls-demo_BeautifulButtons__danger"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="unaccented"
                            data-qa="Controls-demo_BeautifulButtons__unaccented"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="link"
                            data-qa="Controls-demo_BeautifulButtons__link"
                        />
                    </div>
                    <div className="controls-margin_right-m">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="info"
                            data-qa="Controls-demo_BeautifulButtons__info"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
