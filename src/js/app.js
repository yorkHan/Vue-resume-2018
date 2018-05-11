let app=new Vue({
    el:'#page',
    data:{
        loginVisible:false,
        signUpVisible:false,
        resume:{
            name:'姓名',
            job:'应聘岗位',
            gender:'男',
            birthday:'19930916',
            phoneNumber:'15444455588',
            email:'393900482@qq.com'
        },
        logIn:{
            username:'',
            password:''
        },
        signUp:{
            email:'',
            username:'',
            password:''
        }
    },
    methods:{
        onEdit(key,value){
            this.resume[key]=value
        },
        onClickSave(){
            let currentUser = AV.User.current();
            if(currentUser){
                this.saveResume()
            }else{
                this.loginVisible=true
            }
        },
        onSignUp(){
            let user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.username);
            // 设置密码
            user.setPassword(this.signUp.password);
            // 设置邮箱
            user.setEmail(this.signUp.email);
            user.signUp().then(function (user) {
                console.log(user);
            }, function (error) {
            });
        },
        onLogIn(){
            AV.User.logIn(this.logIn.username,this.logIn.password).then(function (user) {
                console.log(user);
            }, function (error) {
                if(error.code===211){
                    alert('用户名不存在')
                }else if(error.code===210){
                    alert('密码错误')
                }
            });
        },
        saveResume(){
            console.log(AV.User.current());
            let id=AV.User.current().id
            let user = AV.Object.createWithoutData('User',id);
            // 修改属性
            user.set('resume',this.resume);
            // 保存到云端
            user.save();
        },
        onLogOut(){
            AV.User.logOut();
            window.location.reload()
            alert('登出成功')
        }
    }
})