import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';
import { HeaderComponent } from './components/Header/header.component';
import { HomeComponent } from './components/Home/home.component';



@NgModule({
  imports:      [ 
    BrowserModule, 
    AppRoutingModule ,
    FormsModule
],
  declarations: [ AppComponent, HeaderComponent, HomeComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 

  constructor(){
  }
}
