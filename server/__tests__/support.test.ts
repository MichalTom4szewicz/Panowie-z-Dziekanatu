const cs = require("../src/entity/Class");
const fs= require('../src/support/support');

const tab = [
    {a:"17:05", b:"18:35", c:"18:45", d:"19:00", e:false},
    {a:"17:05", b:"18:35", c:"18:25", d:"19:00", e:true},
    {a:"17:05", b:"18:35", c:"17:05", d:"18:00", e:true},
    {a:"17:05", b:"18:35", c:"16:25", d:"19:00", e:true}
]

class MyClass extends cs.Class {
    constructor(s: string, e: string) {
        super()
        this.startTime = s;
        this.endTime = e;
    }
}


for(let row of tab) {
    test('basic', () => {
        const c1 = new MyClass(row.a, row.b);
        const c2 = new MyClass(row.c, row.d);
        expect(fs.classesCollide(c1, c2)).toBe(row.e);
    });
}