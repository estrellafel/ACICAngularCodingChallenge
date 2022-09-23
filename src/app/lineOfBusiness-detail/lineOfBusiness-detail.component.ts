import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html'
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  recentQuotes: RecentQuotes[] = []; // Array of recentQuotes
  frequency: number = 0; // Number of quotes

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getLineOfBusiness();
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getRecentQuotes(id); // Call to add quotes to list
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  /** 
   * Will count the number of occurances for a lineOfBusiness id and
   * store that value in frequency.
   * 
   * @param {number} - id corresponding to line of business id
   * */ 
  getRecentQuotes(id: number): void {
    this.lineOfBusinessService.getRecentQuotes()
      .subscribe(recentQuotes => {
        recentQuotes.forEach(quote => {
          if (quote.lineOfBusiness == id) {
            this.frequency++;
          }
        })
      })
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
