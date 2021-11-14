
let arr = [
    { id: 'x', value: 1}, 
    { id: 'y', value: 1}, 
    { id: 'x', value: 3}, 
    { id: 'x', value: 4},
    { id: 'z', value: 4},
    { id: 'y', value: 1}, 
];

const removeDuplicates = (arr) => {
    return arr.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index)
}

arr = removeDuplicates(arr.map(el => {
    return { id: el.id, value: arr.filter(e => el.id === e.id).reduce((acc, curr) => (acc + curr.value), 0) };
}));

console.log(arr);
