import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  // Variable para almacenar el listado de héroes
  public listadoHeroes: Hero[] = [];

  // Inyectar el servicio
  constructor(private heroesService: HeroesService){  }


  ngOnInit(): void {
      this.getHeroes();
  }

  getHeroes(): void {
    this.heroesService.getHeroes().subscribe(listado => this.listadoHeroes = listado);
  }

}
