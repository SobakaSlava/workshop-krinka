const fs = require('fs');
const wordListPath = require('word-list');

const WORDS_ENOUGH = 3;
const WORD_LENGTH = 6;
const INCREMENT = 'increment';
const WORD = 'word';

const existingWords = fs.readFileSync(wordListPath, 'utf8').split('\n');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const getRandomIntInclusive = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomLetter = () => {
    return alphabet[getRandomIntInclusive(0, alphabet.length - 1)];
};

const generateRandomWord = () => {
    return [...new Array(WORD_LENGTH)].map(getRandomLetter).join('');
};

const getTimeTook = (startTime) => {
    return Math.round((Date.now() - startTime) / 1000 / 60 * 100) / 100 + ' minutes';
};

const main = () => {
    if (cluster.isMaster) {
        console.log('===============================');
        console.log(`Starting generating on ${numCPUs} CPUs`);
        console.log('===============================\n');

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        let startTime = Date.now();

        let generatedCount = 0;
        let existingCount = 0;

        cluster.on('message', (worker, msg) => {
            if (msg.topic === INCREMENT) {
                generatedCount++;
            }

            if (msg.topic === WORD) {
                let { word } = msg;
                generatedCount++;
                existingCount++;
                fs.appendFileSync('words.txt', word + '\n');
                console.log(`Worker ${worker.id} found a word '${msg.word}'! ${existingCount} words found so far!`)
            }

            if (existingCount === WORDS_ENOUGH) {
                console.log(`${generatedCount} words were generated and only ${existingCount} of them have sense.`);
                console.log(`It took ${getTimeTook(startTime)}`);
                for (let id in cluster.workers) {
                    process.kill(cluster.workers[id].process.pid)
                }
            }
        })

    } else {
        while (true) {
            let word = generateRandomWord();
            if (existingWords.includes(word)) {
                process.send({ topic: WORD, word });
            } else {
                process.send({ topic: INCREMENT });
            }
        }
    }
};

main();
