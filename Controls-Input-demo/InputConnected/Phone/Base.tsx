import { forwardRef } from 'react';
import { Phone } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';

const Base = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Ввод любого номера телефона
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone name={getBinding('Empty')} />
                    </div>
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Ввод мобильного номера телефона
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone name={getBinding('Empty')} onlyMobile={true} />
                    </div>
                </div>
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250 controls-padding_left-m">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поле ввода с флагом
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            name={getBinding('Empty')}
                            placeholder="+7 Телефон"
                            flagVisible={true}
                            onlyMobile={true}
                        />
                    </div>
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Отображение флага справа
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Phone
                            name={getBinding('Empty')}
                            placeholder="+7 Телефон"
                            flagVisible={true}
                            onlyMobile={true}
                            flagPosition="end"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

Base.getLoadConfig = getLoadConfig;

export default Base;
