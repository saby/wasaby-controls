/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Model } from 'Types/entity';
import type * as React from 'react';

/**
 * События любого списочного компонента.
 */
export interface IAbstractComponentEventHandlers {
    /**
     * Происходит при клике по строке списка.
     * Происходт только в том случае, если список не забрал на себя инициативу по обработке клика.
     * Например, если в списке допустимо проваливание(смена корня) по клику, то при клике по записи,
     * которая может стат корнем, событие не будет запущено.
     * @param item Модель данных строки, по которй произошел клик.
     * @param event Событие мышки.
     */
    onItemClick?: (item: Model | Model[], event: React.MouseEvent) => void;
}
