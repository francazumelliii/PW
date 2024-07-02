import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { inject, Inject } from '@angular/core';
import { map } from 'rxjs';
export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService)
  return authService.isAuthenticated()
    .pipe(
      map((isAuthenticated: any) => {
        if(isAuthenticated){
          return true
        }else{
          authService.logOut()
          return false
        }
      })
    )

};
