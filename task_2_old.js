window.onload = function() {

    function foo(a, b) {
        let x = performance.now();
        var res = [];
        var side_count = 3;

        if (a <= 2 * side_count) {
            for (let page = 1; page <= a; page++) {
                res.push(`${page}`);
            }
            return res;
        }

        else {

            var max_page_left = max_page_right = side_count;
            var curr = b;
            var prev = curr - 1,
                next = curr + 1;

            // по умолчанию max_page_left = max_page_right = side_count = 3
            for (let page = 1; page <= max_page_left; page++) {
                res.push(`${page}`);
            }

        // если текущая страница среди [1, 2, 3] или она среди [a - 2, a - 1, a]
            //  если мы находимся в "левой" части ([1, 2, 3])
            if (curr <= max_page_left) {
                // если мы находимся ровно на "границе" левой части (на цифре 3), то нужно вставить значение 4
                if (curr == max_page_left) {
                    res.push(`${next}`);
                }
                // если "справа" от текущей страницы (b) страниц больше, чем side_count (3), то добавляем '...'
                // то есть если от значения, следующего за вставляемым, до конца массива больше, чем 3 числа
                if (a - next > max_page_right) {
                    res.push('...');
                }
            }
            //  если мы находимся в "правой" части ([a - 2, a - 1, a])
            else if (curr >= a - max_page_right + 1) {
                // если "слева" от текущей страницы страниц больше, чем 3, то добавляем '...'
                // то есть если страница, предшествующая вставляемой, НЕ "граничит" с левой частью пагинатора (то есть НЕ
                // 1, 2, 3, prev, curr)
                if (prev > max_page_left + 1) {
                    res.push('...');
                }
                // если мы находимся ровно на "границе" правой части (a - 2), то нужно вставить a - 3 (то есть b - 1)
                if (curr == a - max_page_right + 1) {
                    res.push(`${prev}`);
                }
            }
        // если элемент НЕ находится среди уже условно вставленных граничных "троек" (1, 2, 3 и a - 2, a - 1, a)
            else {
                // если элемент, предшествующий вставляемому, НЕ граничит с левой частью пагинатора, то вставляем '...'
                if (prev > max_page_left + 1) {
                    res.push('...');
                }
                // если при этом элемент, предшествующий вставляемому, НЕ находится в уже собранной левой части 1, 2, 3,
                // то вставляем предшествующий
                if (!(prev <= max_page_left)) {
                    res.push(`${prev}`);
                }

                res.push(`${curr}`);

                // если элемент, следующий за вставляемым, НЕ находится в правой части a - 2, a - 1, a, то вставляем его
                if (!(a - next < max_page_right)) {
                    res.push(`${next}`);
                }
                if (a - next > max_page_right) {
                    res.push('...');
                }
            }

            for (let page = a - max_page_right + 1; page <= a; page++) {
                res.push(`${page}`);
            }
            console.log(performance.now() - x, 'bla');
            return res;
        }

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