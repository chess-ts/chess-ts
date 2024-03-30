$running = $true

while($running) {
	Clear-Host
	Write-Output "1. Scenario Echec"
	Write-Output "2. Scenario Echec et mat"
	Write-Output "3. Scenario Pat"
	Write-Output "4. Scenario Materiel insuffisant"
	$script = Read-Host -Prompt 'Numero de script '
	Clear-Host
	switch ($script) {
		"1" { deno run check.ts }
		"2" { deno run checkmate.ts }
		"3" { deno run stalemate.ts }
		"4" { deno run insufficient.ts }
		Default { $running = $false }
	}
}