let app=new Vue({
    el:'#page',
    data:{
        loginVisible:false,
        signInVisible:false,
        resume:{
            name:'姓名',
            job:'应聘岗位',
            gender:'男',
            birthday:'19930916',
            phoneNumber:'15444455588',
            email:'393900482@qq.com'
        }
    },
    methods:{
        onEdit(key,value){
            this.resume[key]=value
        },
        onclickSave(){
            let currentUser = AV.User.current();
            if(!currentUser){
                this.loginVisible=true
            }else {
                this.saveResume()
            }
        },
        saveResume(){
            let User = AV.Object.extend('User');
            let user = new User();
            user.set('resume',this.resume);
            user.save().then(function (todo) {

            }, function (error) {
                console.error(error);
            });
        }
    }
})