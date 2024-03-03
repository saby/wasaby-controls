import { Button } from 'Controls/dropdown';
import { companies, actions } from 'Controls-demo/dropdown_new/Data';
import * as React from 'react';

export default React.forwardRef(function AdaptiveIndex(props, ref) {
    return (
        <div className="controlsDemo__flexRow {{_options.theme.indexOf('default')<0 ? 'controlsDemo_fixedWidth500' : 'controlsDemo_fixedWidth300'}}">
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню открывается в окне</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    items={actions}
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-simple"
                    menuHeadingCaption="Доп. операции"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню с иерархией открывается в шторке</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    items={actions}
                    parentProperty="parent"
                    nodeProperty="node"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-hierarchy"
                    menuHeadingCaption="Доп. операции"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">
                    Меню с большим количеством пунктов открывается в шторке
                </div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    caption="Компания"
                    items={companies}
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-manyItems"
                ></Button>
            </div>
        </div>
    );
});
