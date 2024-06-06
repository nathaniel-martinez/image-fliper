import { Component, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-flipper',
  standalone: true,
  imports: [],
  templateUrl: './flipper.component.html',
  styleUrl: './flipper.component.css',
  animations: [
    trigger('flipAnimation', [
      state('front', style({transform: 'none'})),
      //state('easterEgg', style({transform: 'rotateY(540deg)'})),//Want to change this so that the eaterEgg rotates quicker need to use keyframes
      state('back', style({transform: 'rotateY(180deg)'})),
      transition('front => eaterEgg', [animate('1200ms ease-in-out', keyframes([
        style({transform: 'rotateY(0deg)', offset: 0}),
        style({transform: 'rotateY(108deg)', offset: 0.2}),
        style({transform: 'rotateY(216deg)', offset: 0.4}),
        style({transform: 'rotateY(324deg)', offset: 0.6}),
        style({transform: 'rotateY(432deg)', offset: 0.8}),
        style({transform: 'rotateY(540deg)', offset: 1}),
      ]))]),
      transition('front => back', animate('1200ms ease-in-out')), //IMPORTANT: This time in animate needs to be set to same as animationDuration class property
      transition('back => front, easterEgg => front', animate('0ms')),
    ])
  ]
})

export class FlipperComponent {
  //All image Urls. The fourth one is an easter egg!
  imgUrls: [string, string, string, string] = ["./Phone-Jotto-Feedback.png", "./Phone-Jotto-Insights.png", "./Phone-Jotto-Scan.png", "./easterImg.png"];
  //All Camptions. The fourth one corresponds to the easter egg!
  captions: [string, string, string, string] = ["Video", "Idea", "QR", "Meme"];
  caption: string = "Video";
  imgUrlsIndex: number = 0; //Index to access normal images and remember the order of which to access wanted to make it type 0 | 1 | 2 but gave err?
  easterEggIndex: 3 = 3;
  imgUrl: string = this.imgUrls[this.imgUrlsIndex];
  showEasterEgg: boolean = false; //property that controls the component functionality if it is set to show the Easter Egg
  
  flipState: "front" | "back" | "easterEgg" = "front"; //Changes in this variable trigger both animations depending on what flag is set
  isFlipping: boolean = false; //Flag to see if currently flipping
  animationDuration: 1200 = 1200; //How long the flip animation is in ms
  mirrored: "mirrored" | "reg" = "reg"; //Class that makes sure image is always oriented correctly even when rotated

  /*Keep track of time between clicks using a [clickCounter: number]
    [checkClick(d: Date): boolean] increments the counter if the click is close enough to the prev one (First click always increments)
    [checkClick(d: Date): boolean] sets counter to zero if we have a click not close enough, and returns a bool stating if we reached
    the counter goal

    only need to use checkClick()
  */
  clickHistory: {checkClick: () => boolean, reqTimeDiffMs: number, prevClick: Date, clickGoal: number, clickCounter: number} = {
    clickGoal: 3,
    clickCounter: 0,
    reqTimeDiffMs: 250,
    prevClick: new Date(),
    checkClick: () => {
      let currentDate: Date = new Date();
      let msDiff: number = currentDate.getTime() - this.clickHistory.prevClick.getTime();
      this.clickHistory.prevClick = currentDate;
      if(this.clickHistory.clickCounter == 0){ //Logic for first click always count it
        this.clickHistory.clickCounter++;
        return false;
      }
      else if(msDiff > this.clickHistory.reqTimeDiffMs){ //Click time diff is longer than our range
        this.clickHistory.clickCounter = 0;
        return false;
      }
      else if(this.clickHistory.clickCounter < this.clickHistory.clickGoal - 1){ //click time diff is in our range but we havent reached out goal
        this.clickHistory.clickCounter++;
        return false
      }
      else{ // We reach our rapid clicks goal and we reset the counter
        this.clickHistory.clickCounter = 0;
        return true;
      }
    }
  };

  btnClick(): void{
    /*impedes function from doing anything if we are set to show the easteregg. 
      Once we finish showing the easter egg it regains functionality*/
    console.log(`showEasterEgg: ${this.showEasterEgg}`);
    console.log(`isFlipping: ${this.isFlipping}`);
    console.log(`flipState: ${this.flipState}`);
    if(!this.showEasterEgg){
      this.showEasterEgg = this.clickHistory.checkClick(); //We should still check for clicks if function is flipping
      if(!this.isFlipping){ //If funciton is not fliping we should make it flip
        this.isFlipping = true;
        this.flipState = this.showEasterEgg ? 'easterEgg': 'back'; //Call the right animation depending if we show the easter egg or not
      }
    }
  }

  onFlipStart(){
    if(this.isFlipping && this.flipState != "front"){ //make sure this function does not run when we first define flipState and changing flipState to front
      setTimeout(() => {
        if(this.showEasterEgg){ //If we need to show the easter egg we show the right image
          this.imgUrl = this.imgUrls[this.easterEggIndex];
          this.caption = this.captions[this.easterEggIndex]; //Rotateing Caption as well
        }
        else{ //If we are not showing the easter egg we iterate over the first three elements of the array circularly to find our image
          this.imgUrlsIndex = (this.imgUrlsIndex + 1) % 3;
          this.imgUrl = this.imgUrls[this.imgUrlsIndex];
          this.caption = this.captions[this.imgUrlsIndex]; //Rotateing Caption as well
        }
        this.mirrored = 'mirrored'; //When we view the backside rotated image it is mirrored to appear normal
      }, this.animationDuration / 2) //We do this halfway through the animation to give the effect of flipping to a new image
    }
  }

  onFlipEnd(){
    this.isFlipping = false; //Once we finished flipping we tell our component we are done
    if(this.showEasterEgg){ //If we were showing the easter egg we set this flag to false
      this.showEasterEgg = false;
    }
    if(this.flipState != "front"){ //Set the transformation to 0 again so we can keep flipping infinetly
      this.mirrored = 'reg';
      this.flipState = "front";
    }
  }
}