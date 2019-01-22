#!/bin/bash


# this script converts all files within the target directory to webp.
# it assumes you already have cwebp installed https://developers.google.com/speed/webp/docs/using

if [ -d "$1" ]; then
directory=$1; else
directory="$PWD";
fi

for filename in $directory*; 

do 
    name="${filename%.*}";
    fileExt="${filename##*.}";
    newExt=".webp";
    echo "$fileExt $directory";
    if [ $fileExt == "png" ] || [ $fileExt == "jpg" ]
        then 
            cwebp -q 80 $filename -o "$name$newExt"
    fi
done;