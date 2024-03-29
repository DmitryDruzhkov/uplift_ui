param (
    [Parameter(Mandatory = $true)]
    [double] $GigaWatts
)

Write-Host "Test-Power"

if ($GigaWatts -ge  1.21) {
    $canWarp = $true
} else {
    $canWarp = $false
}

@{
    GigaWatts = $GigaWatts
    CanWarp = $canWarp
} | ConvertTo-Json -Compress
