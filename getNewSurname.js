Array.prototype.shuffle = function shuffle() {
    let result = [...this];

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};

String.prototype.swap = function swap(i, j) {
    let a = this.split('');

    [a[i], a[j]] = [a[j], a[i]];

    return a.join('');
};

let getNewSurname = (surname) => {
    let a = [...new Array(surname.length)]
        .map((el, i) => i)
        .shuffle()
        .slice(0, 4);
    let newSurname = surname.toLowerCase().swap(a[0], a[1]).swap(a[2], a[3]);

    return newSurname.charAt(0).toUpperCase() + newSurname.slice(1);
};
