$port = 5500
$prefix = "http://localhost:$port/"
$webRoot = Join-Path $PSScriptRoot "frontend-web"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host " Smart City Customer & Professor Portal is LIVE: $prefix"
    Write-Host "=========================================================="

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        # URL decode path
        $decodedPath = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = Join-Path $webRoot ($decodedPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            $contentType = "text/html; charset=utf-8"
            switch ($ext) {
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                ".pdf"  { $contentType = "application/pdf" }
                ".zip"  { $contentType = "application/zip" }
                ".sql"  { $contentType = "text/plain; charset=utf-8" }
                ".md"   { $contentType = "text/markdown; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".ico"  { $contentType = "image/x-icon" }
            }

            # If download param or file is zip/pdf, add content-disposition
            $fileName = [System.IO.Path]::GetFileName($filePath)
            if ($ext -eq ".zip" -or $ext -eq ".pdf" -or $ext -eq ".sql") {
                $response.AddHeader("Content-Disposition", "attachment; filename=`"$fileName`"")
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server info: $_"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
