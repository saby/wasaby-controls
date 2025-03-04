import { useCallback, forwardRef } from 'react';
import { Model } from 'Types/entity';
import { Button as SimpleButton } from 'Controls/buttons';
import { Confirmation } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import { Button } from 'Controls/dropdown';

const items = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: '1',
            title: 'Сообщение',
        },
    ],
});

export default forwardRef(function DropdownOneItemDemo(_, ref) {
    const menuItemActivate = useCallback((item: Model) => {
        Confirmation.openPopup({
            type: 'ok',
            message: `Клик по: "${item.get('title')}"`,
        });
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <div className="controls-text-label">Меню с одним элементом</div>
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    items={items}
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
            <div className="controlsDemo__ml2">
                <div className="controls-text-label">Меню с одним элементом и футером</div>
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    items={items}
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                    footerContentTemplate={() => (
                        <SimpleButton viewMode="link" caption="+ добавить" />
                    )}
                />
            </div>
        </div>
    );
});
