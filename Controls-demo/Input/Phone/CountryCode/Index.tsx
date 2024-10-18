import { forwardRef, LegacyRef } from 'react';
import { Phone } from 'Controls/input';

export default forwardRef(function CountryCode(_, ref: LegacyRef<HTMLDivElement>) {
    return (<div className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center" ref={ref}>
        <div className="controlsDemo__cell" data-qa="Controls-demo_Input_Phone_CountryCode__cell-empty">
            <div className="controls-text-label">countryCode is default</div>
            <Phone className="ControlsDemo-PhoneInput_phoneField"
                   data-qa="Controls-demo_Input_Phone_CountryCode_empty"
                   onlyMobile={true}/>
        </div>
        <div className="controlsDemo__cell" data-qa="Controls-demo_Input_Phone_CountryCode__cell-us">
            <div className="controls-text-label">countryCode = US</div>
            <Phone className="ControlsDemo-PhoneInput_phoneField"
                   data-qa="Controls-demo_Input_Phone_CountryCode_us"
                   countryCode="US"
                   onlyMobile={true}/>
        </div>
    </div>);
});
