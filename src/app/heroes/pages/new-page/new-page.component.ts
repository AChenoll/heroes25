import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent {
  public heroForm= new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl(''),
  });

  public publishers=[
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ]

  public titulo: string= '';
  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ){}

  ngOnInit(): void{
    if(!this.router.url.includes('edit')) {
      this.titulo = 'Nuevo heroe';
      return;
    };

    // Me traigo los datos del héroe igual que en la hero-page
    this.activatedRoute.params.pipe(
          switchMap(({id}) => this.heroesService.getHeroById(id))
        ).subscribe( hero =>{
          if(!hero) return this.router.navigate(['/heroes/list']);
          // Cambio el título de la página
          this.titulo= 'Editar '+hero.superhero

          // Vacío los campos del formulario
          this.heroForm.reset(hero);

          return;
        })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id){
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        // TODO: Mostrar snackbar
        this.showSnackbar(`${hero.superhero} updated!`)
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe(hero => {
      // TODO: Mostrar snackbar y navegar a /heroes/edit/hero.id
      this.router.navigate([`/heroes/edit/${this.currentHero.id}`]);
      this.showSnackbar('Nuevo heroe creado!!!')
    })

    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value
    // });

  }

  private showSnackbar(message: string): void {
    this.snackbar.open( message, 'OK', {duration: 2500})
  }

  public onDeleteHero(){
    if (!this.currentHero.id) throw Error ('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(!result) return;
      if (this.currentHero.id){
        this.heroesService.deleteHeroById(this.currentHero.id).subscribe(hero => {
          this.router.navigate(['/heroes/list']);
          if(hero) this.showSnackbar('Hero deleted');
        });
        return;
      }
    })
  }

}
