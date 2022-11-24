import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is the starting page, here we integrate other pages depending on the person that accesses the page
 */

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styleUrls: ['./basic-page.component.scss']
})
export class BasicPageComponent implements OnInit {

  constructor(private router: Router) { }

  goToApplicant($param: string = '') {
    const navPath: string[] = ['/applicant-form'];
    if ($param.length) {
      navPath.push($param);
    }
    this.router.navigate(navPath);
  }

  goToLandlord($param: string = '') {
    const navPath: string[] = ['/landlord-form'];
    if ($param.length) {
      navPath.push($param);
    }
    this.router.navigate(navPath);
  }

  ngOnInit(): void {
  }

}
