
SELECT 
    hm.developmentcode AS dev,
    hm.unpackedhousenum,
    hm.modelcode AS model,
    hm.elevationcode AS elev
FROM 
    housemaster hm
WHERE 
    hm.companycode = '001'
    AND hm.costflag <> 'X'
    AND hm.unpackedhousenum <> '00000000'
    AND hm.unpackedhousenum <> '99999990'
    AND hm.modelcode <> 'UNK'
    AND hm.buyername IS NOT NULL
    AND hm.developmentcode NOT IN ('00','99','RN')
    AND hm.developmentcode NOT LIKE 'X%'
    AND (
        hm.conststart_date > DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)
        OR hm.conststart_date IS NULL
    );


SELECT 
    replverify_0.completed_stamp
FROM 
    replverify replverify_0
WHERE 
    replverify_0.completed_stamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ORDER BY replverify_0.verify_id DESC



SELECT 
    shd.developmentcode, 
    shd.housenumber, 
    shd.stepnumber, 
    shd.activitycode, 
    shd.earlystartdate, 
    shd.earlyfinishdate, 
    shd.latestartdate, 
    shd.latefinishdate
FROM schedhousedetail AS shd
WHERE 
    shd.earlystartdate > '2023-06-15'
    AND shd.activitycode = '650';


SELECT 
    ud.companycode, 
    hm.developmentcode, 
    hm.unpackedhousenum, 
    ud.draftedby, 
    ud.platordereddate, 
    ud.platrecdate, 
    ud.structuralco, 
    ud.engordereddate, 
    ud.engrecvddate, 
    ud.pmrevjobdate, 
    hm.conststart_date, 
    hm.blocknumber, 
    hm.lotnumber, 
    hm.misc4_date AS 'ARB Submit', 
    hm.misc1_date AS 'ARB Approve', 
    hm.misc8_date AS 'Permit Applied', 
    hm.permit_date, 
    hm.ins1_date AS 'BBP Posted', 
    hm.misc9_date AS 'PO Released', 
    hm.buyername, 
    ud.homesiterprtdate, 
    ud.notes, 
    hm.misc2_date
FROM eva_ihms.housemaster AS hm
INNER JOIN eva_ihms.udhousemaster AS ud
    ON ud.companycode = hm.companycode
   AND ud.developmentcode = hm.developmentcode
   AND ud.housenumber = hm.housenumber
WHERE ud.companycode = '001'
  AND hm.costflag <> 'X';



SELECT 
    hm.developmentcode, 
    hm.unpackedhousenum, 
    hm.conststart_date, 
    udpm.loanstatuscom, 
    udpm.selectionduedate, 
    udpm.lifstloptduedate, 
    udpm.lscompletedate
FROM eva_ihms.housemaster AS hm
INNER JOIN eva_ihms.udprospectmst AS udpm
    ON udpm.casenumber = hm.casenumber
WHERE hm.costflag <> 'X'
  AND hm.companycode = '001';

