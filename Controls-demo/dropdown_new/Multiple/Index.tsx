import { forwardRef } from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import Simple from './Simple/Index';
import Mixed from './Mixed/Index';
import MultiSelect from './MultiSelect/Index';

export default forwardRef(function MultipleDemo(props, ref) {
    const rootClass = props.className + ' controlsDemo-Dropdown_button_scroll';
    return (
        <ScrollContainer className={rootClass} ref={ref}>
            <div className="ws-flexbox ws-justify-content-between ws-flex-wrap">
                <div className="controlsDemo__flexColumn">
                    <div className="controlsDemo__cell">
                        <Simple />
                    </div>
                    <div className="controlsDemo__cell">
                        <Mixed />
                    </div>
                    <div className="controlsDemo__cell">
                        <MultiSelect />
                    </div>
                </div>
            </div>
        </ScrollContainer>
    );
});
