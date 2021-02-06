const transforSubject = (sn, loopSize) => {
    let n = 1;
    for (let i = 1; i <= loopSize; i++) {
        n = (n * sn) % 20201227;
    }
    return n;
};

const findLoopSize = (sn, publicKey) => {
    let n = 1;
    let loopCounter = 0;
    while (n !== publicKey) {
        n = (n * sn) % 20201227;
        loopCounter++;
    }
    return loopCounter;
};

const encryptionKey = (pks) => {
    const loopSizes = pks.map(pk => findLoopSize(7, pk));
    return transforSubject(pks[0], loopSizes[1]);
};

const pks = [10212254, 12577395];
console.log('Part 1:', encryptionKey(pks));
