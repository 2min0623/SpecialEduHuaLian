import{o as r,c as l,h as o,bC as i,a as c}from"./index-3019030b.js";import{_ as y}from"./_plugin-vue_export-helper-c27b6911.js";const _={name:"ReplyInput",props:{Data:{type:Object,required:!0}},data(){return{ReplyDatas:""}},created(){this.Data.Type==null&&(this.Data.Type="Text")},methods:{Reply2Parent(){let a=this.ReplyDatas==this.Data.Text;this.$emit("ReplyAnswer",a)}}},d={class:"Outter"},u=["type"];function m(a,e,n,D,s,p){return r(),l("div",d,[o(c("input",{type:n.Data.Type,onInput:e[0]||(e[0]=(...t)=>p.Reply2Parent&&p.Reply2Parent(...t)),"onUpdate:modelValue":e[1]||(e[1]=t=>s.ReplyDatas=t)},null,40,u),[[i,s.ReplyDatas]])])}const h=y(_,[["render",m],["__scopeId","data-v-734ecc38"]]);export{h as default};
