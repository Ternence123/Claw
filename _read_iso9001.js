const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use PowerShell to read the zip
const pptxPath = 'F:/培训/ISO9001_2015_Training.pptx';

// Use PS to list zip contents and extract
const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('${pptxPath.replace(/\\/g, '\\\\')}')
$slides = $zip.Entries | Where-Object { $_.FullName -match 'ppt/slides/slide\\d+\\.xml' -and $_.FullName -notmatch '_rels' } | Sort-Object { [int]($_.Name -replace 'slide','' -replace '\\.xml','') }
foreach ($slide in $slides) {
    $content = ''
    if ($slide.Length -gt 0) {
        $stream = $slide.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
    }
    # Extract text
    $texts = [regex]::Matches($content, '<a:t[^>]*>([^<]*)</a:t>') | ForEach-Object { $_.Groups[1].Value }
    $texts = $texts | Where-Object { $_.Trim() -ne '' }
    Write-Output "=== $($slide.Name) ==="
    $texts | Select-Object -First 20 | ForEach-Object { Write-Output $_ }
}
$zip.Dispose()
`;

try {
  const result = execSync(`powershell -Command "${psScript.replace(/\n/g, ' ')}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
  console.log('Stderr:', e.stderr);
}