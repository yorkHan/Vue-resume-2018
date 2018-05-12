let app=new Vue({
    el:'#page',
    data:{
        currentUser:{
            objectId:undefined,
            username:undefined,
        },
        loginVisible:false,
        signUpVisible:false,
        resume:{
            name:'姓名',
            job:'应聘岗位',
            gender:'男',
            birthday:'19930916',
            phoneNumber:'15444455588',
            email:'393900482@qq.com',
            skills:[
                {name:'请添加技能',description:'请添加描述'},
                {name:'请添加技能',description:'请添加描述'},
                {name:'请添加技能',description:'请添加描述'},
                {name:'请添加技能',description:'请添加描述'},
            ]
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
            let regex = /\[(\d+)\]/g
            key =key.replace(regex,(match,number)=>`.${number}`)
            let keys=key.split('.')
            let result=this.resume
            for(let i=0;i<keys.length;i++){
                if(i===keys.length-1){
                    result[keys[i]]=value
                }else{
                    result=result[keys[i]]
                }
            }
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
            user.signUp().then( (user)=> {
                alert('注册成功')
                user=user.toJSON()
                this.currentUser.objectId=user.objectId
                this.currentUser.username=user.username
                this.signUpVisible=false
            }, (error)=> {
                alert(error.rawMessage)
            });
        },
        onLogIn(){
            AV.User.logIn(this.logIn.username,this.logIn.password).then((user)=>{
                user=user.toJSON()
                this.currentUser.objectId=user.objectId
                this.currentUser.username=user.username
                this.loginVisible=false
                Object.assign(this.resume,user.resume)
            }, (error)=> {
                if(error.code===211){
                    alert('用户名不存在')
                }else if(error.code===210){
                    alert('密码错误')
                }
            });
        },
        hasLogin(){
          return !!this.currentUser.objectId
        },
        saveResume(){
            console.log(AV.User.current());
            let objectId=AV.User.current().id
            let user = AV.Object.createWithoutData('User',objectId);
            // 修改属性
            user.set('resume',this.resume);
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功')
            },()=>{
                alert('保存失败')
            });
        },
        onLogOut(){
            AV.User.logOut();
            window.location.reload()
            alert('登出成功')
        },
        addSkill(){
            this.resume.skills.push({name:'请添加技能',description:'请添加描述'})
        },
        removeSkill(index){
            this.resume.skills.splice(index,1)
        }
    }
})

currentUser=AV.User.current()
if(currentUser){
    app.currentUser=currentUser.toJSON()
    let User = new AV.Query('User');
    User.get(app.currentUser.objectId).then( (user) =>{
        console.log(user.toJSON());
        app.resume=user.toJSON().resume
    }, (error)=> {
        // 异常处理
    });
}
