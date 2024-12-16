import { Container as ScrollContainer } from 'Controls/scroll';
import Simple from './Simple/Index';
import Mixed from './Mixed/Index';
import MultiSelect from './MultiSelect/Index';

export default function MultipleDemo() {
    return (
        <ScrollContainer className="controlsDemo-Dropdown_button_scroll">
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
}
