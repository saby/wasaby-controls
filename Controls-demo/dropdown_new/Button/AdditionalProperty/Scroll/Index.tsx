import { itemsScroll } from 'Controls-demo/dropdown_new/Data';
import { Button } from 'Controls/dropdown';

export default function AdditionalScrollDemo() {
    return (
        <div className="controlsDemo__flexRow {{_options.theme.indexOf('default')<0 ? 'controlsDemo_fixedWidth500' : 'controlsDemo_fixedWidth300'}}">
            <div className="controlsDemo__wrapper">
                <Button
                    keyProperty="key"
                    caption="Create"
                    items={itemsScroll}
                    nodeProperty="@parent"
                    parentProperty="parent"
                    additionalProperty="isAdd"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__extra-footer"
                ></Button>
            </div>
        </div>
    );
}
