import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CarroselComponent } from "../carrosel/carrosel.component";
import { FeedMasculinoComponent } from "../feed-masculino/feed-masculino.component";
import { FeedFemininoComponent } from "../feed-feminino/feed-feminino.component";
import { BenefitsComponent } from "../benefits/benefits.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarroselComponent, FeedMasculinoComponent, FeedFemininoComponent, BenefitsComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
