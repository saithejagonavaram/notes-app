import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Logger
} from '../../services/logger/logger.service';
import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import {
  setTimeout
} from 'timers';

import { Note } from '../../models/note.model';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

const log = new Logger('Home');

const DEFAULT_NOTE_TITLE = 'New Note';
const DEFAULT_NOTE_BRIEF = 'No additonal text';

const NOTES:Note[] = [
  {
    id: 1,
    title: 'This is an example notation of the text',
    editedTime: '8:50 PM',
    editedDate: '17/11/2019',
    brief: 'NO additonal content recommended by the',
    content: 'This is an example notation of the text /n NO additonal content recommended by the'

  },
  {
    id: 2,
    title: 'Note1 is written by me',
    editedTime: '9:50 PM',
    editedDate: '16/11/2019',
    brief: 'NO additonal content recommended by the',
    content: 'This is an example notation of the text /n NO additonal content recommended by the'

  },
  {
    id: 3,
    title: 'Logger',
    editedTime: '10:50 PM',
    editedDate: '17/11/2019',
    brief: 'NO additonal content recommended by the',
    content: 'This is an example notation of the text /n NO additonal content recommended by the'

  }
]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent implements AfterViewInit {

  @ViewChild('notetext') noteTextField: ElementRef;

  public logMessages: any;

  notes = NOTES;
  selectedNote: Note = this.notes[0];

  newNoteOpened:boolean = false;
  noteId:number = 9;
  newNoteData: Note = {
    id: 0,
    title: DEFAULT_NOTE_TITLE,
    editedTime: '8:50 PM',
    editedDate: '17/11/2019',
    brief: DEFAULT_NOTE_BRIEF,
    content: ''
  }

  constructor(
      private router: Router
    ) {
     
  }

  ngAfterViewInit() {
    console.log('selectedNote',this.selectedNote);
    this.noteTextField.nativeElement.focus();
  }

  removeCreatedNode() {
    let that = this;
    this.notes = this.notes.filter(function(note){
      return note.id !== that.noteId-1;
    })
    this.newNoteOpened = false;
  }

  onSelect(note:Note): void {

    if(this.newNoteOpened && this.newNoteData.content.length===0) {

      this.removeCreatedNode();
      
    }else {
      this.newNoteOpened = false;
    } 

    this.selectedNote = note;
    this.noteTextField.nativeElement.focus();
    console.log('note',this.selectedNote);

    console.log('this.notes', this.notes);
  }

  createNote($event:any) {
    console.log('creating new note');
    this.newNoteOpened = true;
    let data = {
      id: this.noteId++,
      title: DEFAULT_NOTE_TITLE,
      editedTime: '8:50 PM',
      editedDate: '17/11/2019',
      brief: DEFAULT_NOTE_BRIEF,
      content: ''
    }
    this.newNoteData = data;
    this.notes.unshift(this.newNoteData);
    this.selectedNote = this.newNoteData;
    this.noteTextField.nativeElement.focus();
    console.log('this.notes', this.notes);
  }

  deleteNote() {
    console.log('deleting note');

    let that = this;
    this.notes = this.notes.filter(function(note){
      return note.id !== that.selectedNote.id;
    })

    if(this.newNoteOpened) {
      this.newNoteOpened = false;
    } 
    //Do sorting here
    if(this.notes.length != 0){
      this.selectedNote = this.notes[0];
    } else {
      this.selectedNote = this.newNoteData;
    }
    
    console.log('this.notes after del', this.notes);
  }

  remove_linebreaks(str:string ) { 
    return str.replace( /[\r\n]+/gm, "" ); 
  }

  getTitleAndBrief(lineBreakSplit: any){
    let that = this;
    let getTitle = true;
    let getBrief = false;
    lineBreakSplit.forEach(function(line:any){
          
      let testLine = line.trim();
      console.log('testLine',testLine,testLine.length);
      if(testLine.length>0 && getTitle){
        that.selectedNote.title = line;
        getTitle = false;
        getBrief = true;
        return;
      }

      if(line.length>0 && getBrief){
        that.selectedNote.brief = line;
        getBrief = false;
      }

    })

    console.log('getTitle', getTitle);
    console.log('getBrief', getBrief);

    if(getTitle && !getBrief){
      this.selectedNote.title = DEFAULT_NOTE_TITLE;
      this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
    }
    if(!getTitle && getBrief){
      this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
    }
  }

  noteContentChanged(selectedNote: Note){

    if(this.newNoteOpened && this.newNoteData.content.length>0){
      this.newNoteOpened = false;
    }

    console.log('selectedNote changed',selectedNote);
    var firstLineBreakIndex = this.selectedNote.content.indexOf("\n");
    console.log('firstLineBreakIndex',firstLineBreakIndex);
    var lineBreakSplit = this.selectedNote.content.split("\n");

    this.getTitleAndBrief(lineBreakSplit);

    // if(firstLineBreakIndex>0){
    //   console.log('lineBreakSplit',lineBreakSplit);
    //   // this.selectedNote.title = lineBreakSplit[0];

    //   this.getTitleAndBrief(lineBreakSplit);

    // } else if(firstLineBreakIndex == -1){
    //   // this.selectedNote.title = 'New Note';
    //     // if(this.selectedNote.content.length == 0){
    //     //   this.selectedNote.title = DEFAULT_NOTE_TITLE;
    //     // }
    //     this.getTitleAndBrief(lineBreakSplit);
    //   }else {
    //     // this.selectedNote.title = DEFAULT_NOTE_TITLE;

    //     // let test = this.remove_linebreaks(this.selectedNote.content);
      
    //     // console.log('test', test);
    //       this.getTitleAndBrief(lineBreakSplit);


    //   }
     
    }
    

  }
  


