import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit {

  Creditdate: string;
  Debitdate: string;
  transactionsDataNotshow:boolean;
  referralDataNotshow:boolean;

  constructor(private headerService: HeaderInteractorService,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService,
   
  ) {

   }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Wallet')
    this.getMyWallateList();
    this.getreferralList();
  }

  getMyWallateList() {

    this.uTrackService.my_wallet_transactions().subscribe(respone => {
      if (respone.data != null && respone.data !=undefined && respone.data.length > 0) {

      this.transactionsDataNotshow=false;
        this.MyWalleteList = respone.data;

        this.MyWalleteList.forEach((row) => {
          if (row.transaction_type == "Credit") {
            this.CreditList.push(row)
            row.Creditdate = DateUtils.getDisplayDateTime(row.added_date);
          }
          if (row.transaction_type == "Debit") {
            this.DebitList.push(row)
            row.Debitdate = DateUtils.getDisplayDateTime(row.added_date);
          }
        })
      }else{
        this.transactionsDataNotshow=true;
      }
    })
  }

  getreferralList() {

    this.uTrackService.my_referrals().subscribe(respone => {
      if (respone.data != null && respone.data !=undefined && respone.data.length > 0) {
        this.referralDataNotshow=false;
        this.referralList = respone.data;
      }else{
        this.referralDataNotshow=true;
      }
    })
  }

  referralList = []
  MyWalleteList = []
  CreditList = []
  DebitList = []

  redeem() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    }
  }
}
