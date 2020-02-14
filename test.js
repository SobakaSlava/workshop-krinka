Array.prototype.shuffle = function shuffle() {
    let result = [...this];

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};
console.log('Start!')
let allTime = 0;
let allI = 0;
for (let j = 0; j<10; j++) {
    before = Date.now();
    let i = 0;
    while (true) {
        i++;
        let shuffled = 'с новым годом'.split('').shuffle().join('');
        if (shuffled === 'говно с дымом') {
            let took = Date.now() - before;
            console.log(`[${j}]: ${shuffled}, ${i}`);
            console.log(took / 1000 + ' sec')
            allI += i;
            allTime += took;
            break;
        };
    }
}
console.log('----------------------------')
console.log('Avg. time: ' + (allTime / 10000))
console.log('Avg. i: ' + (allI / 10))
