import type { EventRaisingMixin } from 'Types/entity';

/**
 * Интерфейс обертки
 * */
interface IMuteWrapper {
    /**
     * Отключение генерации событий об изменении коллекции
     * */
    mute: () => IMuteWrapper;
    /**
     * Включение генерации событий об изменении коллекции
     * */
    unmute: () => IMuteWrapper;
}

/**
 * Утилита для формирования обертки над коллекцией, для включения/отключения генерации событий об изменении коллекции
 * @param inst Коллекция
 * */
export default function eventRaisingMuteWrapper(inst?: EventRaisingMixin): IMuteWrapper {
    let wasRaising: boolean;

    const self: IMuteWrapper = {
        mute: (): IMuteWrapper => {
            if (!inst || !inst.isEventRaising()) {
                return self;
            }

            wasRaising = true;
            inst.setEventRaising(false, true);
            return self;
        },
        unmute: () => {
            if (inst && wasRaising && !inst.isEventRaising()) {
                inst.setEventRaising(true, true);
            }

            return self;
        },
    };
    return self;
}
