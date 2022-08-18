import {
  Component,
  OnInit,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { fromEvent, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren('figurePart') figureParts;
  correctLetters: string[] = [];
  wrongLetters = [];
  keydownObservable$: Observable<any>;
  keydownSubscription$: Subscription;
  title = 'Hangman_Game';
  words = ['application', 'programming', 'interface', 'wizard'];
  selectedWord;
  mappedSelectedWord;
  letter;
  word;
  wordsMatch = false;
  letterTyped = false;
  displayFigurePart = false;
  finalMessage = false;

  ngOnInit(): void {
    this.chooseRandomWord();
    this.displayWord();
  }

  ngAfterViewInit(): void {
    this.checkTypedLetters();
  }

  chooseRandomWord() {
    let selectedWord =
      this.words[Math.floor(Math.random() * this.words.length)];
    this.selectedWord = selectedWord;
  }

  displayWord() {
    let mappedSelectedWord = this.selectedWord.split('').map((letter: any) => {
      if (this.correctLetters.includes(letter)) {
        this.letter = letter;
        return this.letter;
      }
    });
    this.mappedSelectedWord = mappedSelectedWord;
    this.word = mappedSelectedWord.join('').replace(/\n/g, '');
    if (this.word === this.selectedWord) {
      this.wordsMatch = true;
    }
  }

  notifyThatLetterAlreadyTyped() {
    this.letterTyped = true;
    setTimeout(() => {
      this.letterTyped = false;
    }, 2000);
  }

  checkTypedLetters() {
    this.keydownObservable$ = fromEvent(window, 'keydown');
    this.keydownSubscription$ = this.keydownObservable$.subscribe((event) => {
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        const letter = event.key;
        if (this.selectedWord.includes(letter)) {
          if (!this.correctLetters.includes(letter)) {
            this.correctLetters.push(letter);
            this.displayWord();
          } else {
            this.notifyThatLetterAlreadyTyped();
          }
        } else {
          if (!this.wrongLetters.includes(letter)) {
            this.wrongLetters.push(letter);
            this.displayParts();
          } else {
            this.notifyThatLetterAlreadyTyped();
          }
        }
      }
    });
  }

  displayParts() {
    let figurePartsElements = this.figureParts.map((element) => {
      return element.nativeElement;
    });
    figurePartsElements.forEach((element, index) => {
      const errors = this.wrongLetters.length;
      if (index < errors) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
    if (this.wrongLetters.length === figurePartsElements.length) {
      this.finalMessage = true;
    }
  }

  playAgain() {
    this.correctLetters.splice(0);
    this.wrongLetters.splice(0);
    this.chooseRandomWord();
    this.displayWord();
    this.displayParts();
    this.wordsMatch = false;
    this.finalMessage = false;
  }

  ngOnDestroy() {
    this.keydownSubscription$.unsubscribe();
  }
}
