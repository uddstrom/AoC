const vec = (dr, dc) => ({ dr, dc });
/*
Sea monster pattern
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   

*/
const pattern = [
    vec(0, 18),
    vec(1, 0), vec(1, 5), vec(1, 6), vec(1, 11), vec(1, 12), vec(1, 17), vec(1, 18), vec(1, 19),
    vec(2, 1), vec(2, 4), vec(2, 7), vec(2, 10), vec(2, 13), vec(2, 16),
];


const monsterParts = new Set();
const findSeaMonsters = (image) => {
    monsterParts.clear();
    image.forEach((row, r) =>
        row.forEach((col, c) => {
            check(r, c, image, pattern);
        })
    );
    return monsterParts;
};

const check = (r, c, img, pattern) => {
    const monsterFound = !pattern.some(({ dr, dc }) => {
        // finns det någon del som inte är monsterdel
        if (img[r + dr]) {
            return img[r + dr][c + dc] !== 1;
        } else {
            return true;
        }
    });
    if (monsterFound) {
        pattern.forEach(({ dr, dc }) => monsterParts.add(`${r + dr},${c + dc}`));
    }
};


module.exports = { findSeaMonsters };
