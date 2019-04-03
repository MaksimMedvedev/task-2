window.onload = function() {

  function foo(total, current) {
    // Формируем массив возможных значений
    // Фильтруем те что выходят за границы
    // Сортируем по возрастанию
    const pages = [...new Set([1, 2, 3, current - 1, current, current + 1, total - 2, total - 1, total])]
      .filter(x => 0 < x && x <= total)
      .sort((x, y) => x - y)
    const res = []

    for (let page of pages) {
      if (page - res[res.length - 1] > 1) {
        res.push('...')
      }
      res.push(page)
    }

    return res.map(x => String(x))
  }
  
  mocha.setup('bdd');

  describe('tests', () => {
    it('pass', () => {
        chai.expect(foo(1, 1)).to.deep.equal(["1"]);
        chai.expect(foo(6, 3)).to.deep.equal(["1", "2", "3", "4", "5", "6"] );
        chai.expect(foo(7, 2)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7"]);
        chai.expect(foo(7, 3)).to.deep.equal(["1", "2", "3", "4", "5", "6", "7"]);
        chai.expect(foo(7, 4)).to.deep.equal(["1", "2", "3", "4", "5", "6", "7"]);
        chai.expect(foo(100, 50)).to.deep.equal(["1", "2", "3", "...", "49", "50", "51", "...", "98", "99", "100"]);
        chai.expect(foo(100, 1)).to.deep.equal(["1", "2", "3", "...", "98", "99", "100"]);
        chai.expect(foo(100, 100)).to.deep.equal(["1", "2", "3", "...", "98", "99", "100"]);
        chai.expect(foo(11, 6)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7", "...", "9", "10", "11"]);
        chai.expect(foo(9, 5)).to.deep.equal(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        chai.expect(foo(11, 5)).to.deep.equal(["1", "2", "3", "4", "5", "6", "...", "9", "10", "11"]);
        chai.expect(foo(11, 4)).to.deep.equal(["1", "2", "3", "4", "5", "...", "9", "10", "11"]);

        // доп тесты для страниц внутри [1,2,3] или [a-2,a-1,a]
        chai.expect(foo(2, 1)).to.deep.equal(["1","2"]);
        chai.expect(foo(2, 2)).to.deep.equal(["1","2"]);
        chai.expect(foo(3, 2)).to.deep.equal(["1","2","3"]);
        chai.expect(foo(100, 3)).to.deep.equal(["1", "2", "3", "4","...", "98", "99", "100"]);
        chai.expect(foo(100, 2)).to.deep.equal(["1", "2", "3","...", "98", "99", "100"]);
        chai.expect(foo(100, 98)).to.deep.equal(["1", "2", "3","...", "97", "98", "99", "100"]);
        chai.expect(foo(100, 99)).to.deep.equal(["1", "2", "3","...", "98", "99", "100"]);

        chai.expect(foo(7, 1)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7"]);
        chai.expect(foo(7, 5)).to.deep.equal(["1", "2", "3", "4", "5", "6", "7"]);
        chai.expect(foo(7, 6)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7"]);
        chai.expect(foo(7, 7)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7"]);

        // доп тесты для страниц вне [1,2,3] или [a-2,a-1,a], которые нужно непосредственно вставлять в массив
        chai.expect(foo(100, 4)).to.deep.equal(["1", "2", "3", "4", "5", "...", "98", "99", "100"]);
        chai.expect(foo(100, 5)).to.deep.equal(["1", "2", "3", "4", "5", "6", "...", "98", "99", "100"]);
        chai.expect(foo(100, 6)).to.deep.equal(["1", "2", "3", "...", "5", "6", "7", "...", "98", "99", "100"]);
        chai.expect(foo(100, 95)).to.deep.equal(["1", "2", "3", "...", "94", "95", "96", "...", "98", "99", "100"]);
        chai.expect(foo(100, 96)).to.deep.equal(["1", "2", "3", "...", "95", "96", "97", "98", "99", "100"]);
        chai.expect(foo(100, 97)).to.deep.equal(["1", "2", "3", "...", "96", "97", "98", "99", "100"]);
        chai.expect(foo(9, 5)).to.deep.equal(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    });
  });

  mocha.run();
}
