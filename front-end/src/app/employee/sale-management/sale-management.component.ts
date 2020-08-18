import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../auth/token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sale-management',
  templateUrl: './sale-management.component.html',
  styleUrls: ['./sale-management.component.scss']
})
export class SalesManagementComponent implements OnInit {
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
