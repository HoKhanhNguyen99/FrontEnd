import {Component, OnInit} from '@angular/core';
import {AccessTimesService} from '../../services/access-times.service';
import {Accesstimes} from '../../models/accesstimes';


@Component({
  selector: 'app-access-times',
  templateUrl: './access-times.component.html',
  styleUrls: ['./access-times.component.scss']
})
export class AccessTimesComponent implements OnInit {
  type = 'msline';
  dataFormat = 'json';
  data: any;
  dataSource = {};
  accessTimes: Accesstimes[];
  typeDate = '';

  constructor(private accessTimesService: AccessTimesService) {
  }

  ngOnInit(): void {
    this.accessTimesService.findAll().subscribe(next => {
      this.accessTimes = next;
      this.data = {
        chart: {
          caption: 'Lượt truy cập',
          // yAxisName: '% of youth on this platform',
          // subcaption: 'Năm ' + this.accessTimes[0].dates.slice(0, 4),
          showhovereffect: '1',
          numbersuffix: 'lần',
          drawcrossline: '1',
          plottooltext: '<b>$dataValue</b> truy cập',
          theme: 'fusion'
        },
        categories: [
          {
            category: [
              {
                label: this.accessTimes[0].dates
              },
              {
                label: this.accessTimes[1].dates
              },
              {
                label: this.accessTimes[2].dates
              },
              {
                label: this.accessTimes[3].dates
              },
              {
                label: this.accessTimes[4].dates
              },
              {
                label: this.accessTimes[5].dates
              },
              {
                label: this.accessTimes[6].dates
              },
              {
                label: this.accessTimes[7].dates
              },
              {
                label: this.accessTimes[8].dates
              },
              {
                label: this.accessTimes[9].dates
              },
              {
                label: this.accessTimes[10].dates
              },
              {
                label: this.accessTimes[11].dates
              },
            ]
          }
        ],
        dataset: [
          {
            data: [
              {
                value: this.accessTimes[0].counts,
              },
              {
                value: this.accessTimes[1].counts
              },
              {
                value: this.accessTimes[2].counts
              },
              {
                value: this.accessTimes[3].counts
              },
              {
                value: this.accessTimes[4].counts
              },
              {
                value: this.accessTimes[5].counts
              },
              {
                value: this.accessTimes[6].counts
              },
              {
                value: this.accessTimes[7].counts
              },
              {
                value: this.accessTimes[8].counts
              },
              {
                value: this.accessTimes[9].counts
              },
              {
                value: this.accessTimes[10].counts
              },
              {
                value: this.accessTimes[11].counts
              }
            ]
          }
        ]

      };
      this.dataSource = this.data;
    });
  }

  selectTypeDate() {
    console.log(this.typeDate);
    if (this.typeDate == 'Day') {
      this.ngOnInit()
    } else if (this.typeDate == 'Month') {
      this.accessTimesService.findAllMonth().subscribe(next => {

        this.accessTimes = next;
        this.data = {
          chart: {
            caption: 'Lượt truy cập',
            // yAxisName: '% of youth on this platform',
            // subcaption: 'Năm ' + this.accessTimes[0].dates.slice(0, 4),
            showhovereffect: '1',
            numbersuffix: 'lần',
            drawcrossline: '1',
            plottooltext: '<b>$dataValue</b> truy cập',
            theme: 'fusion'
          },
          categories: [
            {
              category: [
                {
                  label: this.accessTimes[0].dates
                },
                {
                  label: this.accessTimes[1].dates
                },
                {
                  label: this.accessTimes[2].dates
                },
                {
                  label: this.accessTimes[3].dates
                },
                {
                  label: this.accessTimes[4].dates
                },
                {
                  label: this.accessTimes[5].dates
                },
                {
                  label: this.accessTimes[6].dates
                },
                {
                  label: this.accessTimes[7].dates
                },
                {
                  label: this.accessTimes[8].dates
                },
                {
                  label: this.accessTimes[9].dates
                },
                {
                  label: this.accessTimes[10].dates
                },
                {
                  label: this.accessTimes[11].dates
                },
              ]
            }
          ],
          dataset: [
            {
              data: [
                {
                  value: this.accessTimes[0].counts,
                },
                {
                  value: this.accessTimes[1].counts
                },
                {
                  value: this.accessTimes[2].counts
                },
                {
                  value: this.accessTimes[3].counts
                },
                {
                  value: this.accessTimes[4].counts
                },
                {
                  value: this.accessTimes[5].counts
                },
                {
                  value: this.accessTimes[6].counts
                },
                {
                  value: this.accessTimes[7].counts
                },
                {
                  value: this.accessTimes[8].counts
                },
                {
                  value: this.accessTimes[9].counts
                },
                {
                  value: this.accessTimes[10].counts
                },
                {
                  value: this.accessTimes[11].counts
                }
              ]
            }
          ]
        };
        this.dataSource = this.data;
      })
    } else if (this.typeDate == 'Year') {
      this.accessTimesService.findAllYear().subscribe(next => {

        this.accessTimes = next;
        this.data = {
          chart: {
            caption: 'Lượt truy cập',
            // yAxisName: '% of youth on this platform',
            // subcaption: 'Năm ' + this.accessTimes[0].dates.slice(0, 4),
            showhovereffect: '1',
            numbersuffix: 'lần',
            drawcrossline: '1',
            plottooltext: '<b>$dataValue</b> truy cập',
            theme: 'fusion'
          },
          categories: [
            {
              category: [
                {
                  label: this.accessTimes[0].dates
                },
                {
                  label: this.accessTimes[1].dates
                },
                {
                  label: this.accessTimes[2].dates
                },
                {
                  label: this.accessTimes[3].dates
                },
                {
                  label: this.accessTimes[4].dates
                },
                {
                  label: this.accessTimes[5].dates
                },
                {
                  label: this.accessTimes[6].dates
                },
                {
                  label: this.accessTimes[7].dates
                },
                {
                  label: this.accessTimes[8].dates
                },
                {
                  label: this.accessTimes[9].dates
                },
                {
                  label: this.accessTimes[10].dates
                },
                {
                  label: this.accessTimes[11].dates
                },
              ]
            }
          ],
          dataset: [
            {
              data: [
                {
                  value: this.accessTimes[0].counts,
                },
                {
                  value: this.accessTimes[1].counts
                },
                {
                  value: this.accessTimes[2].counts
                },
                {
                  value: this.accessTimes[3].counts
                },
                {
                  value: this.accessTimes[4].counts
                },
                {
                  value: this.accessTimes[5].counts
                },
                {
                  value: this.accessTimes[6].counts
                },
                {
                  value: this.accessTimes[7].counts
                },
                {
                  value: this.accessTimes[8].counts
                },
                {
                  value: this.accessTimes[9].counts
                },
                {
                  value: this.accessTimes[10].counts
                },
                {
                  value: this.accessTimes[11].counts
                }
              ]
            }
          ]
        };
        this.dataSource = this.data;
      })
    }
  }
}
