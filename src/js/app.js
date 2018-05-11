var app=new Vue({
    el:'#page',
    data:{
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
            var currentUser = AV.User.current();
            if(currentUser){
                this.showLogin()
            }else {
                this.saveResume()
            }
        },
        showLogin(){

        },
        saveResume(){
            var User = AV.Object.extend('User');
            var user = new User();
            user.set('resume',this.resume);
            user.save().then(function (todo) {

            }, function (error) {
                console.error(error);
            });
        }
    }
})