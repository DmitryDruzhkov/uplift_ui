import * as React from 'react';
import { Alert, Button } from 'reactstrap';

import { PowerShellExec } from '../services/PowerShell';

export class Register extends React.Component<any, any> {

    powerShellExec = new PowerShellExec();

    constructor(
        props: any,
    )
    {
        super(props);

        this.state = {
            isRegisterInvokeUplift: this.props.isRegisterInvokeUplift
        }

        this.registerInvokeUplift = this.registerInvokeUplift.bind(this);
        this.unRegisterInvokeUplift = this.unRegisterInvokeUplift.bind(this);
    }

    registerInvokeUplift() {
        this.powerShellExec.executive("src/app/uplift/Invoke-Uplift_Register")
            .subscribe(result => {
                console.log(result)
                //показать результат регистрации

                this.setState({isRegisterInvokeUplift: true});
            })
    }

    unRegisterInvokeUplift() {
        this.powerShellExec.executive("src/app/uplift/Invoke-Uplift_UnRegister")
            .subscribe(result => {
                console.log(result)
                //показать результат регистрации

                this.setState({isRegisterInvokeUplift: false});
            })
    }

    public render() {
        if(this.state.isRegisterInvokeUplift){
            return (
                <div className='register'>
                    <Alert color="success" className='register-state'>
                        Invoke-Uplift зарегистрирован
                        <Button onClick={this.unRegisterInvokeUplift} color="success">
                            Отменить регистрацию Invoke-Uplift
                        </Button>
                    </Alert>
                    
                </div>
            )
        } 
        else
        {
            return (
                <div className='register'>
                    <Alert color="danger" className='register-state'>
                        Invoke-Uplift не зарегистрирован
                        <Button onClick={this.registerInvokeUplift} color="danger">
                            Зарегистрировать Invoke-Uplift
                        </Button >
                    </Alert>
                </div>
            )
        }
    }
}