const SCP = require('aws-sdk');

let objectStorage = new SCP.S3({
    endpoint: 'https://obj1.kr-east-1.samsungsdscloud.com:8443',
    accessKeyId: '',
    secretAccessKey: '',
    s3ForcePathStyle: true
});

// Create Bucket
//objectStorage.createBucket({
//    Bucket: 'objhwan
//}, (error, success) => {
//    if(error) {
//        console.log(error);
//    }
//    console.log(success);
//})

// Put Object
//objectStorage.putObject({
//    Bucket: 'objhwan',
//    Key: 'my-txt-file.txt',
//    Body: Buffer('This is my text file')
//}, (error, success) => {
//    if(error) {
//        console.log(error);
//    }
//    console.log(success);
//})


// Delete Object
//objectStorage.deleteObject({
//    Bucket: 'objhwan',
//    Key: 'my-txt-file.txt'
//}, (error, success) => {
//    if(error) {
//        console.log(error);
//    }
//    console.log(success);
//})

// Delete Bucket
objectStorage.deleteBucket({
    Bucket: 'objhwan'
}, (error, success) => {
    if(error) {
        console.log(error);
    }
    console.log(success);
})