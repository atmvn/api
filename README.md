atm API
=======

State machine:

API for taxi:

1) get nearest atm:

curl -i -X POST -H 'Content-Type: application/json' -d'{"longtitude" : "106.63896", "lattitude": "10.827257" ,"number":"10"}' http://atm.rs.af.cm/atm/distance


2) get nearest atm based on bank ID

curl -i -X POST -H 'Content-Type: application/json' -d'{"longtitude" : "106.63896", "lattitude": "10.827257" ,"number":"10","bankID":"MB","banktype":"BRANCH }' http://localhost:3001/atm/searchID_v1


2) get nearest atm based on bank Name

curl -i -X POST -H 'Content-Type: application/json' -d'{"longtitude" : "106.63896", "lattitude": "10.827257" ,"number":"10","bankNameEN":"Vietinbank","city""HCM","banktype":"all" }' http://localhost:3001/atm/searchName_v1

3) get bank config information

http://localhost:3001/atm/configuration