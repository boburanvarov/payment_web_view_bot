import { Component, OnInit, NgZone, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { environment } from '../../../environments/environment';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { ThemeService } from '../../core/services/theme.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

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
    imports: [CommonModule, NgxEchartsModule, TranslatePipe, EmptyStateComponent, LoadingStateComponent],
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
    private translateService = inject(TranslateService);
    private themeService = inject(ThemeService);

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
    ) {
        // React to language changes
        effect(() => {
            this.translateService.currentLanguage();
            this.initMonths();
            if (this.categories.length > 0) {
                this.updateChart();
            }
        });
    }

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
        const keys = [
            'months.short.jan', 'months.short.feb', 'months.short.mar',
            'months.short.apr', 'months.short.may', 'months.short.jun',
            'months.short.jul', 'months.short.aug', 'months.short.sep',
            'months.short.oct', 'months.short.nov', 'months.short.dec'
        ];
        return this.translateService.get(keys[monthIndex]);
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
        // Group transactions by category
        const categoryMap = new Map<string, {
            category: string;
            categoryDescription: string;
            mccLogoUrl: string;
            total: number;
        }>();

        this.totalExpenses = 0;

        transactions.forEach((tx: ChartTransaction) => {
            const key = tx.category || 'OTHER';
            const existing = categoryMap.get(key);
            const amount = Math.abs(tx.amount);

            if (existing) {
                existing.total += amount;
            } else {
                categoryMap.set(key, {
                    category: tx.category,
                    categoryDescription: tx.categoryDescription || tx.category || 'Other',
                    mccLogoUrl: tx.mccLogoUrl || '',
                    total: amount
                });
            }
            this.totalExpenses += amount;
        });

        // Convert to array and calculate percentages
        const categoriesArray = Array.from(categoryMap.values());
        categoriesArray.sort((a, b) => b.total - a.total);

        this.categories = categoriesArray.map((cat, index) => ({
            category: cat.category,
            categoryDescription: cat.categoryDescription,
            mccLogoUrl: cat.mccLogoUrl,
            totalAmount: cat.total,
            percentage: this.totalExpenses > 0 ? Math.round((cat.total / this.totalExpenses) * 1000) / 10 : 0,
            color: this.colors[index % this.colors.length]
        }));
    }

    private updateChart(): void {
        if (this.categories.length === 0) {
            this.chartOption = {};
            return;
        }

        const chartData = this.categories.map((cat, index) => ({
            value: cat.totalAmount,
            name: cat.categoryDescription,
            itemStyle: { color: cat.color },
            label: {
                formatter: `{iconPlaceholder|${cat.percentage}%}`,
                rich: {
                    iconPlaceholder: {
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700
                    }
                }
            }
        }));

        const richStyles: any = {};

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

        const expensesLabel = this.translateService.get('chart.myExpenses');

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
                            text: expensesLabel,
                            textAlign: 'center',
                            fill: this.themeService.isDarkMode() ? '#F7F7F7' : '#6B7280',
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
                            fill: this.themeService.isDarkMode() ? '#F7F7F7' : '#1A1A1A',
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
