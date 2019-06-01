import * as React from 'react';

import { Distributivs } from './Distrubutivs';
import { PowerShellExec } from '../services/PowerShell';
import { Register } from './Register'
import { Spinner } from 'reactstrap';

export class Main extends React.Component<any, any> {

    ps: any;

    powerShellExec = new PowerShellExec();

    isWaitCheckRegister: boolean = true;

    constructor(props: any) {
        super(props);

        this.checkIsRegisterInvokeUplift();

        this.state = { 
            isRegisterInvokeUplift: false,
            isWaitCheckRegister: true
        };
    }

    checkIsRegisterInvokeUplift() {
        this.powerShellExec.executive("src/app/uplift/invoke-Uplift_CheckRegister")
            .subscribe(result => {
                this.setRegisterInvokeUpliftState(result);
                
                this.setState({ isWaitCheckRegister: false });
            })
    }

    setRegisterInvokeUpliftState(result: string) {
        if (result.indexOf('WARNING: Unable to find module repositories.') === -1 && result.indexOf("subpointsolutions-staging") !== -1) {
            this.setState({ isRegisterInvokeUplift: true });
        }
    }

    public render() {
        return (
            <div>
            { this.state.isWaitCheckRegister ?
                <div className='registerWait'>
                    <Spinner color="primary" />
                </div> : 
                <div>
                    <Register 
                        isRegisterInvokeUplift={this.state.isRegisterInvokeUplift}
                    />
                    <Distributivs
                        isRegisterInvokeUplift={this.state.isRegisterInvokeUplift}
                    />
                </div> 
            }
            </div>
        );
    }
}