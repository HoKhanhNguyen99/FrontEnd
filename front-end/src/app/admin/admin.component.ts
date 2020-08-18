import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userName: string;

  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.userName = this.tokenStorageService.getUsername();
  }

  search() {
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
