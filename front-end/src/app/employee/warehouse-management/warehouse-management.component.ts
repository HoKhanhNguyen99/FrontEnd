import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../auth/token-storage.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.scss']
})
export class WarehouseManagementComponent implements OnInit {
  userDisplayName = '';
  constructor(private tokenStorageService: TokenStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userDisplayName = sessionStorage.getItem('loggedUser');
  }
  onLogOut(): void {
    this.tokenStorageService.signOut();
    this.router.navigateByUrl('');
  }
}
