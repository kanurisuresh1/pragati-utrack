import { DatePipe } from '@angular/common';

export class DateUtils {

    static date_pipe = new DatePipe('en-us');

    static getDisplayMonth(s: string): string {
        return this.date_pipe.transform(s, 'MMM yyyy');
    }

    static getDisplayTodayDate() {
        return this.date_pipe.transform(new Date(), 'dd MMM yyyy');
    }

    static getServerTodayDate() {
        return this.date_pipe.transform(new Date(), 'yyyy-MM-dd');
    }

    static getDisplayTodayDateTime() {
        return this.date_pipe.transform(new Date(), 'dd MMM yyyy hh:mm:ss a');
    }

    static getServerTodayDateTime() {
        return this.date_pipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    static getDisplayDate(s: string): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy');
    }

    static timeToDate(s: Date): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd');
    }

    static getServerDate(s: string): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd');
    }

    static getDisplayDateTime(s: string): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy hh:mm:ss a');
    }

    static getServerDateTime(s: string): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd HH:mm:ss');
    }

    static getDisplayDateFromDate(s: Date): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy');
    }

    static getServerDateFromDate(s: Date): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd');
    }

    static getDisplayDateTimeFromDate(s: Date): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy hh:mm:ss a');
    }

    static getDisplayDateTimeFromDateInMins(s: Date): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy hh:mm a');
    }

    static getServerDateTimeFromDate(s: Date): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd HH:mm:ss');
    }

    static getDisplayTime(s: Date): string {
        return this.date_pipe.transform(s, 'HH:mm:ss');
    }

    static getDisplayOnlyDate(s: string): string {
        return this.date_pipe.transform(s, 'dd MMM yyyy');
    }

    static getDisplayTimeSec(s: string): string {
        return this.date_pipe.transform(s, 'hh:mm:ss a');
    }

    static getDisplayTimeMin(s: string): string {
        return this.date_pipe.transform(s, 'hh:mm a');
    }

    static getDateDifference(s: string): number {
        return new Date(s).getTime();
    }

    static getServerDateTimeHoursMins(s: string): string {
        return this.date_pipe.transform(s, 'yyyy-MM-dd HH:mm');
    }

    static getServerTime(s: Date): string {
        return this.date_pipe.transform(s, 'HH:mm:ss');
    }

    static secondsToFormattedTime(s: any): string {
        try {
            const d = Number(s);
            const hours = Math.floor(d / 3600);
            const minutes = Math.floor(d % 3600 / 60);
            const seconds = Math.floor(d % 3600 % 60);

            const HH = hours < 10 ? '0' + hours : hours;
            const MM = minutes < 10 ? '0' + minutes : minutes;
            const SS = seconds < 10 ? '0' + seconds : seconds;
            return HH + ':' + MM + ':' + SS;
        } catch (e) {
            return '';
        }
    }
}


