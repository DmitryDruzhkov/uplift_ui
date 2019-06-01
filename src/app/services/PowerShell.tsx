const powershell = require('node-powershell');

import { Observable } from 'rxjs';

export class PowerShellExec {

    executive(command: string): Observable<any>
    {
        return new Observable(observer => {
            let ps = new powershell({
                executionPolicy: 'Bypass',
                noProfile: true,
                inputEncoding: 'UTF-8',
                outputEncoding: 'UTF-8',
                pwsh: true
            })
            
            ps.addCommand(command)
        
            ps.invoke()
            .then((output: any) => {
                observer.next(output);
            })
            .catch((err: any) => {
                observer.error(err);
            });
        })
    }
}