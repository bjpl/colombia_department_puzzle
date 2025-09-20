# Project Analysis Script
# Analyzes all projects in Project_Workspace for git status, duplicates, and organization

Write-Host "=== PROJECT WORKSPACE ANALYSIS ===" -ForegroundColor Cyan
Write-Host "Analyzing git repositories and project organization..."
Write-Host ""

$results = @()

# Function to analyze a directory
function Analyze-Project {
    param($path, $name)

    $projectInfo = @{
        Name = $name
        Path = $path
        IsGitRepo = $false
        RemoteUrl = ""
        LastCommit = ""
        CommitDate = ""
        UncommittedFiles = 0
        FileCount = 0
        HasUnpushedCommits = $false
    }

    if (Test-Path "$path\.git") {
        $projectInfo.IsGitRepo = $true

        Push-Location $path
        try {
            # Get remote URL
            $remote = git remote -v 2>$null | Select-Object -First 1
            if ($remote) {
                $projectInfo.RemoteUrl = ($remote -split '\t')[1] -replace ' \(fetch\)', ''
            }

            # Get last commit
            $lastCommit = git log --oneline -1 2>$null
            if ($lastCommit) {
                $projectInfo.LastCommit = $lastCommit
                $projectInfo.CommitDate = git log -1 --format="%cd" --date=short 2>$null
            }

            # Count uncommitted files
            $uncommitted = git status --porcelain 2>$null
            if ($uncommitted) {
                $projectInfo.UncommittedFiles = ($uncommitted | Measure-Object).Count
            }

            # Check for unpushed commits
            $unpushed = git log origin/main..HEAD 2>$null
            if ($unpushed) {
                $projectInfo.HasUnpushedCommits = $true
            }
        }
        catch {
            Write-Host "Error analyzing git repo at $path" -ForegroundColor Red
        }
        finally {
            Pop-Location
        }
    }

    # Count files
    $files = Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue
    $projectInfo.FileCount = ($files | Measure-Object).Count

    return $projectInfo
}

# Analyze root-level projects
Write-Host "Root-level projects:" -ForegroundColor Yellow
$rootProjects = @("coding_in_spanish", "colombia_puzzle_game", "learn_strudel")
foreach ($project in $rootProjects) {
    if (Test-Path $project) {
        $info = Analyze-Project -path $project -name $project
        $results += $info
        Write-Host "  $project - Git: $($info.IsGitRepo) - Files: $($info.FileCount)"
    }
}

Write-Host ""
Write-Host "Active-development projects:" -ForegroundColor Yellow

# Analyze active-development projects
$activeDevPath = "active-development"
if (Test-Path $activeDevPath) {
    $projects = Get-ChildItem -Path $activeDevPath -Directory
    foreach ($project in $projects) {
        $info = Analyze-Project -path $project.FullName -name $project.Name
        $results += $info
        $status = if ($info.IsGitRepo) { "Git" } else { "No Git" }
        $uncommitted = if ($info.UncommittedFiles -gt 0) { " ($($info.UncommittedFiles) uncommitted)" } else { "" }
        Write-Host "  $($project.Name) - $status - Files: $($info.FileCount)$uncommitted"
    }
}

Write-Host ""
Write-Host "=== ANALYSIS RESULTS ===" -ForegroundColor Cyan

# Find duplicates by remote URL
Write-Host ""
Write-Host "DUPLICATE REPOSITORIES:" -ForegroundColor Red
$grouped = $results | Where-Object { $_.RemoteUrl -ne "" } | Group-Object RemoteUrl
foreach ($group in $grouped) {
    if ($group.Count -gt 1) {
        Write-Host "Remote: $($group.Name)" -ForegroundColor Yellow
        foreach ($proj in $group.Group) {
            Write-Host "  - $($proj.Name) (Files: $($proj.FileCount), Last: $($proj.CommitDate), Uncommitted: $($proj.UncommittedFiles))"
        }
        Write-Host ""
    }
}

# Projects without git
Write-Host "PROJECTS WITHOUT GIT:" -ForegroundColor Red
$noGit = $results | Where-Object { -not $_.IsGitRepo }
foreach ($proj in $noGit) {
    Write-Host "  - $($proj.Name) (Files: $($proj.FileCount))"
}

# Projects with uncommitted changes
Write-Host ""
Write-Host "PROJECTS WITH UNCOMMITTED CHANGES:" -ForegroundColor Yellow
$uncommitted = $results | Where-Object { $_.UncommittedFiles -gt 0 }
foreach ($proj in $uncommitted) {
    Write-Host "  - $($proj.Name): $($proj.UncommittedFiles) files"
}

# Projects with unpushed commits
Write-Host ""
Write-Host "PROJECTS WITH UNPUSHED COMMITS:" -ForegroundColor Yellow
$unpushed = $results | Where-Object { $_.HasUnpushedCommits }
foreach ($proj in $unpushed) {
    Write-Host "  - $($proj.Name)"
}

Write-Host ""
Write-Host "Analysis complete. Total projects analyzed: $($results.Count)" -ForegroundColor Green