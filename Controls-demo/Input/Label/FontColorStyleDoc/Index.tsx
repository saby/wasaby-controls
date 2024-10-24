import { forwardRef } from 'react';
import { Label } from 'Controls/input';

export default forwardRef(function FontColorStyleDoc(_, ref) {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Label" fontColorStyle="label" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Unaccented" fontColorStyle="unaccented" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Primary" fontColorStyle="primary" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Link" fontColorStyle="link" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Success" fontColorStyle="success" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Info" fontColorStyle="info" />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth200">
                <Label caption="Метка стиля Readonly" readOnly={true} />
            </div>
        </div>
    );
});
