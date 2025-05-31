import { Component, HostListener, OnInit } from '@angular/core';
import { CarroselComponent } from "../carrosel/carrosel.component";
import { FeedMasculinoComponent } from "../feed-masculino/feed-masculino.component";
import { FeedFemininoComponent } from "../feed-feminino/feed-feminino.component";
import { BenefitsComponent } from "../benefits/benefits.component";
import { SobreNosComponent } from "../sobre-nos/sobre-nos.component";
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarroselComponent,
    FeedMasculinoComponent,
    FeedFemininoComponent,
    BenefitsComponent,
    SobreNosComponent,
    CommonModule,
],
  providers: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit{
 isMobile: boolean = false;

 constructor(
  private deviceService: DeviceService
 ){
 }

  ngOnInit() {
    this.checkScreen();
    this.isMobile = this.deviceService.isMobile();
    this.deviceService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  private checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }
}
