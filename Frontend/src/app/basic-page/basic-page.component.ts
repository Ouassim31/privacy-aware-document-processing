import { Component, OnInit } from '@angular/core';

/**
 * This is the starting page, here we integrate other pages depending on the person that accesses the page
 */

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styleUrls: ['./basic-page.component.scss']
})
export class BasicPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
