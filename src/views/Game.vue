<template>
  <div id="GameView" ref="GameView">
    <header>
      <nav
        class="container-fluid navbar navbar-expand-md navbar-light sticky-top justify-content-around justify-content-md-center"
        style="justify-content: flex-start !important"
      >
        <a class="navbar-brand mx-3" href="#" alt="Home">
          <img src="@/assets/images/nav_bar/logo.png" />
        </a>
        <button
          class="navbar-toggler btn btn-primary mx-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText11"
          aria-controls="navbarText11"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="PreviousPage"
        >
          上一頁
        </button>
        <div class="collapse navbar-collapse mx-3" id="navbarText">
          <div
            class="container sticky-top d-flex justify-content-end"
            style="--bs-breadcrumb-divider: '>'"
          >
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <i class="bi bi-house"></i><a href="#"> 主頁</a>
              </li>
              <li
                class="breadcrumb-item"
                aria-current="page"
                @click="PreviousPage"
              >
                <i class="bi bi-book-half"></i>
                <a>{{ this.Grade }} 年級 {{ Subjects[Subject] }}</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="bi bi-pen"></i><a> {{ this.Name }}</a>
              </li>
            </ol>
          </div>
        </div>
      </nav>
    </header>
    <section>
      <div class="">
        <div class="Container">
          <div class="col-10 GameArea">
            <div
              class="row levelbutton d-sm-none d-md-block d-none d-sm-block"
              v-if="GameStatus == 'Progressing'"
            >
              <div
                class="d-grid gap-2 d-flex justify-content-center mb-3 levebar"
              >
                <button
                  type="button"
                  class="btn btn-primary flex-fill text-nowrap"
                  disabled
                >
                  關卡
                </button>
                <div
                  v-for="(i, key) in GameData.Questions"
                  :key="key"
                  class="grid-item flex-fill d-flex justify-content-between"
                >
                  <!-- <button type="button" class="btn btn-primary w-auto" @click="changelevel(key+1)">{{ key+1 }}</button> -->
                  <button
                    type="button"
                    class="btn btn-success flex-fill"
                    :class="{ active: Nowlevel == key + 1 }"
                    @click="changelevel(key + 1)"
                  >
                    {{ key + 1 }}
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn-primary flex-fill text-nowrap"
                  disabled
                  v-if="GameStatus == 'Progressing'"
                >
                  時間 : {{ time }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary flex-fill text-nowrap"
                  disabled
                  v-if="GameStatus == 'Progressing'"
                >
                  總計時間 : {{ totaltime }}
                </button>
              </div>
            </div>

            <div class="row Game_Component">
              <!-- Dynamic import component -->
              <div
                class="games"
                v-if="GameStatus == 'Progressing'"
                id="GameContainer"
              >
                <EffectWindow
                  id="CorrecIncorrect"
                  :Data="CorrectIncorrect"
                  v-if="ShowReply"
                ></EffectWindow>
                <transition :name="transitionName" mode="out-in">
                  <component
                    class="GameComponent111"
                    v-if="GameType != 'SelfDefine'"
                    v-bind:is="this.GameType"
                    ref="GameComponent"
                    :key="this.Nowlevel"
                    :id="this.GameID"
                    :GameData="this.GameData.Questions[this.Nowlevel - 1]"
                    :GameConfig="this.GameConfig"
                    @add-record="GameDataRecord"
                    @play-effect="EffectPlayer"
                    @next-question="NextQuestion"
                  >
                  </component>
                </transition>

                <component
                  v-if="GameType == 'SelfDefine'"
                  :key="this.Nowlevel"
                  :is="selfdefinetemplate"
                  :id="this.GameID"
                  :GameData="this.GameData.Questions[this.Nowlevel - 1]"
                  :GameConfig="this.GameConfig"
                  :EnviromerntInfo="GetAllInfo()"
                  @get-info="GetAllInfo"
                  @add-record="GameDataRecord"
                  @download-data="ToCSV"
                  @config-header="ConfigHeader"
                  @play-effect="EffectPlayer"
                  @next-question="NextQuestion"
                  @previous-question="PreviousQuestion"
                  @change-level="changelevel"
                  @start-game="StartGame"
                  @reload-page="reloadPage"
                  @change-status="ChangeGameStatus"
                  @timer-start="startTimer"
                  @timer-pause="pauseTimer"
                  @timer-reset="resetTimer"
                >
                </component>
              </div>
              <div class="intro" v-else>
                <GameStartandOver
                  v-if="Dataloaded"
                  :Status="GameStatus"
                  :intro="GameData.IntroText"
                  :GameName="Name"
                  :key="this.Dataloaded"
                  @start-game="StartGame"
                  @download-record="ToCSV"
                  @restart="reloadPage"
                  @previous-page="PreviousPage"
                ></GameStartandOver>
              </div>
            </div>
          </div>
          <SideBar
            class="SideBar col-2"
            v-if="Dataloaded"
            :GameStatus="GameStatus"
            :HintInfo="HintInfo"
            :Hint="Hint"
            :download_data="download_data"
            :levelAmount="this.GameData.Questions.length"
            :reAppeareCode="questionOrder"
            @to-csv="ToCSV"
            @provide-hint="ProvideHint"
            @previous-question="PreviousQuestion"
            @next-question="NextQuestion"
            @start-game="StartGame"
            @reload-page="reloadPage"
            @scratch-sheet="() => {scratchSheetVisible = true}"
            @reappear-code="reappearCode"
          >
            <template #hint>
              <hintbutton
                :HintInfo="HintInfo"
                v-if="
                  GameStatus == 'Progressing' && this.Hint['Type'] != 'Method'
                "
                @provide-hint="ProvideHint()"
              >
              </hintbutton>
            </template>
          </SideBar>

          <!-- Modal -->
          <div
  class="fade modal"
  id="Calculator"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  style="background: rgba(0, 0, 0, 0) !important;"
>
  <div class="modal-dialog modal-fullscreen">
    <div
      class="modal-content"
      style="
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0) !important;
        border: none;
        box-shadow: none;
      "
    >
      <scratchSheet
        v-if="scratchSheetVisible == true"
        @closeSheet="() => { closeSratSheet() }"
      ></scratchSheet>
    </div>
  </div>
          </div>


          <!--FIXME teach -->
          <div
            class="fade modal"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    不會玩嗎?請看教學影片:
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    @click="PauseIntroVideo()"
                  ></button>
                </div>
                <div class="modal-body justify-content-center">
                  <div id="novideo" v-if="introvideo == false">
                    <p class="h1">ㄨㄚˊ，找不到教學影片~~~</p>
                    <img src="@/assets/images/game_images/elephant.gif" />
                  </div>
                  <div id="havevideo d-flex" v-else>
                    <img
                      :src="VideoSrc"
                      class="img-fluid align-self-center"
                      style="height: 70vh"
                      v-if="isGif"
                    />
                    <video
                      id="introvideo"
                      :src="VideoSrc"
                      controls="controls"
                      class="img-fluid"
                      style="height: 70vh"
                      v-else
                    ></video>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    @click="PauseIntroVideo()"
                  >
                    我知道了!
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hint app -->
          <div
            class="fade modal"
            id="hint"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-xl">
              <div class="modal-content" style="height: 90vh">
                <!-- <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">這是提示</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div> -->
                <div class="modal-body d-flex justify-content-center">
                  <!-- <p>Hello</p>
                    {{ this.Hint['Type'] }} -->
                  <div
                    class="content Type-None"
                    v-if="this.Hint['Type'] == 'None'"
                  >
                    <p class="h1">喔喔，沒有提供相關的資源</p>
                    <img
                      src="@/assets/images/game_images/elephant.gif"
                      class=""
                    />
                  </div>
                  <div
                    class="content Type-Level"
                    v-if="this.Hint['Type'] == 'Level'"
                    :key="this.TotalLevel"
                  >
                    <p class="h1">這是關卡提示</p>
                    <video
                      id="Hint-video"
                      :src="this.Hint['Data']['FilePath']"
                      controls="controls"
                      class="img-fluid"
                      v-if="this.Hint.Data.SourceType == 'video'"
                    ></video>
                    <img
                      :src="this.Hint['Data']['FilePath']"
                      class="img-fluid"
                      v-if="this.Hint.Data.SourceType == 'image'"
                    />
                  </div>
                  <div
                    class="content Type-Single"
                    v-if="this.Hint['Type'] == 'Single'"
                  >
                    <p class="h1">這是單一提示</p>
                    <video
                      id="Hint-video"
                      :src="this.Hint['Data']['FilePath']"
                      controls="controls"
                      class="img-fluid"
                      v-if="this.Hint.Data.SourceType == 'video'"
                    ></video>
                    <img
                      :src="this.Hint['Data']['FilePath']"
                      class="img-fluid"
                      v-if="this.Hint.Data.SourceType == 'image'"
                    />
                  </div>
                  <!-- //FIXME video 自動暫停 -->
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    @click="PauseHintVideo()"
                  >
                    我知道了!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import fetchJson from "@/utilitys/fetch-json.js";
import * as Arr2CSV from "@/utilitys/array2csv.js";
import loading from "@/components/loading.vue";
import GameStartandOver from "@/components/GameStartandOver.vue";
import scratchSheet from "@/components/ScratchSheets.vue";
import hintbutton from "@/components/hintbutton.vue";
import * as ImportUrl from "@/utilitys/get_assets.js";
import axios from "axios";
import { defineAsyncComponent } from "vue";
// import CompareGame from "./GameTemplate/CompareGame.vue";
import EffectWindow from "@/components/EffectWindow.vue";
// import PairingGame from "./GameTemplate/PairingGame.vue";
// import WhackaMole from "./GameTemplate/WhackaMole.vue";
// import SelectGameMulti from "./GameTemplate/SelectGameMulti.vue";
// import CopyItem from "./GameTemplate/CopyItem.vue";
import gameStore from '@/stores/game';
import { mapWritableState } from "pinia";
import { soundManager } from '@/utilitys/sound-manager.js';

export default {
  data() {
    return {
      Dataloaded: false,
      introvideo: false,
      VideoSrc: "",
      GameType: "loading",
      GameStatus: "NotStart", //遊戲狀態
      download_data: [[]], //下載的資料，格式為二維陣列。
      header: [],
      GameID: "",
      Subject: "",
      Grade: "",
      Name: "",
      Nowlevel: 1,
      Subjects: {
        Math: "數學",
        Chinese: "國語",
        Technology: "多元科技",
      },
      GameConfig: {},
      GameData: {},
      time: 0,
      totaltime: 0,
      finaltime: 0,
      intervalId: null,
      EffectWindow: false,
      EffectSrc: "",
      scratchSheetVisible: false,
      QuestionsSequence: [],
      AllQuestions: [],
      ShowReply: false,
      Hint: {
        Type: "None",
        Data: {
          FilePath: "",
          SourceType: "",
        },
      },
      WrongTimes: 0,
      MaxWrongTimes: 2,
      CorrectIncorrect: {
        Status: null,
      },
      isPassLevel: [],
      questionOrder : [],
      questionCopy: [],
      isGif: false,
      transitionName: "slide-right",
      // SentData2ChildComponent: {},
    };
  },
  computed: {
    ...mapWritableState(gameStore, ['gameCode']),
    selfdefinetemplate() {
      return defineAsyncComponent(() =>
        import(
          `@/views/PrivateTemplate/Grade${this.$route.params.Grade}/${this.$route.params.id}.vue`
        )
      );
    },
    HintInfo() {
      return {
        WrongTimes: this.WrongTimes,
        MaxWrongTimes: this.MaxWrongTimes,
      };
    },
  },
  created() {
    this.GameID = this.$route.params.id;
    this.Subject = this.$route.params.Subject;
    this.Grade = this.$route.params.Grade;
    this.Name = this.$route.params.GameName;
    (async () => {
      try {
        let res = await fetchJson(`./Grade${this.Grade}/${this.GameID}.json`);
        this.GameData = res.data;
        this.GameType = this.GameData.GameType;
        this.GameConfig = this.GameData.GameConfig;
        this.questionCopy = this.GameData.Questions;
        this.InitHint();
        this.InitIntroVideo();
        this.Dataloaded = true;
        this.RamdonChoice();
        for(var x in this.GameData.Questions){
          this.isPassLevel.push(false);
        }
      } catch (error) {
        console.error("Fetch Game Data Error: ", error);
      }
    })();
      console.log(this.gameCode);
      soundManager.registerSound('Correct', `${ImportUrl.getSystemEffectAssets("CorrectAnswer.mp3")}`,false);
      soundManager.registerSound('Wrong', `${ImportUrl.getSystemEffectAssets("WrongAnswer.mp3")}`,false);
      soundManager.registerSound('FireWorkAnimation', `${ImportUrl.getSystemEffectAssets("harray.mp3")}`,false);
  },
  mounted() {
    this.FullScreen();
  },
  methods: {
    RamdonChoice() {
      //Radom Select Questions via level
      let question = [];
      var temp = [];
      var checkcorrect = true;
      let record = [];
      for (var i in this.GameData.Questions) {
        if (this.GameData.Questions[i].length != undefined) {
          var num = this.GameData.Questions[i].length;
          var rand = Math.floor(Math.random() * (num - 0 + 0));
          console.log('rand',rand);
          question.push(this.GameData.Questions[i][rand]);
          record.push(rand);
        } else {
          checkcorrect = false;
          break;
        }
      }
      this.gameCode = record.toString().replaceAll(',','-');
      if (checkcorrect) {
        console.log(question);
        this.GameData.Questions = question;
      } else {
        this.gameCode = 'origin'
        console.warn(
          "Radom Select Questions via level Fail, this could be the question is not a array (Format Error)"
        );
      }
    },
    reappearCode() {
      if (this.gameCode == 'origin') return;
      let reappear = this.gameCode.split('-');
      let question = [];
      reappear.forEach((element,index) => {
        question.push(this.questionCopy[index][element]);
      });
      this.GameData.Questions = question;
      this.questionOrder = this.gameCode;
    },
    PauseIntroVideo() {
      try {
        let video = document.getElementById("introvideo");
        video.pause();
      } catch {}
    },
    InitIntroVideo() {
      
      this.introvideo = true;
      //find is undefined in url
      let patten = /undefined/;
      let temp = ImportUrl.GamesGetAssetsFile( this.GameID,this.GameData.introvideo );
      temp = temp.toString();
      temp = patten.test(temp)?undefined:temp;
      if (this.GameData.introvideo != undefined && temp) {
        this.VideoSrc = ImportUrl.GamesGetAssetsFile(
          this.GameID,
          this.GameData.introvideo
        );
      } else if (ImportUrl.getDefaultHintAssets(`${this.GameType}.gif`)) {
        this.VideoSrc = ImportUrl.getDefaultHintAssets(`${this.GameType}.gif`);
        this.isGif = true;
      } else {
        this.introvideo = false;
        console.warn("No Intro Video");
      }
      
    },
    ChangeGameStatus(status) {
      //改變遊戲狀態
      this.GameStatus = status;
    },
    StartGame() {
      this.GameStatus = "Progressing";
      this.startTimer();
    },
    ConfigHeader(arr) {
      this.header = arr;
    },
    ToCSV(data = this.download_data, defaultheader = true) {
      if (defaultheader) {
        let download = Arr2CSV.MadeCsvFile(
          this.GameID,
          this.Name,
          this.Grade,
          this.Subject,
          data,
          this.finaltime,
          this.gameCode
        );
        Arr2CSV.DownloadCSV(download, this.Name);
      } else {
        let download = Arr2CSV.MadeCsvFile(
          this.GameID,
          this.Name,
          this.Grade,
          this.Subject,
          data,
          this.finaltime,
          this.gameCode,
          this.header,
        );
        Arr2CSV.DownloadCSV(download, this.Name);
      }
    },
    reloadPage() {
      this.GameStatus = "NotStart";
      this.Nowlevel = 1;
      this.WrongTimes = 0;
      this.pauseTimer();
      this.resetTimer();
      this.time = 0;
      this.totaltime = 0;
      this.finaltime = 0;
      this.download_data = [[]];
      this.isPassLevel = [];
      for(var x in this.GameData.Questions){
        this.isPassLevel.push(false);
      }
    },
    changelevel(change2level) {
      this.WrongTimes = 0;
      if (change2level > this.GameConfig.TotalLevel || change2level < 1) {
        console.log("The level is out of range");
      } else {
        this.Nowlevel = change2level;
        if (this.Nowlevel > change2level) {
          this.transitionName = "slide-left";
        } else if (this.Nowlevel < change2level) {
          this.transitionName = "slide-right";
        }
        this.pauseTimer();
        //FIXME 傳資料進入CSV
        this.resetTimer();
        this.startTimer();
      }
    },
    NextQuestion() {
      this.isPassLevel[this.Nowlevel-1] = true;
      this.WrongTimes = 0;
      let isDone = true;
      for(var i in this.isPassLevel){
        if(this.isPassLevel[i] == false){
          isDone = false;
          break;
        }
      }
      let notFound = true;
      for (var i = this.Nowlevel; i < this.GameData.Questions.length; i++) {
        if (this.isPassLevel[i] == false) {
          this.Nowlevel = i + 1;
          this.transitionName = 'slide-left';
          notFound = false;
          break;
        }
      }
      if (notFound) {
        for (var i = 0; i < this.isPassLevel.length; i++) {
          if (this.isPassLevel[i] == false) {
            this.Nowlevel = i + 1;
            this.transitionName = 'slide-left';
            isDone = false;
            break;
          }
        }
      }
      if(isDone){
        this.GameStatus = "Done";
        soundManager.stopAllSounds();
        this.EffectPlayer("FireWorkAnimation");
        this.finaltime = this.totaltime;
      }
      this.pauseTimer();
      this.resetTimer();
      this.startTimer();
    },
    PreviousQuestion() {
      this.WrongTimes = 0;
      if (this.Nowlevel > 1) {
        this.Nowlevel--;
        this.transitionName = 'slide-right';
      }
      this.pauseTimer();
      //FIXME 傳資料進入CSV
      this.resetTimer();
      this.startTimer();
    },

    startTimer() {
      if (this.intervalId) {
        return;
      }
      this.intervalId = window.setInterval(() => {
        this.time++;
        this.totaltime++;
      }, 1000);
    },
    pauseTimer() {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    },
    resetTimer() {
      this.pauseTimer();
      this.time = 0;
    },
    GameDataRecord(data, SelfDefine = false) {
      //紀錄遊戲資料
      // default ["正確答案","學生作答答案","是否正確","作答秒數(關卡)","作答秒數(總時間)"]
      // data格式[正確答案,學生作答答案,是否正確]
      let record = [];
      if (SelfDefine) {
        record = Arr2CSV.ArrayTemplate2Record(
          data,
          this.Nowlevel,
          this.time,
          this.totaltime
        );
        console.log("Self Define Game Data Record");
      } else {
        record = [data[0], data[1], data[2], this.time, this.totaltime];
        console.log("Default Game Data Record: " + record);
      }
      try {
        this.download_data[this.Nowlevel - 1].push(record);
      } catch (error) {
        this.download_data.push([]);
        this.download_data[this.Nowlevel - 1].push(record);
      }
    },
    EffectPlayer(type) {
      //播放音效    
      switch (type) {
        case "CorrectSound":
          // var sound = new Audio();
          // sound.src = ImportUrl.GetSystemEffectAssetsFile("CorrectAnswer.mp3");
          // console.log(sound.src);

          this.EffectPlayer("CorrectAnimation");
          soundManager.playSound(`Correct`, false);
          // sound.oncanplaythrough = function () {
          //   sound.play();
          // };
          break;
        case "WrongSound":
          this.WrongTimes++;
          // var sound = new Audio();
          // sound.src = ImportUrl.GetSystemEffectAssetsFile("WrongAnswer.mp3");
          this.EffectPlayer("IncorrectAnimation");
          soundManager.playSound(`Wrong`, false);
          // sound.oncanplaythrough = function () {
          //   sound.play();
          // };
          break;
        case "FireWorkAnimation":
          this.EffectWindow = true;
          this.EffectSrc = new URL(`../assets/Effects/Firework.gif`, import.meta.url).href;
          var sound = new Audio();
          sound.src = ImportUrl.GetSystemEffectAssetsFile("harray.mp3");
          soundManager.playSound(`FireWorkAnimation`, false);
          sound.oncanplaythrough = function () {
            sound.play();
          };
          setTimeout(() => {
            this.EffectWindow = false;
          }, 3000);
          break;
        case "HarraySound": //Wait for remove
          // this.EffectPlayer("FireWorkAnimation");
          console.warn("HarraySound is Deprecated, Please use FireWorkAnimation instead");
          var sound = new Audio();
          sound.src = ImportUrl.GetSystemAssetsFile("harray.mp3","effects");
          sound.src = ImportUrl.GetSystemEffectAssetsFile("harray.mp3");
          soundManager.playSound(`harray`, false);
          sound.oncanplaythrough = function () {
            sound.play();
          };
          break;
        case "CorrectAnimation":
          this.CorrectIncorrect.Status = "Correct";
          this.ShowReply = true;
          setTimeout(() => {
            this.ShowReply = false;
          }, 1000);
          break;
        case "IncorrectAnimation":
          this.CorrectIncorrect.Status = "Incorrect";
          this.ShowReply = true;
          setTimeout(() => {
            this.ShowReply = false;
          }, 1000);
          break;
      }
    },
    FullScreen() {
      try {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          /* IE11 */
          elem.msRequestFullscreen();
        }
      } catch (error) {}
      // window.removeEventListener('mousemove', this.FullScreen);
    },
    ExitFullScreen() {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      } catch (error) {
        console.warn("Exit Full Screen Error: ", error);
      }
    },
    GetAllInfo() {
      return {
        Subject: this.Subject,
        Grade: this.Grade,
        Name: this.Name,
        GameID: this.GameID,
        GameType: this.GameType,
        GameConfig: this.GameConfig,
        GameData: this.GameData,
        GameStatus: this.GameStatus,
        Nowlevel: this.Nowlevel,
        time: this.time,
        intervalId: this.intervalId,
        EffectWindow: this.EffectWindow,
        EffectSrc: this.EffectSrc,
      };
    },
    //hint app

    InitHint() {
      // 紀錄提示種類，有則設定hint_type為提示種類，沒有則設定hint_type為None
      // console.log(this.GameData.Hint)
      let hint_exist = false;
      let RuleType;
      let hint_type;
      try {
        console.log("Hint type: " + this.GameData.Hint.ShowAs);
        this.Hint["Type"] = this.GameData.Hint.ShowAs;
      } catch {
        this.Hint["Type"] = "None";
        console.warn("No hint in this game");
      }
      try {
        this.MaxWrongTimes = this.GameData.Hint.Data.MaxWrongTimes;
        if (this.MaxWrongTimes == undefined) {
          this.MaxWrongTimes = 2;
          console.warn("No MaxWrongTimes in Hint Rule, set to default 2");
        }
      } catch {
        this.MaxWrongTimes = 2;
        console.warn(
          "No Rule in Hint Rule, set to default:{Type:WrongTimes, Value:2}"
        );
      }
    },
    ProvideHint() {
      let hint_type = this.Hint["Type"];
      switch (hint_type) {
        case "Level":
          try {
            let temp = this.GameData.Hint.Data[this.Nowlevel - 1].FilePath;
            temp = this.GameData.Hint.Data[this.Nowlevel - 1].SourceType;
            this.Hint.Data.FilePath = ImportUrl.GamesGetAssetsFile(
              this.GameID,
              this.GameData.Hint.Data[this.Nowlevel - 1].FilePath
            );
            this.Hint.Data.SourceType =
              this.GameData.Hint.Data[this.Nowlevel - 1].SourceType;
            // this.Hint["Data"] = this.GameData.Hint.Data[this.Nowlevel-1];
            // this.Hint["Data"]['FilePath'] = ImportUrl.GamesGetAssetsFile(this.GameID,this.GameData.Hint.Data[this.Nowlevel-1].FilePath);
          } catch {
            // console.log("Missing data in Hint, type: Level");
            console.warn("Missing data in Hint, type: Level");
            this.Hint["Type"] = "None";
          }
          break;
        case "Single":
          try {
            let temp = this.GameData.Hint.Data.FilePath;
            temp = this.GameData.Hint.Data.SourceType;
            this.Hint.Data.FilePath = ImportUrl.GamesGetAssetsFile(
              this.GameID,
              this.GameData.Hint.Data.FilePath
            );
            this.Hint.Data.SourceType = this.GameData.Hint.Data.SourceType;
          } catch {
            // console.log("Missing data in Hint, type: Single");
            console.warn("Missing data in Hint, type: Single");
            this.Hint["Type"] = "None";
          }
          break;
        case "None":
          this.Hint["Type"] = "None";
          break;
        case "Method":
          this.$refs.GameComponent.CallHint(this.Nowlevel, this.GameData.Hint);
          this.Hint["Type"] = "Method";
          break;
        default:
          // console.log("No hint in this game");
          console.warn("No hint in this game");
          this.Hint["Type"] = "None";
      }
    },
    PauseHintVideo() {
      try {
        let video = document.getElementById("Hint-video");
        video.pause();
      } catch {}
    },
    PreviousPage() {
      soundManager.stopAllSounds();
      this.ExitFullScreen();
      this.$router.replace({ path: `/GameSelect/${this.$route.params.Grade}`})
    },
    closeSratSheet() {
      this.scratchSheetVisible = false;
      var modal = document.getElementById("Calculator");
      modal.classList.remove("show");
      modal.style.display = "none";
    },
  },
  components: {
    hintbutton,
    scratchSheet,
    GameStartandOver,
    loading,
    LinkGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/LinkGame.vue")
    ),
    CompareGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CompareGame.vue")
    ),
    TrueFalseGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/TrueFalseGame.vue")
    ),
    SelectGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SelectGame.vue")
    ),
    NumberInputGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberInputGame.vue")
    ),
    ClassifyGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/ClassifyGame.vue")
    ),
    SortGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SortGame.vue")
    ),
    FindTheItemGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/FindTheItemGame.vue")
    ),
    AutoNumberingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/AutoNumberingGame.vue")
    ),
    NumberingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberingGame.vue")
    ),
    CompareGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CompareGame.vue")
    ),
    FillinBlank: defineAsyncComponent(() =>
      import("@/views/GameTemplate/FillinBlank.vue")
    ),
    CalculatorGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CalculatorGame.vue")
    ),
    PairingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/PairingGame.vue")
    ),
    NumberLock: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberLock.vue")
    ),
    RacingCar: defineAsyncComponent(() =>
      import("@/views/GameTemplate/RacingCar.vue")
    ),
    WhackaMole: defineAsyncComponent(() =>
      import("@/views/GameTemplate/WhackaMole.vue")
    ),
    Maze: defineAsyncComponent(() => import("@/views/GameTemplate/Maze.vue")),
    NumberLock: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberLock.vue")
    ),
    SelectGameMulti: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SelectGameMulti.vue")
    ),
    NumberSearchGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberSearchGame.vue")
    ),
    Track: defineAsyncComponent(() => import("@/views/GameTemplate/Track.vue")),
    EffectWindow,
    SideBar: defineAsyncComponent(() =>
      import("@/components/GameSystem/SideBar.vue")
    ),
    CopyItem: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CopyItem.vue")
    ),
  },
};
</script>
<style scoped lang="scss">
header {
  background-color: #f19c79;
  height: 10vh !important;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.navbar {
  background-color: #f19c79;
  .navbar-brand {
    img {
      @media (max-width: 576px) {
        height: 7vh;
        width: auto;
      }
      @media (min-width: 576px) {
        max-width: 20vw;
      }
    }
  }
  img {
    max-width: 80%;
  }
}
.img-hover-zoom {
  transition: transform 0.3s ease; /* 平滑的過渡效果 */
}

.img-hover-zoom:hover {
  transform: scale(1.07); /* 放大至原大小的 110% */
}

.breadcrumb .breadcrumb-item {
  a {
    color: #fff; /* 替換為你想要的顏色 */
    font-size: 1.2em;
  }
}
.img-hover-zoom {
  max-width: 100%; /* 或者是卡片寬度的百分比 */
  height: auto; /* 保持圖片的比例 */
}
.list-group {
  border: none !important; /* 移除邊框 */
}
.list-group-item {
  border: none !important; /* 移除每個 list-group-item 的邊框 */
}
/* 如果按鈕內有圖片，也要確保圖片不會超出按鈕的寬度 */
.function-btn img {
  max-width: 100%;
  height: auto; /* 保持圖片的比例 */
}
.levebar {
  // overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

//btn, container, row, col

.Container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100vw;
  height: 90vh !important;
  .GameArea {
    margin-top: 2vh;
    width: 85%;
    padding-right: 1rem;
    padding-left: 1rem;
    #GameContainer {
      height: 100%;
      position: relative;
      #CorrecIncorrect {
        position: absolute;
        width: 98% !important;
        height: 98% !important ;
        z-index: 100;
      }
    }
  }
}

#Effects {
  position: absolute;
  top: 0;
  left: 0;
  width: autos;
  height: 100vh;
}

.Game_Component {
  width: 84vw !important;
  max-height: 79vh;
  // border: solid 1px #000;
  height: 79vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  overflow-x: auto;
  overflow-y: scroll;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  img {
    max-width: 100%;
    height: auto;
  }
  video {
    max-width: 100%;
    height: auto;
  }
}

.Pointable {
  cursor: pointer;
}


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
//   position: absolute;
  width: 100%;
}

.slide-left-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter {
  transform: translateX(-100%);
}

.slide-left-enter-to,
.slide-left-leave,
.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0%);
}
</style>
