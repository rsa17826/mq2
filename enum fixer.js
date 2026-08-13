Object.entries(Enum)
  .map(([k, ks]) =>
    Object.entries(ks)
      .map(
        ([kk, v]) =>
          `sed -i 's/manager\\.${k.toLowerCase()}\\[${v}\\]/manager.${k.toLowerCase()}[Enum.${k}.${kk}]/' MQ2.js
sed -i 's/managerDisplay\\.${k.toLowerCase()}\\[${v}\\]/managerDisplay.${k.toLowerCase()}[Enum.${k}.${kk}]/' MQ2.js`,
      )
      .join("\n"),
  )
  .join("\n")
