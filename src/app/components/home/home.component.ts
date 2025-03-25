import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CarroselComponent } from "../carrosel/carrosel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarroselComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
