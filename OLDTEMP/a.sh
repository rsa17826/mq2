#!/usr/bin/env bash

while IFS= read -r i; do
  # i='glowstoneGlowIcon'
  temp_file="MQ2.tmp.js"
  target_file="MQ2.js"
echo "${i//./'\.'}"
    sed "s/${i//./'\.'}/manager.${i##*.}/g" "$target_file" >"$temp_file" && mv "$temp_file" "$target_file"
    echo "Successfully updated MQ2.js using Enum.$v"
done <<"EOF"
Enum.Item.woodpile
Enum.Magic.window
Enum.Magic.weakenedGraphic
Enum.BatMes.currMes
Enum.Magic.refreshActive
Enum.Magic.fireTics
Enum.Icon.keyboard
Enum.Icon.checkDay
Enum.Skill.digits
Enum.Char.state
Enum.Magic.refreshArmorDelay
Enum.Magic.boltDelay
Enum.Magic.refreshFade
Enum.Magic.firewallFade
Enum.Skill.engaged
Enum.Magic.weaknessTriggered
Enum.Magic.boostHits
Enum.Magic.refreshTics
Enum.Icon.chillTics
Enum.Icon.shieldBlocks
Enum.WizNumber.corWiz
Enum.Magic.refreshArmorPow
Enum.Magic.currUpgrade
Enum.Food.hotChocActive
Enum.Skill.luckTics
Enum.Skill.collectorTics
Enum.Skill.meditateActive
Enum.Magic.refreshGeneralTics
Enum.Magic.refreshStaffTics
Enum.Icon.expHitBonus
Enum.Icon.expBonus
Enum.Magic.firePower
Enum.Mob.mobVar
Enum.Magic.windowsOut
Enum.Icon.keys
Enum.Titles.defeated
Enum.Titles.gale
Enum.Titles.boyer
Enum.Titles.silvan
Enum.Titles.guyan
Enum.Titles.mutrovia
Enum.Titles.edelston
Enum.Titles.yukkan
Enum.Titles.harrakoth
Enum.Titles.ransiMoor
Enum.Titles.ryNolus
Enum.Titles.malMorra
Enum.Titles.upgradeStatsTitle
Enum.Titles.top10Title
Enum.Titles.ninjaMode
Enum.Titles.brymsol
Enum.Titles.loadingLegionData
Enum.Titles.shaydeTitle
Enum.Titles.grottoTitle
Enum.Titles.unbrokenTitle
Enum.TransLocas.transGale
Enum.TransLocas.transSilvan
Enum.TransLocas.transOllusara
Enum.TransLocas.transEdelston
Enum.TransLocas.transYukkan
Enum.TransLocas.transRansi
Enum.TransLocas.transMorra
Enum.Titles.defeatedSound
Enum.Icon.explodeSound
Enum.Magic.boltSound
Enum.Magic.guardChar
EOF
