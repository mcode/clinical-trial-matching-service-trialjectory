const { default: server } = require("./server");
const AWS = require('aws-sdk');
import ClinicalTrialMatchingService from 'clinical-trial-matching-service';

exports.handler =  async function (event, context) {
    // event: contains infomration from the invoker, passed as a JSON-formatted string.
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    let service: ClinicalTrialMatchingService = await server();

    try{
        let results = await service.matcher(JSON.parse(event.body).patientData);
        return {"statusCode": 200, "body": JSON.stringify(results), "headers":{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
              'Access-Control-Allow-Headers':
              'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, WU-Api-Key, WU-Api-Secret'}};
    }catch(ex){
        console.log("EXCEPTION:" + ex);
        return {"statusCode": 500, "body": JSON.stringify(ex) , "headers":{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
              'Access-Control-Allow-Headers':
              'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, WU-Api-Key, WU-Api-Secret'}};
        }

}