import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BankCardComponent } from '../bank-card/bank-card.component';
import { ToastComponent, ToastType } from '../toast/toast.component';
import { Card, AddCardResponse } from '../../../core/models';
import { CardService } from '../../../core/services/card.service';
import { TelegramService } from '../../../core/services/telegram.service';

@Component({
    selector: 'app-add-card-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, BankCardComponent, ToastComponent],
    templateUrl: './add-card-modal.component.html',
    styleUrl: './add-card-modal.component.scss'
})
export class AddCardModalComponent implements OnInit, OnDestroy {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() cardAdded = new EventEmitter<void>();

    // Form groups
    cardForm!: FormGroup;
    otpForm!: FormGroup;

    // Card preview
    newCard: Card = this.getEmptyCard();
    gradientIndex = 0;
    isSubmitting = false;

    // OTP verification state
    showOtpStep = false;
    otpId = '';
    cardType = '';
    phoneMask = '';
    timerSeconds = 60;
    timerInterval: any;
    isVerifying = false;

    showToast = false;
    toastTitle = '';
    toastMessage = '';
    toastType: ToastType = 'success';
    private toastTimeout: any;

    constructor(
        private cardService: CardService,
        private fb: FormBuilder,
        private telegramService: TelegramService
    ) { }

    ngOnInit(): void {
        this.initForms();
        this.resetForm();
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    private initForms(): void {
        // Card form with validators
        this.cardForm = this.fb.group({
            cardName: ['', [Validators.required, Validators.maxLength(25)]],
            cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
            expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]]
        });

        // OTP form - 6 digit inputs
        this.otpForm = this.fb.group({
            digits: this.fb.array([
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]),
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]),
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]),
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]),
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]),
                this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)])
            ])
        });

        // Subscribe to card form changes for live preview
        this.cardForm.valueChanges.subscribe(values => {
            this.newCard.bankName = values.cardName || '';
            this.newCard.cardName = values.cardName || '';
            this.newCard.number = values.cardNumber || '';
            this.newCard.expiryDate = values.expiryDate || '';
        });
    }

    get otpDigits(): FormArray {
        return this.otpForm.get('digits') as FormArray;
    }

    private getEmptyCard(): Card {
        return {
            id: 0,
            number: '',
            balance: 0,
            gradient: '',
            bankName: '',
            cardName: '',
            expiryDate: ''
        };
    }

    resetForm(): void {
        this.newCard = this.getEmptyCard();
        this.gradientIndex = Math.floor(Math.random() * 15);
        this.showOtpStep = false;
        this.otpId = '';
        this.cardType = '';
        this.phoneMask = '';
        this.timerSeconds = 60;
        this.clearTimer();

        this.hideToast();

        if (this.cardForm) {
            this.cardForm.reset();
        }
        if (this.otpForm) {
            this.otpDigits.controls.forEach(control => control.reset());
        }
    }

    // Card number formatting
    onCardNumberInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        this.cardForm.patchValue({ cardNumber: value });
        input.value = this.formatCardNumberDisplay(value);
    }

    formatCardNumberDisplay(cardNumber: string): string {
        if (!cardNumber) return '';
        return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Expiry date formatting
    onExpiryDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 4);

        if (value.length === 0) {
            this.cardForm.patchValue({ expiryDate: '' });
            input.value = '';
            return;
        }

        if (value.length >= 2) {
            let month = parseInt(value.substring(0, 2), 10);
            if (month > 12) month = 12;
            if (month < 1) month = 1;
            value = month.toString().padStart(2, '0') + value.substring(2);
        }

        if (value.length >= 4) {
            const currentYear = new Date().getFullYear() % 100;
            let year = parseInt(value.substring(2, 4), 10);
            if (year < currentYear) year = currentYear;
            value = value.substring(0, 2) + year.toString().padStart(2, '0');
        }

        let formattedValue = value;
        if (value.length > 2) {
            formattedValue = value.substring(0, 2) + '/' + value.substring(2);
        }

        this.cardForm.patchValue({ expiryDate: formattedValue });
        input.value = formattedValue;
    }

    // Card name input
    onCardNameInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.substring(0, 25);
        input.value = value;
        this.cardForm.patchValue({ cardName: value });
    }

    isFormValid(): boolean {
        if (!this.cardForm) return false;
        const { cardName, cardNumber, expiryDate } = this.cardForm.value;
        return cardName && cardName.trim().length > 0 &&
            cardNumber && cardNumber.length === 16 &&
            expiryDate && expiryDate.length === 5;
    }

    // Submit card and go to OTP step
    submitNewCard(): void {
        if (this.isFormValid() && !this.isSubmitting) {
            this.isSubmitting = true;

            // Enable closing confirmation for Telegram WebApp
            this.telegramService.enableClosingConfirmation();

            const { cardName, cardNumber, expiryDate } = this.cardForm.value;
            const expiryWithoutSlash = expiryDate?.replace('/', '') || '';

            this.cardService.addCardToAPI({
                cardNumber: cardNumber,
                expiryDate: expiryWithoutSlash,
                cardName: cardName
            }).subscribe({
                next: (response: AddCardResponse) => {
                    this.isSubmitting = false;

                    if (!response.success) {
                        const message = response.message || "Karta qo'shishda xatolik yuz berdi";
                        this.showToastMessage('error', 'Xatolik', message);
                        this.telegramService.disableClosingConfirmation();
                        return;
                    }

                    this.otpId = response.otpId || '';
                    this.cardType = response.cardType || '';
                    this.phoneMask = response.phoneMask || '+998 ** *** ** **';
                    this.showOtpStep = true;
                    this.startTimer();
                    // Keep closing confirmation enabled until OTP is verified
                },
                error: (err: unknown) => {
                    this.isSubmitting = false;
                    console.error('Error adding card:', err);
                    this.showToastMessage('error', 'Xatolik', "Karta qo'shishda xatolik yuz berdi. Iltimos, keyinroq yana urinib ko'ring.");
                    this.telegramService.disableClosingConfirmation();
                }
            });
        }
    }

    // OTP input handling
    onOtpInput(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (value.length > 1) {
            value = value.substring(0, 1);
        }

        this.otpDigits.at(index).setValue(value);
        input.value = value;

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    }

    onOtpKeydown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;

        if (event.key === 'Backspace' && !input.value && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    }

    onOtpPaste(event: ClipboardEvent): void {
        event.preventDefault();
        const pastedData = event.clipboardData?.getData('text') || '';
        const digits = pastedData.replace(/\D/g, '').substring(0, 6);

        for (let i = 0; i < 6; i++) {
            this.otpDigits.at(i).setValue(digits[i] || '');
            const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
            if (input) {
                input.value = digits[i] || '';
            }
        }

        const lastFilledIndex = Math.min(digits.length, 5);
        const focusInput = document.getElementById(`otp-${lastFilledIndex}`);
        if (focusInput) {
            focusInput.focus();
        }
    }

    getOtpCode(): string {
        return this.otpDigits.controls.map(c => c.value).join('');
    }

    isOtpComplete(): boolean {
        return this.otpForm.valid && this.getOtpCode().length === 6;
    }

    // Timer methods
    startTimer(): void {
        this.timerSeconds = 60;
        this.clearTimer();
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            if (this.timerSeconds <= 0) {
                this.clearTimer();
            }
        }, 1000);
    }

    clearTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    getFormattedTimer(): string {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Resend OTP
    resendOtp(): void {
        if (this.timerSeconds > 0) return;

        const { cardName, cardNumber, expiryDate } = this.cardForm.value;
        const expiryWithoutSlash = expiryDate?.replace('/', '') || '';

        this.cardService.addCardToAPI({
            cardNumber: cardNumber,
            expiryDate: expiryWithoutSlash,
            cardName: cardName
        }).subscribe({
            next: (response: AddCardResponse) => {
                if (!response.success) {
                    const message = response.message || "Kodni qayta yuborishda xatolik yuz berdi";
                    this.showToastMessage('error', 'Xatolik', message);
                    this.otpDigits.controls.forEach(c => c.reset());
                    return;
                }

                this.otpId = response.otpId || '';
                this.cardType = response.cardType || '';
                this.otpDigits.controls.forEach(c => c.reset());
                this.startTimer();
            },
            error: (err: unknown) => {
                console.error('Error resending OTP:', err);
                this.otpDigits.controls.forEach(c => c.reset());
                this.showToastMessage('error', 'Xatolik', "Kodni qayta yuborishda xatolik yuz berdi");
            }
        });
    }

    // Verify OTP
    verifyOtp(): void {
        if (!this.isOtpComplete() || this.isVerifying) return;

        this.isVerifying = true;
        const { cardName, cardNumber, expiryDate } = this.cardForm.value;
        const expiryWithoutSlash = expiryDate?.replace('/', '') || '';

        this.cardService.verifyCardOTP({
            cardNumber: cardNumber,
            expiryDate: expiryWithoutSlash,
            code: this.getOtpCode(),
            cardType: this.cardType,
            otpId: this.otpId,
            cardName: cardName
        }).subscribe({
            next: () => {
                this.isVerifying = false;
                this.telegramService.disableClosingConfirmation();
                this.cardAdded.emit();
                this.closeModal();
            },
            error: (err: unknown) => {
                this.isVerifying = false;
                console.error('Error verifying OTP:', err);
                this.showToastMessage('error', 'Xatolik', "Tasdiqlash kodini tekshirishda xatolik yuz berdi");
                this.telegramService.disableClosingConfirmation();
            }
        });
    }

    private showToastMessage(type: ToastType, title: string, message: string): void {
        this.toastType = type;
        this.toastTitle = title;
        this.toastMessage = message;
        this.showToast = true;

        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        this.toastTimeout = setTimeout(() => {
            this.hideToast();
        }, 3000);
    }

    hideToast(): void {
        this.showToast = false;
    }

    closeModal(): void {
        this.telegramService.disableClosingConfirmation();
        this.resetForm();
        this.close.emit();
    }
}
