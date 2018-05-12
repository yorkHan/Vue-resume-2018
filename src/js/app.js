let app=new Vue({
    el:'#page',
    data:{
        previewUser:{
            objectId:undefined,
        },
        currentUser:{
            objectId:undefined,
            username:'',
        },
        loginVisible:false,
        signUpVisible:false,
        shareVisible:false,
        pickThemeVisible:false,
        previewResume:{
        },
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
            ],
            projects:[
                {name:'项目名称',url:'请填入链接',keywords:'关键字（请用，分隔）',description:'请添加描述'},
                {name:'项目名称',url:'请填入链接',keywords:'关键字（请用，分隔）',description:'请添加描述'},
            ],
        },
        mode:'edit', //'preview'
        sharedLink:'',
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
    computed:{
      displayResume(){
            return this.mode === 'preview' ? this.previewResume : this.resume
      }
    },
    watch:{
        'currentUser.objectId':function (newValue) {
            if(newValue){
                this.getResume(this.currentUser)
            }
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
        onClickShare(){
                this.shareVisible=!this.shareVisible
        },
        onSignUp(){
            const user = new AV.User();
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
            let {objectId} = AV.User.current().toJSON()
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
        getResume(user){
            let User = new AV.Query('User');
            return User.get(user.objectId).then( (user) =>{
                let resume=user.toJSON().resume
                return resume
            })
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
        },
        addProject(){
            let projects=this.resume.projects
            if(projects){
                projects.push({name:'项目名称',url:'请填入链接',keywords:'关键字（请用，分隔）',description:'请添加描述'})
            }else{

            }

        },
        removeProject(index){
            this.resume.projects.splice(index,1)
        },
        print(){
            window.print()
        },
        pickTheme(name){
            document.body.className=name
        }
    }
})

//获取当前用户
let currentUser=AV.User.current()
if(currentUser){
    app.currentUser=currentUser.toJSON()
    app.sharedLink=location.origin+location.pathname+'?user_id='+app.currentUser.objectId
    app.getResume(app.currentUser).then(resume=>{
        app.resume=resume
    })
}

//获取预览用户的id
let search=location.search
let regex = /user_id=([^&]+)/
let matches=search.match(regex)
let userId
if(matches){
    userId=matches[1]
    app.mode='preview'
    app.getResume({objectId:userId}).then(resume=>{
        app.previewResume=resume
    })
}

