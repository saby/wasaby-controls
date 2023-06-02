/**
 * Created by as.krasilnikov on 17.09.2018.
 */
define(['Controls/compatiblePopup', 'Types/deferred'], function (
   compatiblePopup,
   defferedLib
) {
   'use strict';

   var Area;

   beforeEach(() => {
      Area = new compatiblePopup.CompoundArea({});
      Area._beforeMount({});
   });

   describe('Controls/compatiblePopup:CompoundArea', function () {
      it('check options for reload', () => {
         let opt = {
            template: 'newTemplate',
            record: 'record',
            templateOptions: {
               testOptions: 'test'
            }
         };
         Area._setCompoundAreaOptions(opt);
         expect(Area._record).toEqual(opt.record);
         expect(Area._childControlName).toEqual(opt.template);
         expect(Area._childConfig).toEqual(opt.templateOptions);
      });

      describe('pending operations', () => {
         it('registers and unregisters pending operations', () => {
            var operation1 = { operation: true },
               operation2 = { operation: true, number: 2 };

            Area.sendCommand('registerPendingOperation', operation2);
            expect(Area._childPendingOperations.length).toBe(1);
            expect(Area._allChildrenPendingOperation).toBeTruthy();

            Area.sendCommand('registerPendingOperation', operation2);
            Area.sendCommand('unregisterPendingOperation', operation1);

            // operation2 is still registered
            expect(Area._allChildrenPendingOperation).toBeTruthy();

            Area.sendCommand('unregisterPendingOperation', operation2);

            // all pending operations are unregistered
            expect(Area._allChildrenPendingOperation).toBeFalsy();
         });

         it('can finish pending operations', () => {
            var finishCount = 0,
               cleanUpCount = 0,
               operation1 = {
                  finishFunc: function () {
                     finishCount++;
                  },
                  cleanup: function () {
                     cleanUpCount++;
                  }
               },
               operation2 = {
                  finishFunc: function () {
                     finishCount++;

                     // pendings can have deferred results
                     return new defferedLib.Deferred().callback(true);
                  },
                  cleanup: function () {
                     cleanUpCount++;
                  }
               };

            Area.sendCommand('registerPendingOperation', operation1);
            Area.sendCommand('registerPendingOperation', operation2);

            Area.finishChildPendingOperations();

            expect(finishCount).toBe(2);
            expect(cleanUpCount).toBe(2);

            // all pending operations should be unregistered after finish
            expect(Area._childPendingOperations.length).toBe(0);
            expect(Area._allChildrenPendingOperation).toBeFalsy();
         });

         it('does not manage pendings if child can', () => {
            var operation = { operation: true };

            // fake child control that has PendingOperationParentMixin
            Area._childControl = {
               '[Lib/Mixins/PendingOperationParentMixin]': true,
               _mixins: {}
            };
            Area.sendCommand('registerPendingOperation', operation);

            // pending operation should not register in CompoundArea, because it should
            // register in childControl itself
            expect(Area._childPendingOperations.length).toBe(0);
            expect(Area._allChildrenPendingOperation).toBeFalsy();
         });
      });

      describe('unregister from parent', function () {
         function getFakeParent() {
            return {
               __idForChild: 'id-my-child',
               __indexForChild: 0,
               _childsMapId: { 'id-my-child': 0 },
               _childControls: [],
               _childContainers: [],
               _childsMapName: [],
               _childsTabindex: false,

               // чтобы при вызове _clearInformationOnParentFromCfg getParent вернул родителя
               hasCompatible: () => {
                  return true;
               }
            };
         }

         beforeEach(() => {
            var nextParent = getFakeParent(),
               nextId = nextParent.__idForChild;
            nextParent._childControls[nextId] = Area;
            nextParent._childContainers[nextId] = Area._container;

            Area._parent = nextParent;
            Area._id = nextId;
         });

         it('correctly removes information about itself', () => {
            var parent = Area._parent;

            Area._clearInformationOnParentFromCfg();

            expect(Area._id in parent._childsMapId).toBeFalsy();

            // TODO: notInclude был правильнее, но он приводит к обращению к _children и куче предупреждений
            expect(parent._childControls.includes(Area)).toBe(false);
            expect(parent._childContainers.includes(Area._container)).toBe(
               false
            );
            expect(
               (Area._options.name || '') in parent._childsMapName
            ).toBeFalsy();
         });

         it('does not throw exception if parent does not have required fields', () => {
            var parent = Area._parent;
            delete parent._childControls;
            delete parent._childContainers;

            expect(
               Area._clearInformationOnParentFromCfg.bind(Area)
            ).not.toThrow();
         });
      });
   });
});
