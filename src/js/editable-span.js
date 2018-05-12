Vue.component('editable-span',{
    props:['value','disabled'],
    template:`
                <span class="editable">
                    <span v-show="!editing">{{value}}</span>
                    <input type="text" v-show="editing" v-bind:value="value" v-on:input="triggerEdit">
                    <button v-if="!disabled" v-on:click="editing=!editing">编辑</button>
                </span>
            `,
    data(){
        return {
            editing:false
        }
    },
    methods:{
        triggerEdit(e){
            this.$emit('edit',e.target.value)
        }
    }
})