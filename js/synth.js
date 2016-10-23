var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var cMajor = [261.63,293.66,329.63,349.23,392,440,523.25,523.25];
var cMinor = [130.81,146.83,155.56,174.61,196,207.65,233.08,261.63];
var cMajorInitial = cMajor[0];
var gainNode = audioCtx.createGain();
this.randomNoteLength = Math.floor(Math.random()*4);
this.noteHappyLength = [250,250,250,500,750];
this.noteSadLength = [375,375,750,1125,1500];
gainNode.gain.value=2.0;
this.audioCents = [0.9,0.1,1.1,1.05,1.15,1.25,1.35,1.4];
this.audioCentsSad = [0.6,0.7,0.8,0.85,0.95,1.05,1.15,1.2];
gainNode.connect(audioCtx.destination);
var oscillator = audioCtx.createOscillator();
var audio;
var source;
function start(sounds){
if(sounds!=null){
    var play = document.querySelector("audio");
    play.play();
    play.loop=true;

    this.i=0;
var changeFreq = function(major){
    if(this.i==0||this.i==2||this.i==4||this.i==7||this.i==6){
        var cur = this.i;
        var switchToMinor = Math.floor(Math.random()*3);
        if(switchToMinor==0&& i !=7){
            this.i +=1;
        }
        else{
            var arr = [0,2,4,7];
         this.i = arr[Math.floor(Math.random()*4)];

         while(this.i==cur||Math.abs(cur-this.i)>=6){
             this.i =arr[Math.floor(Math.random()*4)];
         }
     }
    }
    else{
        console.log("fd4ds"+this.i)
        var up = Math.floor(Math.random()*4);
        if(up==0){
            this.i--;
            console.log("f3dds"+this.i)
        }
        else if(up==1){
            this.i++;
            console.log("f22dds"+this.i)
        }
        else if(up==2){
            this.i+=3;
            if(this.i>=cMajor.length){
                this.i=7;
            }
            console.log("ff11dds"+this.i)
        }
        else{
            this.i-=3;
            if(this.i<0){
                this.i=0;
            }
            console.log("fdds"+this.i)
        }
        console.log("fdds"+this.i)
    }
    console.log("f"+this.i);
    oscillator.frequency.value = major[this.i];  
    if(happy){
    play.playbackRate=audioCents[this.i];
}
else{
    play.playbackRate=audioCentsSad[this.i];
}
};


oscillator.connect(gainNode);
 oscillator.type = 'triangle'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = cMajor[0]; // value in hertz
 oscillator.start();

 
 (function loop() {
    isHappy=true;
    var noteLength = 0;
    if(happy){
        var r = Math.floor(Math.random()*5);
            console.log("happy "+ r);
            noteLength = noteHappyLength[r];
        if((this.i%2==1 ||this.i==6)&&r==4&&i!=7){
                console.log("minor "+ i);
                r= Math.floor(Math.random()*4);
                noteLength=noteHappyLength[r];
        }
        if(r==0){
            noteLength = noteHappyLength[Math.floor(Math.random()*2+1)]
        }
    }
    else{
        var r = Math.floor(Math.random()*5);
            console.log("happy "+ r);
            noteLength = noteSadLength[r];
        if((this.i%2==1 ||this.i==6)&&r==4&&i!=7){
                console.log("minor "+ i);
                r= Math.floor(Math.random()*4);
                noteLength=noteSadLength[r];
        }
        if(r==0){
            noteLength = noteSadLength[Math.floor(Math.random()*2+1)]
        }
       
    } 
    console.log(noteLength + "sss")
    setTimeout(function() {
        if(this.i<cMajor.length&&isHappy){
            changeFreq(cMajor);  
        }
        else{
            changeFreq(cMinor);
        }
        loop();

    },noteLength);
}());

}}
