import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';

@Component({
  selector: 'app-quote-frequency',
  templateUrl: './quote-frequency.component.html',
})

export class QuotesFrequencyComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];
  topTwo: LineOfBusiness[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
  ) { }

  ngOnInit() {
    this.getRecentQuotes();
  }

  getRecentQuotes(): void {
    this.lineOfBusinessService.getRecentQuotes()
      .subscribe(recentQuotes => {
        this.recentQuotes = recentQuotes
        this.getTopBusinesses();
      });
  }

  getTopBusinesses(): void {
    // get most popular line of business
    let occurances = this.countQuotes(this.recentQuotes);
    let sortedOccurances: any[] = [];
    let i: number = 0;
    occurances.forEach((value, key) => {
      sortedOccurances.push([key, value]); // 👉️ Chile country, 30 age
    });

    sortedOccurances.sort((a, b) => {
      return b[1] - a[1];
    });
    for(i = 0; i < sortedOccurances.length && i < 2; i++) {
      this.lineOfBusinessService.getLineOfBusiness(sortedOccurances[i][0])
      .subscribe(lineofBusiness => {
        // push line of business to popularity array
        this.topTwo.push(lineofBusiness);
      })
    }
  }

  countQuotes(qoutes: RecentQuotes[]): Map<number, number> {
    let occurances = new Map<number, number>();
    qoutes.forEach(q => {
      if (occurances.has(q.lineOfBusiness)) {
        let num: number = occurances.get(q.lineOfBusiness)!;
        occurances.set(q.lineOfBusiness, num + 1);
      } else {
        occurances.set(q.lineOfBusiness, 1);
      }
    });
    return occurances;
  }

}