import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
// import { Logger } from '../../../services/logger/logger.service';
// import { AppConfig } from '../../../app.config';

// const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {


  @Output() createNoteEvent = new EventEmitter<null>();
  @Output() deleteNoteEvent = new EventEmitter<null>();

  constructor() {

  }

  ngOnInit() {
  }

  deleteNote() {
    this.deleteNoteEvent.emit(null);
  }
  createNote() {
    this.createNoteEvent.emit(null);
    
  }

}
