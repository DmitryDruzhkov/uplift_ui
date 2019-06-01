Register-PSRepository -Name "subpointsolutions-staging" -SourceLocation "https://www.myget.org/F/subpointsolutions-staging/api/v2" -InstallationPolicy Trusted

pwsh -c 'Install-Module -Force -Name "InvokeUplift" -Repository "subpointsolutions-staging"'