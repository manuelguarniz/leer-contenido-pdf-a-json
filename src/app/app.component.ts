import { Component } from '@angular/core';

import { convertToText, getDocument } from './utils';

declare var pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  result: any;

  async changeFile(event: any) {
    this.result = 'cargando...';
    const file = event.target.files[0] as File;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const contents = await convertToText(e.target.result, false);
      this.result = contents;
    };
    // fileReader.readAsText(file);
    fileReader.readAsBinaryString(file);
  }

  customEnconde(results): string {
    return results === null ? '' : decodeURIComponent(atob(results[1]).replace(/\+/g, ' '));
  }

  toBinary(test: string): string {
    const codeUnits = new Uint16Array(test.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = test.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
  }


}
