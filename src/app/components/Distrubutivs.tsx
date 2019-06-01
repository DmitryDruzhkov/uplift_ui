import * as React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Spinner, Button } from 'reactstrap';

import { PowerShellExec } from '../services/PowerShell';

import '../styles/style.css';

export class Distributivs extends React.Component<any, any> {

    powerShellExec = new PowerShellExec();

    checkedForDownload: Soft[] = [];

    downloaded: number = 0;

    softs: Soft[] = [];

    constructor(
        props: any,
    )
    {
        super(props);

        this.state = { 
            softs: [],
            checked: 0,
            downloaded: this.downloaded,
            isGettingSoftList: false,
            choosenFolder: ''
        };

        /* this.getResources = this.getResources.bind(this); */
        this.getResources();

        this.downloadSoft = this.downloadSoft.bind(this);
        this.downloadCheckedSoft = this.downloadCheckedSoft.bind(this);
        this.checkSoftForDownload = this.checkSoftForDownload.bind(this);
        this.addDirectory = this.addDirectory.bind(this);
        this.showOpenFileDlg = this.showOpenFileDlg.bind(this);
    }

    getResources() {
        this.powerShellExec.executive("src/app/uplift/Invoke-Uplift_ResourseList")
            .subscribe(result => {
                /* console.log(result) */
                this.buildListResourses(result)
            })
    }

    buildListResourses(output: any) {
        let resourcesArr = output.split(':')[4].split(' - ');

        if(resourcesArr.length === 0) return;

        this.softs = this.getSoftFromOutput(resourcesArr);

        this.setState({ isGettingSoftList: true })
        this.setState({ softs: this.softs });
    }

    getSoftFromOutput(resourcesArr: string[]): Soft[]{
        let softs: Soft[] = [];
        
        for(let resource of resourcesArr){
            let soft: Soft = new Soft();

            soft.title = resource.trim();

            if(!!soft.title) softs.push(soft);
        }

        return softs;
    }

    checkSoftForDownload(theSoft: Soft){
        let existIndex = this.checkedForDownload.findIndex(soft => soft.title === theSoft.title);

        if(existIndex === -1){
            this.checkedForDownload.push(theSoft);

            theSoft.isCheked = true;
        } 

        if(existIndex !== -1 && !theSoft.isDownloaded) {
            this.checkedForDownload.splice(existIndex, 1);

            theSoft.isCheked = false;
        };

        this.setState({ checked: this.checkedForDownload.length });
    }

    unckekSoftForDownload(){
        this.checkedForDownload.map(soft => {
            if(!soft.isDownloaded) soft.isCheked = false;
        });

        this.setState({ checked: this.checkedForDownload.length });
    }

    async downloadCheckedSoft(){
        if(!this.state.choosenFolder) return;
        
        for(let soft of this.checkedForDownload)
        {
            if(soft.isDownloaded) continue;
            
            soft.isDownloading = true;
            
            let result = await this.downloadSoft(soft.title);
            
            soft.isDownloading = false;
            soft.isDownloaded = true;
            
            this.downloaded++;
            this.setState({ downloaded: this.downloaded });

            console.log(result);
        }
    }

    downloadSoft(title: string) {
        return new Promise((resolve, reject) => {
            title = title.trim();

            this.powerShellExec.executive(`invoke-uplift resource download ${title} -repository ${this.state.choosenFolder}`)
            .subscribe(result => {
                resolve(result);
            })
        });
    }

    showOpenFileDlg = () => {
        document.getElementById('inputFolder').click();
    }

    handleChange = (selected: FileList) => {
        console.log(selected);
        if(!selected.length) return;

        let choosenFolder = selected[0]['path'];
        this.setState({ choosenFolder: choosenFolder });
    }

    filterSoft(event: any){
        let filterText: string = event.target.value.trim();

        if(!!filterText){
            this.setState({ softs: this.softs.filter((soft: Soft) => soft.title.indexOf(filterText) !== -1)});
        } 
        else{
            this.setState({ softs: this.softs });
        }
    }

    addDirectory(node: any) {
        if (node) {
          node.directory = true;
          node.webkitdirectory = true;
        }
      }

    public render() {
        let listItems = undefined

        if(this.state.softs)
        {
            listItems = this.state.softs.map((soft: Soft, index: number) => 
                <div
                key={index}
                onClick={(e: any) => {e.preventDefault(); this.checkSoftForDownload(soft)}}
                className={`
                    ${soft.isDownloaded ? 'soft-downloaded' : ''}
                    ${soft.isCheked ? 'soft-check' : 'soft-unCheck'}
                    soft-item
                `}>
                    <label className="container">{soft.title}
                        <input type="checkbox" checked={soft.isCheked}/>
                        <span className="checkmark"></span>
                    </label>
                </div>
            );
        }

        
        return (
            <div className='resourses'>
                <div className='resourses-filter'>
                    <input type="text" placeholder="Введите название программы для фильтрации" onChange={this.filterSoft.bind(this)}/>
                </div>
                {
                    this.state.isGettingSoftList
                    ?
                    <div className="resourses-list">
                        {listItems}
                    </div>
                    :
                    <Spinner color="primary" />
                }
                <div className='resourses-bottom'>
                    <div className='resourses-bottom-left'>
                        <input 
                        id='inputFolder'
                        ref={(node) => { this.addDirectory(node); }} 
                        type="file" 
                        style={{ display: 'none' }}
                        onChange={ (event) => this.handleChange(event.target.files) }/>
                        <Button onClick={this.showOpenFileDlg} color="secondary">
                            Выбрать папку
                        </Button>
                        <div className='resourses-bottom-folder'> 
                            { 
                                !!this.state.choosenFolder
                                ? <span>{this.state.choosenFolder}</span>
                                : <span className='resourses-bottom-folder-error'>Выберите папку для сохранения</span>
                            }
                        </div>
                    </div>
                    <div className='resourses-bottom-right'>
                        <Button onClick={() => this.downloadCheckedSoft()} color="secondary" type='button' className='btn-uncheck'>
                            Снять выделения
                        </Button>
                        <Button onClick={() => this.downloadCheckedSoft()} color="success" type='button'>
                            {this.state.checked} / {this.state.downloaded} Скачать
                        </Button>
                    </div>
                    
                </div>
            </div>
        );
        
        
    }

}

export class Soft {

    title: string = '';
    isCheked: boolean = false;
    isDownloaded: boolean = false;
    isDownloading: boolean = false;

    constructor(){}

}