import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';
import { FormControlService } from '../../Services/form-control.service';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { APIResponse, List } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { SweetAlertUpdatableParameters } from 'sweetalert2';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass'
})
export class SidebarComponent implements OnInit{

  mobileQuery: MediaQueryList;
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private swal : SweetalertService,
    private authService: AuthenticationService,
    private dbService: DatabaseService,
    private roleService: RoleService,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
      }

  ngOnInit(){
    this.getList()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logOut(){
    this.authService.logOut()
  }


  list: List[] = []
  getList(){
    const role = this.roleService.role
    this.dbService.get(`/api/v1/${role}/me/list`)
      .subscribe((response: APIResponse) => {
        response.success ? this.list = JSON.parse(response.data): null
        console.log("LIST ", this.list)
      },
      (error : any ) => {
        this.swal.fire("error","ERROR","Error retriving data for menu list...", ""),
        console.error(error)
      })
  }

}
