import { encapsulateStyle } from '@angular/compiler';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlipperComponent } from './flipper/flipper.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlipperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'image-flipper';
}
