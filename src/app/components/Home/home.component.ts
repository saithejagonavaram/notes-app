import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

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
// import { v4 as uuid } from 'uuid';
// const moment = require('moment');

const log = new Logger('Home');

const DEFAULT_NOTE_TITLE = 'New Note';
const DEFAULT_NOTE_BRIEF = 'No additonal text';

// const NOTES:Note[] = [
//   {
//     id: 1,
//     title: 'This is an example notation of the text',
//     relativeTimeStamp: '8:50 PM',
//     mainTimeStamp: '17/11/2019',
//     brief: 'NO additonal content recommended by the',
//     content: 'This is an example notation of the text /n NO additonal content recommended by the',
//     timeStamp: '1573991397614'

//   },
//   {
//     id: 2,
//     title: 'Note1 is written by me',
//     relativeTimeStamp: '9:50 PM',
//     mainTimeStamp: '16/11/2019',
//     brief: 'NO additonal content recommended by the',
//     content: 'This is an example notation of the text /n NO additonal content recommended by the',
//     timeStamp: '1573991397614'

//   },
//   {
//     id: 3,
//     title: 'Logger',
//     relativeTimeStamp: '10:50 PM',
//     mainTimeStamp: '17/11/2019',
//     brief: 'NO additonal content recommended by the',
//     content: 'This is an example notation of the text /n NO additonal content recommended by the',
//     timeStamp: '1573991397614'

//   }
// ]
declare var moment: any;
declare var uuid: any;

// let time = moment(new Date()).valueOf()
// // console.log('moemment', time);
// // console.log('format', moment(time).format('LL'))
// // console.log('uuid', uuid.v4());

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements AfterViewInit {

  @ViewChild('notetext') noteTextField: ElementRef;

  public logMessages: any;

  public momentForUI:any = moment;

  mainNotes:Note[] = [];
  notes:Note[] = [];
  filteredNotes: Note[] = [];
  filtering:boolean  = false;
  selectedNote: Note;

  showSideBar =  true;

  newNoteOpened:boolean = false;
  noteId:string = uuid.v4();
  newNoteData: Note = {
    id: uuid.v4(),
    title: DEFAULT_NOTE_TITLE,
    relativeTimeStamp: '',
    mainTimeStamp: '',
    brief: DEFAULT_NOTE_BRIEF,
    content: '',
    timeStamp: ''
  }

  constructor(
    ) {
      // console.log('this.getLocalStorage()',this.getLocalStorage());
      if(this.getLocalStorage() !== null){
        this.mainNotes = this.getLocalStorage();
        this.notes = this.mainNotes;
      } else {
        this.setLocalStorage();
      }
      // console.log('this.notes', this.notes);
      if(this.notes.length > 0){
        this.selectedNote = this.notes[0];
      }else {
       
        this.selectedNote = this.newNoteData;
        // this.createNote();
      }

      localStorage.setItem('user', 'testing');
      let time = new Date().toISOString();
      // console.log('this.momentForUI', time);
      // console.log('format', this.momentForUI(time).format('LL'))
  }

  ngAfterViewInit() {
    // console.log('selectedNote',this.selectedNote);
    this.noteTextField.nativeElement.focus();
  }

  setLocalStorage(){
    if(!this.filtering){
      this.mainNotes = this.notes;
      localStorage.setItem('notes', JSON.stringify(this.mainNotes));
    }else {

      localStorage.setItem('notes', JSON.stringify(this.mainNotes));
    }
  }

  getLocalStorage(){
    return JSON.parse(localStorage.getItem('notes'));
  }

  removeCreatedNote() {
    let that = this;
    this.notes = this.notes.filter(function(note){
      return note.id !== that.noteId;
    });
    this.setLocalStorage();
    this.newNoteOpened = false;
  }

  onSelect(note:Note): void {

    if(note.id !== this.selectedNote.id) {

      if(this.newNoteOpened && this.newNoteData.content.length===0) {

        this.removeCreatedNote();
      
      }else {
        this.newNoteOpened = false;
      } 

      this.selectedNote = note;
      this.noteTextField.nativeElement.focus();
    }
  }

  getMainTimeStamp(timestamp:any){
    return moment(timestamp).format('DD MMMM YYYY')+ ' at ' + moment(timestamp).format('LT');
  }

  getRelativeTimeStamp(timestamp:any){
    return moment().calendar(timestamp, {
      sameDay: 'LT',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD/MM/YYYY'
  });
  }
  getCurrentTimeStamp(){
    return moment(new Date()).valueOf();
  }
  
  updateEditedNoteTimeStamp() {
    this.selectedNote.timeStamp = this.getCurrentTimeStamp();
    this.selectedNote.mainTimeStamp = this.getMainTimeStamp(this.selectedNote.timeStamp);
    this.selectedNote.relativeTimeStamp = this.getRelativeTimeStamp(this.selectedNote.timeStamp);
  }

  createNote() {
    // // console.log('creating new note');
    this.newNoteOpened = true;
    this.noteId = uuid.v4();
    let data = {
      id: this.noteId,
      title: DEFAULT_NOTE_TITLE,
      relativeTimeStamp: '',
      mainTimeStamp: '',
      brief: DEFAULT_NOTE_BRIEF,
      content: '',
      timeStamp: this.getCurrentTimeStamp()
    }

    data.mainTimeStamp = this.getMainTimeStamp(data.timeStamp);
    data.relativeTimeStamp = this.getRelativeTimeStamp(data.timeStamp);

    this.newNoteData = data;
    this.notes.unshift(this.newNoteData);
    this.selectedNote = this.newNoteData;
    this.noteTextField.nativeElement.focus();
    this.setLocalStorage();
    // // console.log('this.notes', this.notes);
  }

  deleteNote() {
    // // console.log('deleting note');

    let that = this;
    this.notes = this.notes.filter(function(note){
      return note.id !== that.selectedNote.id;
    })

    if(this.filtering){
      this.mainNotes = this.mainNotes.filter(function(note){
        return note.id !== that.selectedNote.id;
      })
    }
    
    this.setLocalStorage();

    if(this.newNoteOpened) {
      this.newNoteOpened = false;
    } 
    //Do sorting here
    if(this.notes.length != 0){
      this.selectedNote = this.notes[0];
    } else {
      this.selectedNote = this.newNoteData;
    }
    
    // console.log('this.notes after del', this.notes);
  }

  // remove_linebreaks(str:string ) { 
  //   return str.replace( /[\r\n]+/gm, "" ); 
  // }

  getTitleAndBrief(lineBreakSplit: any){
    let that = this;
    let getTitle = true;
    let getBrief = false;
    lineBreakSplit.forEach(function(line:any){
          
      let testLine = line.trim();
      // console.log('testLine',testLine,testLine.length);
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

    // console.log('getTitle', getTitle);
    // console.log('getBrief', getBrief);

    if(getTitle && !getBrief){
      this.selectedNote.title = DEFAULT_NOTE_TITLE;
      this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
    }
    if(!getTitle && getBrief){
      this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
    }
    // console.log('this.notes in getTitle', this.notes);
    this.setLocalStorage();
  }

  noteContentChanged(selectedNote: Note){

    if(this.newNoteOpened && this.newNoteData.content.length>0){
      this.newNoteOpened = false;
    }

    // console.log('selectedNote changed',selectedNote);
    var firstLineBreakIndex = this.selectedNote.content.indexOf("\n");
    // console.log('firstLineBreakIndex',firstLineBreakIndex);
    var lineBreakSplit = this.selectedNote.content.split("\n");
    this.updateEditedNoteTimeStamp();
    this.sortNotes();
    this.getTitleAndBrief(lineBreakSplit);     
    }

    sortNotes(){
      // console.log('callong sort');
      this.notes.sort(function(x:any, y:any){
        return y.timeStamp - x.timeStamp;
    });
    if(!this.filtering){
      this.mainNotes = this.notes;
    }
    // this.selectedNote = this.notes[0];
    }

    searchNotes(text:any) {
      // console.log('search text', text);
      if(!this.filtering){
        this.mainNotes =  this.notes;
       
      }
 
      this.filteredNotes =  this.mainNotes.filter(function(note){
        // console.log('note.content', note.content);
        // console.log('note.content.indexOf(text) ', note.content.indexOf(text) );
        return note.content.indexOf(text) >= 0;
      });

      // console.log('filteredItems', this.filteredNotes);
      if(this.filteredNotes.length > 0) {
        this.notes = this.filteredNotes;
        this.selectedNote = this.notes[0];
        this.filtering = true;
      }
    }

    stopSearchNotes() {
      // console.log('stopping search', this.mainNotes);
      this.filteredNotes = [];
      this.notes = this.mainNotes;
      this.selectedNote = this.notes[0];
      
      this.filtering = false;
    }

    toggleSideBar(){
      this.showSideBar = !this.showSideBar;
      // console.log('this.showSideBar', this.showSideBar);
    }

  }
  


