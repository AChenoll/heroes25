import { map, Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";


const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap( isAuthenticated => console.log('Authenticated:', isAuthenticated)),
    tap( isAuthenticated => {
            if(isAuthenticated){
              router.navigate(['/heroes/list'])
            }
    }),
    map( isAuthenticated => isAuthenticated = !isAuthenticated ) // Cambio isAuthenticated a true porque si no da false y genera un bucle infinito
  )
}

export const canMatchPublicGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanMatchPublic');
  console.log({route, segments});

  return checkAuthStatus();
};

export const CanActivatePublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanActivatePublic');
  console.log({route, state});

  return checkAuthStatus();
}
