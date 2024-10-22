import { forwardRef } from 'react';
import { default as Button } from 'Controls/beautifulButton';

export default forwardRef(function FontSize(_, ref) {
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
                    className="tw-flex tw-flex-col ws-justify-content-center"
                >
                    <div className="controls-margin_bottom-l">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="secondary"
                            inlineHeight="m"
                            fontSize="m"
                        />
                    </div>
                    <div className="controls-margin_bottom-l">
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="secondary"
                            inlineHeight="xl"
                            fontSize="xl"
                        />
                    </div>
                    <div>
                        <Button
                            caption="Аннулирование"
                            fontColorStyle="secondary"
                            inlineHeight="5xl"
                            fontSize="3xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
