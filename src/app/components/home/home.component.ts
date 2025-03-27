import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CarroselComponent } from "../carrosel/carrosel.component";
import { FeedMasculinoComponent } from "../feed-masculino/feed-masculino.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarroselComponent, FeedMasculinoComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
