import { Component, OnInit, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { environment } from '../../../environments/environment';

interface CategoryData {
    category: string;
    categoryDescription: string;
    mccLogoUrl: string;
    totalAmount: number;
    percentage: number;
    color: string;
}

interface ChartTransaction {
    amount: number;
    category: string;
    categoryDescription: string;
    mccLogoUrl: string;
}

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [CommonModule, NgxEchartsModule],
    providers: [
        {
            provide: NGX_ECHARTS_CONFIG,
            useFactory: () => ({ echarts: () => import('echarts') })
        }
    ],
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
    private ngZone = inject(NgZone);

    // Month navigation
    months: { name: string; startDate: string; endDate: string }[] = [];
    selectedMonthIndex: number = 3;

    // Chart data
    categories: CategoryData[] = [];
    totalExpenses: number = 0;
    isLoading: boolean = true;

    // ECharts option
    chartOption: EChartsOption = {};

    // Colors for categories
    private colors = [
        '#4ADE80', // green
        '#F87171', // red
        '#60A5FA', // blue
        '#FBBF24', // yellow
        '#A78BFA', // purple
        '#FB923C', // orange
        '#2DD4BF', // teal
        '#F472B6', // pink
    ];

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.initMonths();
        this.loadChartData();
    }

    private initMonths(): void {
        const now = new Date();
        this.months = [];

        for (let i = 3; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();

            const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month + 1, 0).getDate();
            const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;

            this.months.push({
                name: this.getMonthName(month),
                startDate,
                endDate
            });
        }
    }

    private getMonthName(monthIndex: number): string {
        const names = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
            'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        return names[monthIndex];
    }

    selectMonth(index: number): void {
        this.selectedMonthIndex = index;
        this.loadChartData();
    }

    private loadChartData(): void {
        this.isLoading = true;
        const month = this.months[this.selectedMonthIndex];

        const url = `${environment.apiUrl}/api/history/transactions?type=EXPENSE&start=${month.startDate}&end=${month.endDate}&page=0&size=100`;

        this.http.get<any>(url).subscribe({
            next: (response) => {
                this.ngZone.run(() => {
                    this.processTransactions(response.transactions || []);
                    this.updateChart();
                    this.isLoading = false;
                });
            },
            error: (error) => {
                console.error('Error loading chart data:', error);
                this.ngZone.run(() => {
                    this.categories = [];
                    this.totalExpenses = 0;
                    this.updateChart();
                    this.isLoading = false;
                });
            }
        });
    }

    private processTransactions(transactions: ChartTransaction[]): void {
        const categoryMap = new Map<string, {
            totalAmount: number;
            categoryDescription: string;
            mccLogoUrl: string;
        }>();

        let total = 0;

        transactions.forEach(t => {
            const amount = Math.abs(t.amount);
            total += amount;

            const key = t.category || 'Boshqa';
            if (categoryMap.has(key)) {
                const existing = categoryMap.get(key)!;
                existing.totalAmount += amount;
            } else {
                categoryMap.set(key, {
                    totalAmount: amount,
                    categoryDescription: t.categoryDescription || t.category || 'Boshqa',
                    mccLogoUrl: t.mccLogoUrl || ''
                });
            }
        });

        this.totalExpenses = total;

        let colorIndex = 0;
        this.categories = Array.from(categoryMap.entries())
            .map(([category, data]) => ({
                category,
                categoryDescription: data.categoryDescription,
                mccLogoUrl: data.mccLogoUrl,
                totalAmount: data.totalAmount,
                percentage: total > 0 ? Number(((data.totalAmount / total) * 100).toFixed(1)) : 0,
                color: this.colors[colorIndex++ % this.colors.length]
            }))
            .sort((a, b) => b.totalAmount - a.totalAmount);
    }

    private updateChart(): void {
        const chartData = this.categories.map((cat, index) => ({
            value: cat.percentage,
            name: cat.categoryDescription,
            icon: cat.mccLogoUrl,
            itemStyle: { color: cat.color },
            label: {
                formatter: cat.mccLogoUrl && cat.percentage >= 10
                    ? `{icon${index}|}\n{val|${cat.percentage}%}`
                    : cat.percentage >= 5
                        ? `{val|${cat.percentage}%}`
                        : ''
            }
        }));

        // Build rich styles dynamically for each category icon
        const richStyles: any = {
            val: {
                fontSize: 12,
                color: '#fff',
                fontWeight: 600,
                padding: [2, 0, 0, 0],
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowBlur: 3
            }
        };

        this.categories.forEach((cat, index) => {
            if (cat.mccLogoUrl) {
                richStyles[`icon${index}`] = {
                    height: 18,
                    width: 18,
                    backgroundColor: {
                        image: cat.mccLogoUrl
                    }
                };
            }
        });

        this.chartOption = {
            tooltip: { show: false },
            legend: { show: false },
            series: [
                {
                    name: 'Expenses',
                    type: 'pie',
                    radius: ['55%', '85%'],
                    avoidLabelOverlap: false,
                    labelLine: { show: false },
                    label: {
                        show: true,
                        position: 'inside',
                        rich: richStyles
                    },
                    data: chartData
                }
            ],
            graphic: {
                type: 'group',
                left: 'center',
                top: 'center',
                children: [
                    {
                        type: 'text',
                        left: 'center',
                        top: -10,
                        style: {
                            text: 'Xarajatlarim',
                            textAlign: 'center',
                            fill: '#6B7280',
                            fontSize: 14
                        }
                    },
                    {
                        type: 'text',
                        left: 'center',
                        top: 10,
                        style: {
                            text: `${this.formatMoney(this.totalExpenses)} UZS`,
                            textAlign: 'center',
                            fill: '#1A1A1A',
                            fontSize: 18,
                            fontWeight: 700
                        }
                    }
                ]
            } as any
        };
    }

    formatMoney(amount: number): string {
        return new Intl.NumberFormat('uz-UZ').format(amount);
    }

    goBack(): void {
        this.router.navigate(['/overview']);
    }
}
