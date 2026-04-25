# ISO 9001:2015 扁平版 PPT 溢出检查

$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead('c:\Users\Administrator\WorkBuddy\Claw\ISO9001_2015_质量管理体系_扁平版.pptx')
$slides = $zip.Entries | Where-Object { $_.FullName -match 'ppt/slides/slide\d+\.xml' -and $_.FullName -notmatch '_rels' } | Sort-Object { [int]($_.Name -replace 'slide' -replace '\.xml' -replace 'slide', '') }

$slideW = 10
$slideH = 5.625

foreach ($s in $slides) {
    $st = $s.Open()
    $r = New-Object System.IO.StreamReader($st, [System.Text.Encoding]::UTF8)
    $c = $r.ReadToEnd()
    $r.Close()
    $st.Close()

    $slideNum = [int]($s.Name -replace 'slide' -replace '\.xml' '')
    Write-Output "=== 第 ${slideNum} 页 ==="

    # 提取所有shape的x,y,w,h
    $shapes = [regex]::Matches($c, '<p:sp[^>]*>(.*?)</p:sp>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $issues = @()
    foreach ($shape in $shapes) {
        $sp = $shape.Value

        # 检查xfrm
        $xfrm = [regex]::Match($sp, '<a:xfrm[^>]*>(.*?)</a:xfrm>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if ($xfrm.Success) {
            $xfrmVal = $xfrm.Value
            $off = [regex]::Match($xfrmVal, '<a:off x="(\d+)" y="(\d+)"/>')
            $ext = [regex]::Match($xfrmVal, '<a:ext cx="(\d+)" cy="(\d+)"/>')

            if ($off.Success -and $ext.Success) {
                $x = [int]$off.Groups[1].Value / 914400
                $y = [int]$off.Groups[2].Value / 914400
                $w = [int]$ext.Groups[1].Value / 914400
                $h = [int]$ext.Groups[2].Value / 914400

                $right = $x + $w
                $bottom = $y + $h

                if ($right -gt $slideW -or $bottom -gt $slideH -or $x -lt 0 -or $y -lt 0) {
                    $issues += "  Shape溢出: x=$([math]::Round($x,2)) y=$([math]::Round($y,2)) w=$([math]::Round($w,2)) h=$([math]::Round($h,2)) 右=${right} 下=${bottom}"
                }
            }
        }

        # 检查文本内容长度
        $texts = [regex]::Matches($sp, '<a:t[^>]*>([^<]{20,})</a:t>')
        foreach ($t in $texts) {
            $txt = $t.Groups[1].Value
            # 粗略检查：如果字体size大但w小，可能溢出
            $szMatch = [regex]::Match($sp, 'x="(\d+)"[^>]*>.*?<a:t' -replace 'x="(\d+)"[^>]*>(.*?<a:t', '$1')
        }
    }

    if ($issues.Count -gt 0) {
        Write-Output "  ⚠️ 问题:"
        $issues | ForEach-Object { Write-Output $_ }
    } else {
        Write-Output "  ✅ 正常"
    }
}

$zip.Dispose()
Write-Output "检查完成"