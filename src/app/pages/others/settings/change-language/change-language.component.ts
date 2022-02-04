import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss'],
})
export class ChangeLanguageComponent implements OnInit {
 

  constructor(private translate: TranslateService) {

  }

  language_code: string;

  ngOnInit(): void {
    this.language_code = localStorage.getItem('LANGUAGE');
    if (this.language_code === null ||this.language_code === '' || this.language_code === undefined) {
      this.language_code = 'en';
    }

    this.translate.addLangs(['en','bn','gu','hi','kn','ml','mr','or','ta','te']);
    this.translate.setDefaultLang(this.language_code);

  }


  selectLanguageForm = new FormGroup({
    selectoptionLanguage: new FormControl()
  })


  dashBoardDropDown() {
    localStorage.setItem('LANGUAGE',this.selectLanguageForm.value.selectoptionLanguage);
    this.translate.use(this.selectLanguageForm.value.selectoptionLanguage);
  }
}

