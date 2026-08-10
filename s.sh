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
EOF
