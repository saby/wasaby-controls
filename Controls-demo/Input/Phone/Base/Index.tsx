import { forwardRef } from 'react';
import { Phone } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Ввод любого номера телефона
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            className="controlsDemo__input"
                            data-qa="Controls-demo_Input_Phone_Base__any"
                            inlineHeight="xl"
                            fontSize="l"
                        />
                    </div>
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Ввод мобильного номера телефона
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            className="controlsDemo__input"
                            data-qa="Controls-demo_Input_Phone_Base__mobile"
                            inlineHeight="xl"
                            fontSize="l"
                            onlyMobile={true}
                            placeholder="+7 Телефон"
                        />
                    </div>
                </div>
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250 controls-padding_left-m">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поле ввода с флагом
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            className="controlsDemo__input"
                            data-qa="Controls-demo_Input_Phone_Base__flag"
                            inlineHeight="xl"
                            fontSize="l"
                            placeholder="+7 Телефон"
                            onlyMobile={true}
                            flagVisible={true}
                        />
                    </div>
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Отображение флага справа
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            className="controlsDemo__input"
                            data-qa="Controls-demo_Input_Phone_Base__flag-right"
                            inlineHeight="xl"
                            fontSize="l"
                            placeholder="+7 Телефон"
                            onlyMobile={true}
                            flagVisible={true}
                            flagPosition="right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
