Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('c:\Users\Administrator\WorkBuddy\Claw\_temp_iso9001_v2.pptx')
$slides = $zip.Entries | Where-Object { $_.FullName -match 'ppt/slides/slide\d+\.xml' -and $_.FullName -notmatch '_rels' } | Sort-Object { [int]($_.Name -replace 'slide','' -replace '\.xml','') }
$count = 0
foreach ($s in $slides) {
    $stream = $s.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $texts = [regex]::Matches($content, '<a:t[^>]*>([^<]*)</a:t>') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_.Trim() -ne '' }
    $count++
    Write-Output "Slide $count : $($texts[0])"
}
$zip.Dispose()
Write-Output "Total: $count slides"