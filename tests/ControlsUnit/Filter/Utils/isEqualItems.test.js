define(['Controls/_filter/Utils/isEqualItems'], function (isEqualItems) {
   it('isEqualItems', () => {
      let filter1 = { id: '1' };
      let filter2 = { id: '1' };
      expect(isEqualItems.default(filter1, filter2)).toBe(true);

      filter1 = { id: '2' };
      expect(isEqualItems.default(filter1, filter2)).toBe(false);

      filter1 = { name: '2' };
      filter2 = { name: '1' };
      expect(isEqualItems.default(filter1, filter2)).toBe(false);

      filter2 = { name: '2' };
      expect(isEqualItems.default(filter1, filter2)).toBe(true);

      filter1 = { id: 'test', name: 'test' };
      filter2 = { name: 'test' };
      expect(isEqualItems.default(filter1, filter2)).toBe(true);

      filter1 = { id: 'test' };
      filter2 = { name: 'test' };
      expect(isEqualItems.default(filter1, filter2)).toBe(true);
   });
});
