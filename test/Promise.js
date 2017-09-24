// 创造了一个Promise实例
let checkLogin = function(){
    return new Promise(function(resolve,reject){
        let flag = document.cookie.indexOf("userId") > -1 ? true : false ;
    	if(flag = true){  // 原本是if(flag),if(flag = true)代表给flag赋予了默认值true
    		resolve({
    			status:0,
    			result:true
    		})
    	}else{
    		reject("error");
    	}
    })
}
// 另一个Promise实例
let getUserInfo = () =>{
	return new Promise((resolve,reject)=>{
		let userInfo = {
			userId:"101"
		}
		resolve(userInfo);
	})
}

// 嵌套改成链式调用
checkLogin().then((res)=>{
	if(res.status==0){
		console.log("login success");   // 输出这个，因为flag设为了true
		return getUserInfo()
	}
}).catch((error)=>{
	console.log(`errrs:${error}`)
}).then((res2)=>{                       // 链式调用，不用再嵌套
	console.log(`userId:${res2.userId}`)
})

// 多个promise实例可用Promise.all()
Promise.all([checkLogin(),getUserInfo()]).then(([res1,res2])=>{
	console.log(`result1:${res1.result},result2:${res2.userId}`)
})

// 结果：
// login success               Promise.js:39
// result1:true,result2:101    Promise.js:39
// userId:101                  Promise.js:34