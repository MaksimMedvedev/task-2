window.onload = function() {

    function foo(a, b) {
        let current = b,
            last = a,
            res = [];
            max_page_left = max_page_right = side_count = 3;
            page = 1;

        while (page != last + 1) {
            // если мы находимся в одном из трех возможных "интервалов" : [1,2,3]; [b - 1, b, b + 1]; [a - 2, a - 1, a], то заносим страничку в массив
            if (page <= max_page_left || page > last - max_page_right || page === (current - 1) || page === current || page === current + 1) {
                res.push(`${page}`);
                page++;
            }
            // если не выполняется условие выше, то в целом это означает, что между "границами" ([1,2,3] и [a-2,a-1,a])
            // и окрестностью b ([b-1, b, b+1]) значений больше, чем 1. То есть нужно вставить троеточие.
            // Имеется в в виду любое сочетание:
            // 1. между [1,2,3] и окрестностью b нужно троеточие
            // 2. между [a-2,a-1,a] и окрестностью нужно троеточие.
            // Если троеточия нужны с обеих сторон, то сначала ветка ниже выполнится для варианта (1), а потом для (2)
            else {
                res.push('...');
                // чтобы "в холостую" не прогонять цикл на значениях, которые точно не попадут в массив, "перескакиваем"
                // на значения, которые в массив попасть обязаны

                // если наш кандидат на вставку уже "перескочил" b + 1, но еще "далек" от [a - 2, a - 1, a], то "прыгаем"
                // на начало "границы" [a - 2, a - 1, a]
                if (page > current + 1) {
                    page = last - max_page_right + 1;
                }
                // если массив содержит конструкцию [1,2,3, ..., ], однако b - 1 == a - 1 или == a, то чтобы не упустить
                // a - 2, "прыгаем на a - 2". Например, a = 7, b = 7 => [1, 2, 3, ..., 6, 7].
                else if (current - 1 > last - max_page_right + 1) {
                    page = last - max_page_right + 1;
                }
                // иначе наш кандидат на вставку уже "перескочил" [1,2,3], но еще "далек" от [b - 1, b, b + 1], "прыгаем"
                // на b - 1
                else page = current - 1;
            }
        }
        return res;

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