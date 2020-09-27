let numbers = [1, 400, 12, 34, 5, 10000];
let i = 0;
let total = 0
while(i < numbers.length) {
    total += numbers[i]
    i += 1;
}
console.log(`total : ${total}`)
