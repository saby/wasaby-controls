/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
/**
 * Базовый класс, от которого наследуется объект перемещения.
 * Объект можно любым образом кастомизировать, записав туда любые необходимые данные.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_dragnDrop.less переменные тем оформления}
 *
 * @public
 */

/*
 * The base class for the inheritors of the drag'n'drop entity.
 * You can customize an entity in any way by passing any data to the options.
 * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
 * @class Controls/_dragnDrop/Entity
 * @public
 * @author Мочалов М.А.
 */

export default class Entity {
    protected _options: object;

    /**
     * Флаг на основании которого ScrollContainer понимает стоит ли для текущего
     * перетаскиваемого объекта включать механизм автоскролла при приближении курсора
     * к нижней или верхней границам ScrollContainer'а
     */
    readonly allowAutoscroll: boolean = false;

    constructor(options: object) {
        this._options = options;
    }

    /**
     * Возвращает переданные опции
     */
    getOptions(): object {
        return this._options;
    }
}
