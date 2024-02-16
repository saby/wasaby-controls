/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_dragnDrop/Controller/Controller');
import ControllerClass from './ControllerClass';
import 'Controls/_dragnDrop/DraggingTemplate';
import { IDragObject } from './Container';
/**
 * Контроллер обеспечивает взаимосвязь между контейнерами перемещения {@link Controls/dragnDrop:Container}.
 * Он отслеживает события контейнеров и оповещает о них другие контейнеры.
 * Контроллер отвечает за отображение и позиционирование шаблона, указанного в опции {@link Controls/dragnDrop:Container#draggingTemplate draggingTemplate} в контейнерах.
 * Перетаскивание элементов работает только внутри Controls/dragnDrop:Container.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_dragnDrop.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @public
 */

/*
 * The drag'n'drop Controller provides a relationship between different Controls/dragnDrop:Container.
 * It tracks Container events and notifies other Containers about them.
 * The Controller is responsible for displaying and positioning the template specified in the draggingTemplate option at the Containers.
 * Drag and drop the entity only works inside Controls/dragnDrop:Container.
 * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
 * @class Controls/_dragnDrop/Controller
 * @extends UI/Base:Control
 *
 * @public
 * @author Мочалов М.А.
 */

class Controller extends Control<IControlOptions> {
    _template: TemplateFunction = template;
    _controllerClass: ControllerClass;

    _documentDragStart(event: Event, dragObject: IDragObject): void {
        this._controllerClass.documentDragStart(dragObject);
    }

    _documentDragEnd(event: Event, dragObject: IDragObject): void {
        this._controllerClass.documentDragEnd(dragObject);
    }

    _updateDraggingTemplate(
        event: Event,
        draggingTemplateOptions: IDragObject,
        draggingTpl: TemplateFunction
    ): void {
        this._controllerClass.updateDraggingTemplate(draggingTemplateOptions, draggingTpl);
    }

    _beforeMount() {
        this._controllerClass = new ControllerClass();
    }

    _beforeUnmount(): void {
        this._controllerClass.destroy();
    }

    _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void {
        this._controllerClass.registerHandler(event, registerType, component, callback, config);
    }

    _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        config: object
    ): void {
        this._controllerClass.unregisterHandler(event, registerType, component, config);
    }

    static _styles: string[] = ['Controls/dragnDrop'];
}

export default Controller;
