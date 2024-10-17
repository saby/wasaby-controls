define(['Controls/list', 'Controls/popup'], function (lists, popupLib) {
   const BaseAction = lists.BaseAction;
   const Confirmation = popupLib.Confirmation;

   describe('Controls.List.BaseAction', function () {
      it('validate', function () {
         let baseAction = new BaseAction();
         jest.spyOn(Confirmation, 'openPopup').mockImplementation();

         expect(baseAction.validate([])).toBe(false);
         expect(
            baseAction.validate({
               selected: [],
               excluded: []
            })
         ).toBe(false);
         expect(baseAction.validate([1])).toBe(true);
         expect(
            baseAction.validate({
               selected: [1],
               excluded: []
            })
         ).toBe(true);
      });
   });
});
