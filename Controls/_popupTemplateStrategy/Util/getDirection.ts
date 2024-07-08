/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { controller } from 'I18n/i18n';

function getDirection(direction: string): string {
    if (controller.currentLocaleConfig.directionality === 'rtl') {
        if (direction === 'left') {
            return 'right';
        }
        if (direction === 'right') {
            return 'left';
        }
    }
    return direction;
}

export default getDirection;
