import * as React from 'react';
import {Phone} from 'Controls/extendedDecorator';
import { IControlOptions } from 'UI/Base';

export default React.forwardRef(
                      function Index(props: IControlOptions, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement {
    return (
        <div {...props.attrs}
             className={'ws-flexbox ' + (props.attrs.className || '')}
             ref={ref}
        >
            <div className="controlsDemo__wrapper">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 8371</div>
                    <Phone value="8371"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84942228771</div>
                    <Phone value="84942228771"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +74942228772</div>
                    <Phone value="+74942228772"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84943121750</div>
                    <Phone value="84943121750"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +74943121751</div>
                    <Phone value="+74943121751"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +7494-3121-752</div>
                    <Phone value="+7494-3121-752"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84942228771112</div>
                    <Phone value="84942228771112"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84942-228771-(113)</div>
                    <Phone value="84942-228771-(113)"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 9206469857</div>
                    <Phone value="9206469857"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +4200555555555</div>
                    <Phone value="+4200555555555"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 492555555555</div>
                    <Phone value="492555555555"/>
                </div>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +79108563421</div>
                    <Phone value="+79108563421"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +79108563421</div>
                    <Phone value="+79108563421"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +79108563421110</div>
                    <Phone value="+79108563421110"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +7(4942)228771111</div>
                    <Phone value="+7(4942)228771111"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +74942-228771-(111)</div>
                    <Phone value="+74942-228771-(111)"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +7(49431)21751112</div>
                    <Phone value="+7(49431)21751112"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +749431-21751-(112)</div>
                    <Phone value="+749431-21751-(112)"/>
                </div>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84952228772</div>
                    <Phone value="84952228772"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84942228772</div>
                    <Phone value="84942228772"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84943121751</div>
                    <Phone value="84943121751"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84942228772</div>
                    <Phone value="84942228772"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84952228772110</div>
                    <Phone value="84952228772110"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 8493121751112</div>
                    <Phone value="8493121751112"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 84931-21751-(112)</div>
                    <Phone value="84931-21751-(112)"/>
                </div>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 6689</div>
                    <Phone value="6689"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 66898</div>
                    <Phone value="66898"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 668981</div>
                    <Phone value="668981"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 6689812</div>
                    <Phone value="6689812"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 6689812345</div>
                    <Phone value="6689812345"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 66898123456</div>
                    <Phone value="66898123456"/>
                </div>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +3912345678901</div>
                    <Phone value="+3912345678901"/>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = +83123456789</div>
                    <Phone value="+83123456789"/>
                </div>
            </div>
        </div>
    );
});
