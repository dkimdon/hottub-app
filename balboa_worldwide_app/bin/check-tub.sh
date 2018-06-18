#!/bin/bash
set -x 
eval `/home/dkimdon/src/balboa_worldwide_app/bin/bwa_status 10.0.0.5`

CONDITIONS=`/usr/bin/curl -s "http://api.openweathermap.org/data/2.5/weather?zip=97333,us&units=imperial&APPID=92aa48a52860d455d851f82134bf7b80"`

OUTSIDE_TEMPERATURE=`echo $CONDITIONS | jq .main.temp`

TARGET_FOR_TIME_ESTIMATE=$SET_TEMPERATURE
NOW=`date +%s`
HOT_TS=`awk "BEGIN { print ($TARGET_FOR_TIME_ESTIMATE-$CURRENT_TEMPERATURE)/ 4.5 * 60 * 60 + $NOW}"`
HOT_TIME=`date -d @$HOT_TS +"%I:%M %p"`


if [ "$HEATING" == "true" ]; then

#To: cohohottubclub@googlegroups.com

/usr/sbin/ssmtp dkimdon@gmail.com << EOF
To: dkimdon@gmail.com
From: dkimdon@gmail.com
Subject: tub heating, now at $CURRENT_TEMPERATURE ºF, expected to reach $TARGET_FOR_TIME_ESTIMATE ºF at $HOT_TIME

The CoHo Hot Tub is heating and the current water temperature is $CURRENT_TEMPERATURE ºF.

The tub is estimated to be ready ($TARGET_FOR_TIME_ESTIMATE ºF) at $HOT_TIME.

The tub is set to the $TEMPERATURE_RANGE temperature range with a target temperature of $SET_TEMPERATURE ºF.
  
The current outside air temperature is $OUTSIDE_TEMPERATURE ºF.

This is an automatically generated email.

EOF

fi

#Spa Details:
#$DETAILS
#Outside Weather Details:
#$CONDITIONS
