let members = ['egoing', 'k5353', 'hoya']
let i =0
while(i < members.length) {
    i += 1;
    console.log(members[i])
}

let roles = {
    'programmer' : members[0],
    'designer' : members[1],
    'manager' : members[2]
}

console.log(roles)

for(let name in roles) {
    console.log('object => ', name, 'value => ', roles[name])
}