import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Need impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
    constructor(private translateService: TranslateService) { }

    transform(key: string): string {
        return this.translateService.get(key);
    }
}
