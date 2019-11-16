import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
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

const log = new Logger('Home');

const NOTES:Note[] = [
  {
    id: 1,
    title: 'This is an example notation of the text',
    editedTime: '8:50 PM',
    editedDate: '17/11/2019',
    description: 'NO additonal content recommended by the'

  },
  {
    id: 2,
    title: 'Note1 is written by me',
    editedTime: '9:50 PM',
    editedDate: '16/11/2019',
    description: 'Didnt had a glimpse of doubt jfgj jgfhgfhfhfhgfh ffh fhgfg'

  },
  {
    id: 3,
    title: 'Logger',
    editedTime: '10:50 PM',
    editedDate: '17/11/2019',
    description: 'Didnt had a glimpse of doubt'

  }
]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent implements OnInit {

  public logMessages: any;

  notes = NOTES;
  selectedNote: Note = this.notes[0];

  newNoteOpened:boolean = false;
  noteId:number = 9;
  newNoteData: Note = {
    id: 0,
    title: 'New Note',
    editedTime: '8:50 PM',
    editedDate: '17/11/2019',
    description: 'No additonal text'
  }

  constructor(
      private router: Router
    ) {
     
  }

  ngOnInit() {
    console.log('selectedNote',this.selectedNote);
  }

  removeCreatedNode() {
    let that = this;
    this.notes = this.notes.filter(function(note){
      return note.id !== that.noteId-1;
    })
    this.newNoteOpened = false;
  }


  onSelect(note:Note): void {

    if(this.newNoteOpened) {

      this.removeCreatedNode();
      
    } 

    this.selectedNote = note;
    console.log('note',this.selectedNote);

    console.log('this.notes', this.notes);
  }

  createNote($event:any) {
    console.log('creating new note');
    this.newNoteOpened = true;
    this.newNoteData.id = this.noteId++;
    this.notes.unshift(this.newNoteData);
    this.selectedNote = this.newNoteData;

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

    this.selectedNote = this.notes[0];
    console.log('this.notes after del', this.notes);
  }
  

}
