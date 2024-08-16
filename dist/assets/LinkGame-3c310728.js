import{m as _,_ as G,r as p,o as r,c as l,a as f,t as P,j as C,b as u,w as m,F as L,k as w,q as k,u as O,s as v}from"./index-3019030b.js";import{_ as y}from"./_plugin-vue_export-helper-c27b6911.js";const A={name:"LinkGameV2",components:{ImageContainer:_(()=>G(()=>import("./ManualImageContainer-aba4ab9a.js"),["assets/ManualImageContainer-aba4ab9a.js","assets/get_assets-cf714148.js","assets/_plugin-vue_export-helper-c27b6911.js","assets/index-3019030b.js","assets/index-b23d1a2f.css","assets/ManualImageContainer-493bf4d2.css"]))},props:{id:{type:String,required:!0},GameData:{type:Object,required:!0},GameConfig:{type:Object,required:!0}},data(){return{configStage:{width:610,height:100},ComponentConfig:[],ComponentPositionConfig:{},DotLocation:[],LineWidth:2,IndexInfo:null,MiniGap:20,Lines:[],LinkedPoints:[],OnDrawingLine:{points:[],stroke:"black",strokeWidth:2,lineCap:"round",lineJoin:"round"},OnDrawing:!1,IndexMappingTable:[],MouseDownDotIndex:null,NotFinished:!1}},mounted(){this.IndexInfo=this.$refs.Index.getBoundingClientRect(),this.Init(),window.addEventListener("resize",this.Init),window.addEventListener("resize",this.ReLinktheLine),window.addEventListener("resize",()=>{console.log("Resize")})},created(){this.GameConfig.CheckingMode==null&&(this.GameConfig.CheckingMode="OnSubmit")},methods:{MouseDown(o,e){this.NotFinished=!1;const t=o.target.getStage().getPointerPosition();this.OnDrawing=!0,this.MouseDownDotIndex=e,this.OnDrawingLine={points:[t.x,t.y,t.x,t.y],stroke:"black",strokeWidth:this.LineWidth,lineCap:"round",lineJoin:"round"}},MouseMove(o){if(this.OnDrawing){const e=o.target.getStage().getPointerPosition();this.OnDrawingLine.points.splice(2,2,e.x,e.y),this.$refs.OnDrawLineLayer.getNode().draw()}},MouseUpAtDot(o){if(console.log("MouseUpAtDot"),this.OnDrawing){const e=o.target.getStage().getPointerPosition();this.OnDrawingLine.points.splice(2,2,e.x,e.y);let t=this.CheckMouseAtTheDot(e.x,e.y);if(t!=!1&&this.CheckLinkAble(this.MouseDownDotIndex,t)){let i=null;if(this.GameConfig.CheckingMode=="OnAnswered"?(i=this.CheckAnswerisCorrect(this.MouseDownDotIndex,t),console.log("Should be triggered")):i=!0,i){this.OnDrawingLine.points.splice(2,2,this.DotLocation[t].X,this.DotLocation[t].Y),this.Lines.push({...this.OnDrawingLine}),this.OnDrawing=!1,this.OnDrawingLine={points:[],stroke:"black",strokeWidth:2,lineCap:"round",lineJoin:"round"},this.$refs.LineLayer.getNode().draw(),this.$refs.OnDrawLineLayer.getNode().draw(),this.LinkedPoints.push([this.MouseDownDotIndex,t]),this.GameConfig.CheckingMode=="OnAnswered"&&this.CheckAllAnswered();return}}this.OnDrawing=!1,this.OnDrawingLine={points:[],stroke:"black",strokeWidth:2,lineCap:"round",lineJoin:"round"},this.$refs.OnDrawLineLayer.getNode().draw()}},CheckMouseAtTheDot(o,e){for(var t in this.DotLocation){let s=this.DotLocation[t],i=10;if(o>s.X-i&&o<s.X+i&&e>s.Y-i&&e<s.Y+i)return parseInt(t)}return!1},MappingDotIndexToAnswerIndex(o){return this.IndexMappingTable[o]},CheckLinkAble(o,e){console.log(o,e);let t=this.MappingDotIndexToAnswerIndex(o)[0],s=this.MappingDotIndexToAnswerIndex(e)[0];return t==s?(console.log("Same Column"),!1):(console.log("Different Column"),!0)},CheckAnswerisCorrect(o,e){let t=this.GameData.Answer,s=this.MappingDotIndexToAnswerIndex(o),i=this.MappingDotIndexToAnswerIndex(e);console.log(s,i);for(var n in t){if(t[n][0][0]==s[0]&&t[n][0][1]==s[1]&&t[n][1][0]==i[0]&&t[n][1][1]==i[1])return this.GameConfig.CheckingMode=="OnSubmit"||(this.$emit("play-effect","CorrectSound"),this.$emit("add-record",[this.GameData.Answer,[s,i],"正確"])),!0;if(t[n][0][0]==i[0]&&t[n][0][1]==i[1]&&t[n][1][0]==s[0]&&t[n][1][1]==s[1])return this.GameConfig.CheckingMode=="OnSubmit"||(this.$emit("play-effect","CorrectSound"),this.$emit("add-record",[this.GameData.Answer,[s,i],"正確"])),!0}return console.log("Wrong"),this.GameConfig.CheckingMode=="OnSubmit"||(this.$emit("play-effect","WrongSound"),this.$emit("add-record",[this.GameData.Answer,[s,i],"錯誤"])),!1},MarkWrongLine(o){this.Lines[o].stroke="red",this.$refs.LineLayer.getNode().draw()},ClearAllLine(){this.Lines=[],this.LinkedPoints=[],this.$refs.LineLayer.getNode().draw()},PopLastLine(){this.Lines.pop(),this.LinkedPoints.pop(),this.$refs.LineLayer.getNode().draw()},CheckAllAnswered(){this.LinkedPoints.length==this.GameData.Answer.length&&this.$emit("next-question")},CheckAll(){let o=0;if(this.LinkedPoints.length!=this.GameData.Answer.length){this.$emit("play-effect","WrongSound"),this.NotFinished=!0;return}for(var e in this.LinkedPoints){let t=this.LinkedPoints[e][0],s=this.LinkedPoints[e][1];this.GameData.Answer[e],this.CheckAnswerisCorrect(t,s)?o+=1:this.MarkWrongLine(e)}console.log(o),o==this.GameData.Answer.length?(this.$emit("play-effect","CorrectSound"),this.$emit("add-record",[this.GameData.Answer,this.LinkedPoints,"正確"]),this.$emit("next-question")):(this.$emit("play-effect","WrongSound"),this.$emit("add-record",[this.GameData.Answer,this.LinkedPoints,"錯誤"]))},ReLinktheLine(){this.Lines=[];for(var o in this.LinkedPoints){let e=this.LinkedPoints[o][0],t=this.LinkedPoints[o][1];this.OnDrawingLine.points=[this.DotLocation[e].X,this.DotLocation[e].Y,this.DotLocation[t].X,this.DotLocation[t].Y],this.Lines.push({...this.OnDrawingLine})}},Init(){let e=this.$refs.KonvaContainer.getBoundingClientRect();this.configStage.width=e.width,this.configStage.height=e.height;let t=this.GameData.Question.RowData.length;this.ComponentPositionConfig.ObjectWidth=e.width/(t*2+(t-1)*3)*2,this.ComponentPositionConfig.BlankWidth=e.width/(t*2+(t-1)*3)*3;let s=0,i=0;this.DotLocation=[],this.IndexMappingTable=[],this.ComponentConfig=[];for(var n in this.GameData.Question.RowData){let c=this.GameData.Question.RowData[n].length;this.ComponentPositionConfig.ObjectHeight=(e.height-this.MiniGap*(c+1))/c;let h=this.MiniGap;for(var d in this.GameData.Question.RowData[n]){let g={};g.X=s,g.Y=h,g.Name=this.GameData.Question.RowData[n][d].Name,g.Data=this.GameData.Question.RowData[n][d].Data,n!=0&&n!=this.GameData.Question.RowData.length-1?(this.IndexMappingTable.push([parseInt(i+1),parseInt(d)]),this.DotLocation.push({X:s+this.ComponentPositionConfig.ObjectWidth+this.MiniGap,Y:h+this.ComponentPositionConfig.ObjectHeight/2}),this.IndexMappingTable.push([parseInt(i),parseInt(d)]),this.DotLocation.push({X:s-this.MiniGap,Y:h+this.ComponentPositionConfig.ObjectHeight/2})):n==0?(this.IndexMappingTable.push([parseInt(i),parseInt(d)]),this.DotLocation.push({X:s+this.ComponentPositionConfig.ObjectWidth+this.MiniGap,Y:h+this.ComponentPositionConfig.ObjectHeight/2})):n==this.GameData.Question.RowData.length-1&&(this.IndexMappingTable.push([parseInt(i),parseInt(d)]),this.DotLocation.push({X:s-this.MiniGap,Y:h+this.ComponentPositionConfig.ObjectHeight/2})),h+=this.ComponentPositionConfig.ObjectHeight+this.MiniGap,this.ComponentConfig.push(g)}s+=this.ComponentPositionConfig.ObjectWidth+this.ComponentPositionConfig.BlankWidth,n!=0&&n!=this.GameData.Question.RowData.length-1?(console.log("Add 2"),i+=2):(console.log("Add 1"),i+=1)}}}},b={class:"Container"},S={class:"h1"},x={key:0},I={class:"Index",ref:"Index"},N={class:"Konva-container",ref:"KonvaContainer"},W={class:"Buttons"};function R(o,e,t,s,i,n){const d=p("v-circle"),c=p("v-layer"),h=p("v-line"),g=p("v-stage");return r(),l("div",b,[f("p",S,P(t.GameData.Question.text),1),i.NotFinished?(r(),l("p",x,"請連完所有的線段")):C("",!0),f("div",I,[f("div",N,[u(g,{config:i.configStage,class:"Stage",onMousemove:n.MouseMove,onMouseup:n.MouseUpAtDot},{default:m(()=>[u(c,null,{default:m(()=>[(r(!0),l(L,null,w(i.DotLocation,(a,D)=>(r(),k(d,{onMousedown:M=>{n.MouseDown(M,D)},key:D,config:{x:a.X,y:a.Y,radius:5,fill:"black"}},null,8,["onMousedown","config"]))),128))]),_:1}),u(c,{ref:"LineLayer"},{default:m(()=>[(r(!0),l(L,null,w(i.Lines,a=>(r(),k(h,{config:a},null,8,["config"]))),256))]),_:1},512),u(c,{ref:"OnDrawLineLayer"},{default:m(()=>[u(h,{config:i.OnDrawingLine},null,8,["config"])]),_:1},512)]),_:1},8,["config","onMousemove","onMouseup"])],512),(r(!0),l(L,null,w(i.ComponentConfig,(a,D)=>(r(),l("div",{class:"ObjectContainer",ref_for:!0,ref:"ObjectContainer",style:O({position:"absolute",top:a.Y+"px",left:a.X+"px",width:this.ComponentPositionConfig.ObjectWidth+"px",height:this.ComponentPositionConfig.ObjectHeight+"px"})},[(r(),k(v(a.Name),{Data:a.Data,ID:this.id,class:"Component",key:i.ComponentConfig},null,8,["Data","ID"]))],4))),256))],512),f("div",W,[this.GameConfig.CheckingMode=="OnSubmit"?(r(),l("button",{key:0,onClick:e[0]||(e[0]=(...a)=>n.CheckAll&&n.CheckAll(...a))},"檢查答案")):C("",!0),this.GameConfig.CheckingMode=="OnSubmit"?(r(),l("button",{key:1,onClick:e[1]||(e[1]=(...a)=>n.ClearAllLine&&n.ClearAllLine(...a))},"清除所有線")):C("",!0),this.GameConfig.CheckingMode=="OnSubmit"?(r(),l("button",{key:2,onClick:e[2]||(e[2]=(...a)=>n.PopLastLine&&n.PopLastLine(...a))},"刪除最後一條線")):C("",!0)])])}const Y=y(A,[["render",R],["__scopeId","data-v-af44cea0"]]);export{Y as default};
