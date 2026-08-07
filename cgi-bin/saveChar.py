#!/usr/bin/env python3
import os
import re

reg = re.compile("&stat\\d+=([^&]+)")
# reg = re.compile("&stat\\d+=(-?\\d+(?:\\.\\d+)?)")
print("Content-Type: text/plain")
print() # blank line is REQUIRED
try:
    with open(
        os.path.join(os.path.dirname(__file__), "../MQ2Files/loadChar2.php"), "w"
    ) as file:
        newstr = re.findall(reg, os.environ.get("QUERY_STRING", ""))
        file.write(" ".join(newstr))
        print("go", end="")


except Exception as e:
    print("stop", end="")
