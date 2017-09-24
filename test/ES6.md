### 数组的解构

```javascript
// 数组的解构
var [a,b] = [3,8,10]; // 数组的分解
console.log(`a:${a},b:${b}`)   // a:3,b:8

var [x,y,z] = "Vue"; // 字符串的分解
console.log(`x:${x},y:${y},z:${z}`);  // x:V,y:u,z:e

var {n,m} = {m:10,n:20}; // 对象的解构,对key进行拆分
console.log(`m:${m},n:${n}`);  // m:10,n:20

function sum([x,y]){
    return x+y;
}
var total = sum([2,8]);
console.log(`total:${total}`);  // total:10
```

### 函数的扩展

- ##### 函数默认值

```javascript
function sum(num1,num2=3){
    return num1+num2;
}
console.log(sum(7));  // 10
```
- ##### 函数的Rest参数(...m)

```javascript
// ES5
function sum(x,y,z){
    let total = 0;
    if(x)total+=x;
    if(y)total+=y;
    if(z)total+=z;

    console.log(`total:${total}`)
}
sum(5,"",9);  // 14
```

```javascript
// ES6
// 函数的Rest参数
function sum2(...m){
    let total = 0;
    for(var i of m){   // ES6-for循坏
        total += i;
    }
    console.log(`total:${total}`)
}
sum2(4,8,9,10); // 31
```
- ##### 函数的扩展(...)

```javascript
var [x,y] = [4,8]

console.log(...[4,8]);  // 4 8

let arr1 = [1,3];let arr2 = [4,8];
console.log("concat:"+arr1.concat(arr2));

[...arr1,...arr2]
console.log([...arr1,...arr2])  // [1, 3, 4, 8]

var [x,...y] = [4,8,10,30]
console.log(x)  // 4
console.log(y)  // [8, 10, 30]

let [a,b,c] = "ES6";
console.log(a) // E
console.log(b) // S
console.log(c) // 6

let xy = [...'ES6'];
console.log(xy) // ["E", "S", "6"]
```






