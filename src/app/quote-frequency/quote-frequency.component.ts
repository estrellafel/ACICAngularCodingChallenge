import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';

@Component({
  selector: 'app-quote-frequency',
  templateUrl: './quote-frequency.component.html',
  styleUrls: ['./quote-frequency.component.css']
})

export class QuotesFrequencyComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];
  topTwo: LineOfBusiness[] = [];

  /* Constructor to use the LineOfBusinessService */
  constructor(
    private lineOfBusinessService: LineOfBusinessService,
  ) { }

  /** 
   * Defualt as it is invoke when the directive is instantiated.
   * Will call getRecentQuotes to begin process of getting top two
   * lines of business.
   * */
  ngOnInit() {
    this.getRecentQuotes();
  }

  /**
   * Get the list of RecentQuotes, and proceed to get the top two
   * lines of business by storing them in topTwo.
   */
  getRecentQuotes(): void {
    this.lineOfBusinessService.getRecentQuotes()
      .subscribe(recentQuotes => {
        this.recentQuotes = recentQuotes
        this.getTopBusinesses();
      });
  }

  /** Will get the top two lines of business */
  getTopBusinesses(): void {
    // Will get the occuances for each lineOfBussiness
    let occurances: Map<number, number> = this.countQuotes(this.recentQuotes);
    // Will be used to store the occurances from most used to least
    let sortedOccurances: number[][] = [];
    let i: number = 0;

    // Push each id with the number of occurances into list as a list
    occurances.forEach((value, key) => {
      sortedOccurances.push([key, value]);
    });

    // Sort the list by the the occurances which is the second index of each list
    sortedOccurances.sort((a, b) => {
      return b[1] - a[1];
    });

    // Get the lineOfBussiness from the id (first index) and add it to the topTwo list
    for(i = 0; i < sortedOccurances.length && i < 2; i++) {
      this.lineOfBusinessService.getLineOfBusiness(sortedOccurances[i][0])
      .subscribe(lineofBusiness => {
        this.topTwo.push(lineofBusiness);
      })
    }
  }

  /** 
   * Will count the number of each type of lineOfBusiness by the 
   * number of times it is qouted 
   * 
   * @param {RecentQuotes[]} - List of all the recent quotes
   * @returns {Map<number, number} - <id, number of occurances>
   * 
  */
  countQuotes(qoutes: RecentQuotes[]): Map<number, number> {
    let occurances: Map<number, number> = new Map<number, number>();
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