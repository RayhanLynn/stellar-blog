param(
  [string]$Source = 'C:\Users\hw\Desktop\习思想题库'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Converted = Join-Path $ProjectRoot '.checks\thought-docx'

if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
  throw "找不到题库文件夹：$Source"
}

New-Item -ItemType Directory -Path $Converted -Force | Out-Null
Get-ChildItem -LiteralPath $Converted -Filter '*.docx' | Remove-Item -Force

$Word = New-Object -ComObject Word.Application
$Word.Visible = $false
$Word.DisplayAlerts = 0
try {
  $Files = Get-ChildItem -LiteralPath $Source -File | Where-Object { $_.Extension -in '.doc', '.docx' }
  if (-not $Files) { throw "文件夹中没有 .doc 或 .docx 文件：$Source" }
  foreach ($File in $Files) {
    $Target = Join-Path $Converted ($File.BaseName + '.docx')
    if ($File.Extension -eq '.docx') {
      Copy-Item -LiteralPath $File.FullName -Destination $Target -Force
      continue
    }
    Write-Host "正在转换：$($File.Name)"
    $Document = $Word.Documents.Open($File.FullName, $false, $true)
    try { $Document.SaveAs2($Target, 16) }
    finally { $Document.Close($false) }
  }
}
finally {
  $Word.Quit()
}

$env:PYTHONIOENCODING = 'utf-8'
& python (Join-Path $PSScriptRoot 'import-thought-question-bank.py') $Converted
if ($LASTEXITCODE -ne 0) { throw '题库 Markdown 生成失败。' }

Write-Host '习思想题库已同步。运行 pnpm run dev 可本地预览。' -ForegroundColor Green
