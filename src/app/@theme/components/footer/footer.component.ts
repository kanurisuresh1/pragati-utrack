import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created by <b><a href="http://ramkigroup.com/" target="_blank">Ramki Technologies</a></b>@2019
    </span>
    <div class="socials">
    <!--<a href="#" target="_blank" class="ion ion-social-github"></a> -->
      <a href="https://www.facebook.com/" title="facebook" target="_blank" class="ion ion-social-facebook"></a>
      <a href="http://twitter.com/" target="_blank" title="twitter" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/" target="_blank" title="linkedin" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
