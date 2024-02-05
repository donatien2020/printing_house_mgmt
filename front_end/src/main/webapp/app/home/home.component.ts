import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
//import { Chart } from 'chart.js';
import { Chart, LinearScale } from 'chart.js/auto';


@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();

  myAreaChart!: ElementRef;
  myPieChart!: ElementRef;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.accountService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
  if(this.isLoggedIn())
      this.createChart();
    }

  createChart(): void {
     const element = this.renderer.selectRootElement('#myAreaChart');
    if (element) {

      const ctx = element.getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Label 1', 'Label 2', 'Label 3'],
          datasets: [
            {
              label: 'Sample Data',
              data: [10, 20, 15],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
  }



    // Bar Chart Example

    var rightChart = this.renderer.selectRootElement('#myPieChart');
     if(rightChart){
      const myChart = new Chart(rightChart, {
            type: 'pie',
            data: {
              labels: ['Label 1', 'Label 2', 'Label 3'],
              datasets: [
                {
                  label: 'Sample Data',
                  data: [10, 20, 15],
                  backgroundColor: ['rgba(250, 200, 200, 0.2)','rgba(235, 210, 250, 0.2)','rgba(245, 123, 178, 0.2)'],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });


}











  }
}
