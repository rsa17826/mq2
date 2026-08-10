#!/usr/bin/env bash

while IFS= read -r i; do
  # i='glowstoneGlowIcon'
  temp_file="MQ2.tmp.js"
  target_file="MQ2.js"

  # 1. Safely grep and find the group using a temporary file or safer parser,
  # or use a reliable script approach without pipeline conflicts.
  # (Assuming you use a helper or safe bash extraction like below):

  regex='manager\.([[:alnum:]]+)\[[[:space:]]*manager\.'"$i"'[[:space:]]*\]'

  v=""
  while IFS= read -r line; do
    if [[ $line =~ $regex ]]; then
      v="${BASH_REMATCH[1]}"
      break
    fi
  done <"$target_file"

  # 2. If a match was found, use sed on the file separately from reading it
  if [[ -n $v ]]; then
    v="${v/%Graphic/}"
    v="${v^}"
    # Perform sed modification targeting a temp file or safely using in-place separately
    sed "s/manager\.$i/Enum.$v.${i}/g" "$target_file" >"$temp_file" && mv "$temp_file" "$target_file"
    echo "Successfully updated MQ2.js using Enum.$v"
  else
    echo "No matching pattern found."
    rm -f "$temp_file"
  fi
done <<"EOF"
ninjaMode
shield
swordIcon
key
currMes
mobVar
forbidIcon
fireIcon
top10Title
loadingLegionData
defeated
ex
check
busted
state
gender
gale
boyer
silvan
guyan
mutrovia
edelston
yukkan
harrakoth
ransiMoor
ryNolus
malMorra
brymsol
shaydeTitle
grottoTitle
unbrokenTitle
tomeGreen
tomeRed
tomeBlue
anotherSage
stalShieldIcon
ransom
girlBrown
flamesOfBrymsol
oeinsDream
steak
minerGrey
wood
wPelt
quill
gLeather
bTeeth
iOre
gHorn
yFur
fBone
rBead
vOoze
eye
transGale
transSilvan
transOllusara
transEdelston
transYukkan
transRansi
transMorra
volcanicAsh
druidBlue
upgradeStatsTitle
wind
heal
boost
guard
weak
fire
bolt
refresh
siphon
panacea
chillIcon
expIcon
banana
coconut
bait
hotChoc
currUpgrade
iCrystal
bSteel
cheese
lostShayde
tClaw
echo
mapSkill
corWiz
pearl
gOre
warpQuest
carrot
fish
corn
grapes
melon
bacon
tLeg
mint
egg
cookie
kabob
blueberry
qOre
hiddenTreasures
rageStoneIcon
glowstoneIcon
shayde
joa
brownFairy
ninjaMaster
haste
ransiJuice
dig
firstAid
escape
engage
luck
swap
collector
meditate
tracker
camp
bombIcon
dog
druidRed
honey
chillTics
sagePurple
beastslayerSoldier
lionsoulSoldier
talonscarSoldier
maskMan
wallo
sageWhite
sageGreen
bountyHunter
knightGrey
apple
girlPink
bread
EOF
