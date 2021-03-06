// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { spy } from 'sinon';
import { DndController, FlatStrategy } from 'Controls/listDragNDrop';
import { RecordSet } from 'Types/collection';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Collection } from 'Controls/display';

describe('Controls/_listDragNDrop/Controller', () => {
   let controller, model;

   const items = new RecordSet({
      rawData: [
         { id: 1 },
         { id: 2 },
         { id: 3 }
      ],
      keyProperty: 'id'
   });
   const cfg = {
      collection: items,
      keyProperty: 'id'
   };

   beforeEach(() => {
      model = new Collection(cfg);
      controller = new DndController(model, FlatStrategy);
   });

   describe('startDrag', () => {
      it ('not pass draggedItem', () => {
         const modelSetDraggedItemsSpy = spy(model, 'setDraggedItems');
         controller.startDrag(null, new ItemsEntity({items: [1]}));
         assert.isTrue(modelSetDraggedItemsSpy.called);
         assert.isNotOk(controller.getDraggableItem());

         const item = model.getItemBySourceKey(1);
         controller.startDrag(item, new ItemsEntity({items: [1]}));
         assert.equal(controller.getDraggableItem(), item);
      });

      it ('pass draggedItem', () => {
         const draggedItem = model.getItemBySourceKey(1);
         const entity = new ItemsEntity( { items: [1] } );

         let modelSetDraggedItemsCalled = false;
         model.setDraggedItems = (draggedItemKey, e) => {
            assert.equal(draggedItemKey, draggedItem);
            assert.deepEqual(e, [1]);
            modelSetDraggedItemsCalled = true;
         };

         controller.startDrag(draggedItem, entity);

         assert.isTrue(modelSetDraggedItemsCalled);
         assert.equal(controller.getDragEntity(), entity);
      });

      it('new model', () => {
         const model = new Collection({
            collection: items
         });
         const controller = new DndController(model, FlatStrategy);

         const draggedItem = model.getItemBySourceKey(1);
         const entity = new ItemsEntity( { items: [1] } );

         let modelSetDraggedItemsCalled = false;
         model.setDraggedItems = (draggedItemKey, draggedItemsKeys) => {
            assert.equal(draggedItemKey, draggedItem);
            assert.deepEqual(draggedItemsKeys, [1]);
            modelSetDraggedItemsCalled = true;
         };

         controller.startDrag(draggedItem, entity);

         assert.isTrue(modelSetDraggedItemsCalled);
      });
   });

   it('setDragPosition', () => {
      const dragPosition = {
         index: 0,
         position: 'before'
      };

      const modelSetDragPositionSpy = spy(model, 'setDragPosition');

      const result = controller.setDragPosition(dragPosition);

      assert.isTrue(result);
      assert.equal(controller.getDragPosition(), dragPosition);
      assert.isTrue(modelSetDragPositionSpy.withArgs(dragPosition).calledOnce,
         'setDragPosition ???? ???????????????? ?????? ???????????????? ?? ???????????????? ????????????????????');
   });

   it('endDrag', () => {
      const modelResetDraggedItemsCalled = spy(model, 'resetDraggedItems');

      controller.endDrag();

      assert.isTrue(modelResetDraggedItemsCalled.calledOnce);
      assert.isNull(controller.getDragPosition());
      assert.isNull(controller.getDragEntity());
      assert.isNull(controller._draggableItem);
   });

   describe('calculateDragPosition', () => {
      beforeEach(() => {
         const entity = new ItemsEntity( { items: [1] } );
         controller.startDrag(model.getItemBySourceKey(1), entity);
      });

      it('hover on no draggable item', () => {
         const item = {
            DraggableItem: false
         };

         const dragPosition = controller.calculateDragPosition({targetItem: item});
         assert.isNotOk(dragPosition);
      });

      it('hover on dragged item', () => {
         const dragPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(1)});
         assert.isUndefined(dragPosition);
      });

      it ('first calculate position', () => {
         let newPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(3)});
         assert.equal(newPosition.index, 2);
         assert.equal(newPosition.position, 'after');

         newPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(2)});
         assert.equal(newPosition.index, 1);
         assert.equal(newPosition.position, 'after');
      });

      it ('position was set before it', () => {
         const setPosition = {
            index: 1,
            position: 'after'
         };
         controller.setDragPosition(setPosition);
         assert.equal(controller.getDragPosition(), setPosition);

         let newPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(3)});
         assert.equal(newPosition.index, 2);
         assert.equal(newPosition.position, 'after');

         newPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(2)});
         assert.equal(newPosition.index, 1);
         assert.equal(newPosition.position, 'after');

         newPosition = controller.calculateDragPosition({targetItem: model.getItemBySourceKey(1)});
         assert.equal(newPosition.index, 0);
         assert.equal(newPosition.position, 'before');
      });
   });

   it('canStartDragNDrop', () => {
      const canStartDragNDrop = () => true,
          event = {
             nativeEvent: {
                button: undefined
             },
             target: {
                closest(cssClass) {
                   return false;
                }
             }
          };

      assert.isTrue(DndController.canStartDragNDrop(canStartDragNDrop, event, false));
      assert.isTrue(DndController.canStartDragNDrop(false, event, false));
      assert.isFalse(DndController.canStartDragNDrop(canStartDragNDrop, event, true));
      assert.isFalse(DndController.canStartDragNDrop(true, event, false));

      event.nativeEvent.button = {};
      assert.isFalse(DndController.canStartDragNDrop(canStartDragNDrop, event, false));
   });

   describe('getSelectionForDragNDrop', () => {
      it('selected all', () => {
         let result = DndController.getSelectionForDragNDrop(model, { selected: [null], excluded: [] }, 1);
         assert.deepEqual(result, {
            selected: [null],
            excluded: [],
            recursive: false
         });

         result = DndController.getSelectionForDragNDrop(model, { selected: [null], excluded: [1] }, 1);
         assert.deepEqual(result, {
            selected: [null],
            excluded: [],
            recursive: false
         }, '???????????????? ???? ?????????????????????? ????????, ???? ???????????? ?????????????????? ???? excluded');

         result = DndController.getSelectionForDragNDrop(model, { selected: [null], excluded: [1] }, 2);
         assert.deepEqual(result, {
            selected: [null],
            excluded: [1],
            recursive: false
         });
      });

      it('not selected all', () => {
         let result = DndController.getSelectionForDragNDrop(model, { selected: [1], excluded: [] }, 1);
         assert.deepEqual(result, {
            selected: [1],
            excluded: [],
            recursive: false
         });

         result = DndController.getSelectionForDragNDrop(model, { selected: [2], excluded: [] }, 1);
         assert.deepEqual(result, {
            selected: [1, 2],
            excluded: [],
            recursive: false
         }, 'dragKey ?????????????????? ?? selected ?? selected ????????????????????????');

         result = DndController.getSelectionForDragNDrop(model, { selected: [3, 1], excluded: [] }, 2);
         assert.deepEqual(result, {
            selected: [1, 2, 3],
            excluded: [],
            recursive: false
         }, 'dragKey ?????????????????? ?? selected ?? selected ????????????????????????');
      });
   });
});
