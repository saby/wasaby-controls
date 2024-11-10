/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { descriptor } from 'Types/entity';

export function getOptionTypes() {
    return {
        displayProperty: descriptor(String).required(),
        searchParam: descriptor(String).required(),
    };
}
