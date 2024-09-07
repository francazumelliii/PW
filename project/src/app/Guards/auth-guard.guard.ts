import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  
  if (authService.isAuthenticated()) {
    return true; 
  } else {
    authService.logOut();  
    return false;  
  }
};
